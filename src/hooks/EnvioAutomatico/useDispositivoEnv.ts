import { useState, useEffect, useCallback } from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import {
  solicitarConexao,
  enviar,
  validaResposta,
  ler,
  validaGravado,
} from '@/libs/envioAutomatico'
import { checklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { DispositivoEnvProps } from '@/types/dispositivoEnv'
export const useDispositivoEnv = ({
  devices,
  strings,
  atualizaContagemDeEnvio,
  contagemDeEnvio,
  attFilaDeEnvio,
  filaDeEnvio,
}: DispositivoEnvProps) => {
  const [progressBar, setProgressBar] = useState<number>(0)
  const [enviarNovamente, setEnviarNovamente] = useState<boolean>(false)
  const [tentativasConexoes, setTentativasConexoes] = useState<number>(0)
  const [status, setStatus] = useState<string>('')
  const [enviado, setEnviado] = useState<boolean>(false)
  const [enviando, setEnviando] = useState<boolean>(false)
  const tipo = 'hex'

  const envioArquivo = useCallback(
    async (address: string) => {
      setStatus('Enviando.')
      for (let i = 0; i < strings.length; i++) {
        let enviarLinha = true
        let tentativas = 0
        let nullos = 0
        const linha = strings[i]
        if (linha.length > 0) {
          do {
            if (enviarLinha) {
              console.log('Enviando linha ' + linha)
              await enviar(address, linha, tipo)
              enviarLinha = false
            }
            const resposta = await ler(address)
            console.log(
              devices.name + ' tentativa ' + tentativas + ' - ' + resposta,
            )
            if (resposta === null) {
              nullos++
              console.log(devices.name + ' nullos ' + nullos)
              if (nullos > 3) {
                enviarLinha = true
                nullos = 0
                setTentativasConexoes((prev) => prev + 1)
              }
            } else if (resposta.includes('ER grava')) {
              enviarLinha = true
              tentativas++
            } else {
              const validacaoCRC = await validaGravado(linha, resposta)
              if (validacaoCRC) {
                setProgressBar(i + 1)
                tentativas = 5
              } else {
                enviarLinha = true
                tentativas++
              }
            }
          } while (tentativas <= 3)
          if (tentativas === 4) {
            atualizaContagemDeEnvio(false)
            setTentativasConexoes((prev) => prev + 1)
            break
          }
        }
      }
      if (tentativasConexoes > 3) {
        console.log('Falha ' + (tentativasConexoes === 5 ? 'CRC' : 'Envio'))
      } else {
        await checklistEnviado(devices.name, address, devices.nomeArquivo)
        setProgressBar(strings.length)
        await enviar(address, '43480102030405060708', tipo)
        await RNBluetoothClassic.disconnectFromDevice(address)
        setStatus('Enviado.')
        atualizaContagemDeEnvio(false)
        setEnviarNovamente(false)
        setEnviado(true)
        setEnviando(false)
        attFilaDeEnvio(devices.ID, devices.name, devices.nomeArquivo, true)
      }
    },
    [
      attFilaDeEnvio,
      atualizaContagemDeEnvio,
      devices.ID,
      devices.name,
      devices.nomeArquivo,
      strings,
      tentativasConexoes,
    ],
  )
  const enviosLeituras = useCallback(
    async (address: string) => {
      setStatus('Conectando...')
      const conexao = await solicitarConexao(address)
      if (conexao === 'OK') {
        console.log('conexão OK')
        await enviar(address, '524D', tipo)
        const resposta = await validaResposta(address)
        if (resposta === 'apagado') {
          console.log('apagado')
          await envioArquivo(address)
        } else {
          console.log(devices.name + ' Erro ao limpar o modulo')
          atualizaContagemDeEnvio(false)
          setTentativasConexoes((prev) => prev + 1)
          setEnviando(false)
        }
      } else {
        console.log(devices.name + ' Erro de autenticação com o Módulo')
        atualizaContagemDeEnvio(false)
        setTentativasConexoes((prev) => prev + 1)
        setEnviando(false)
      }
    },
    [atualizaContagemDeEnvio, devices.name, envioArquivo],
  )
  const conectarDispositivo = useCallback(
    async (address: string) => {
      setProgressBar(0)
      setEnviarNovamente(false)
      const conectado = await RNBluetoothClassic.isDeviceConnected(
        address,
      ).then((res) => {
        return res
      })
      if (!conectado) {
        console.log('conectado')
        await RNBluetoothClassic.connectToDevice(address)
          .then(async () => {
            await enviosLeituras(address)
          })
          .catch(async (err) => {
            console.log(devices.name + ' erro conectarDipositivo ' + err)
            atualizaContagemDeEnvio(false)
            setTentativasConexoes((prev) => prev + 1)
            setEnviando(false)
          })
      } else {
        await enviosLeituras(address)
      }
    },
    [atualizaContagemDeEnvio, devices.name, enviosLeituras],
  )
  useEffect(() => {
    let index = -1
    let existe = false
    filaDeEnvio.forEach((item, i) => {
      index = item.ID === devices.ID ? i : index
      existe = item.ID === devices.ID || existe
    })
    if (
      index > -1 &&
      index < 5 &&
      !enviando &&
      !enviado &&
      contagemDeEnvio <= 5
    ) {
      setEnviando(true)
      if (tentativasConexoes > 3) {
        setEnviarNovamente(true)
        setStatus('Envio Falhou')
      } else {
        atualizaContagemDeEnvio(true)
        conectarDispositivo(devices.ID)
      }
    } else if (index === -1 && !enviado) {
      attFilaDeEnvio(devices.ID, devices.name, devices.nomeArquivo, false)
    }
  }, [
    attFilaDeEnvio,
    atualizaContagemDeEnvio,
    contagemDeEnvio,
    conectarDispositivo,
    devices.ID,
    devices.name,
    devices.nomeArquivo,
    enviado,
    enviando,
    filaDeEnvio,
    tentativasConexoes,
  ])
  return {
    conectarDispositivo,
    enviando,
    progressBar,
    tentativasConexoes,
    enviarNovamente,
    status,
    enviado,
    setTentativasConexoes,
  }
}
