import { useCallback, useState } from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import { enviar, ler, validaGravado } from '@/libs/envioAutomatico'
import { checklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { envioArquivoProps } from '@/@types/envioArquivo'
export const useEnvioArquivo = ({
  strings,
  setStatus,
  devices,
  setTentativasConexoes,
  setProgressBar,
  atualizaContagemDeEnvio,
  tentativasConexoes,
  setEnviarNovamente,
  setEnviando,
  attFilaDeEnvio,
}: envioArquivoProps) => {
  const [enviado, setEnviado] = useState<boolean>(false)
  const tipo = 'hex'

  const envioArquivo = useCallback(
    async (address: string) => {
      setStatus('Enviando.')
      let tentativas = 0
      for (let i = 0; i < strings.length; i++) {
        tentativas = 0
        let enviarLinha = true
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
      if (tentativasConexoes > 3 || tentativas > 3) {
        setStatus('Falha no envio.')
        setEnviado(false)
        setEnviando(false)
        setEnviarNovamente(true)
        setProgressBar(0)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attFilaDeEnvio(devices.ID, devices.name, devices.nomeArquivo!, true)
        console.log('Falha ' + (tentativasConexoes === 5 ? 'CRC' : 'Envio'))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await checklistEnviado(devices.name, address, devices.nomeArquivo!)
        setProgressBar(strings.length)
        await enviar(address, '43480102030405060708', tipo)
        await RNBluetoothClassic.disconnectFromDevice(address)
        setStatus('Enviado.')
        atualizaContagemDeEnvio(false)
        setEnviarNovamente(false)
        setEnviado(true)
        setEnviando(false)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attFilaDeEnvio(devices.ID, devices.name, devices.nomeArquivo!, true)
      }
    },
    [
      attFilaDeEnvio,
      atualizaContagemDeEnvio,
      devices.ID,
      devices.name,
      devices.nomeArquivo,
      setEnviando,
      setEnviarNovamente,
      setProgressBar,
      setStatus,
      setTentativasConexoes,
      strings,
      tentativasConexoes,
    ],
  )
  return {
    envioArquivo,
    enviado,
  }
}
