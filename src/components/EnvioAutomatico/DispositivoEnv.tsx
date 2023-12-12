import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ProgressBar, List } from 'react-native-paper'
import {
  solicitarConexao,
  enviar,
  validaResposta,
  ler,
  validaGravado,
} from '@/libs/envioAutomatico'
import { Container } from '@/components/ui/Container'
import { checklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
type DispositivoEnvProps = {
  devices: {
    name: string
    ID: string
    nomeArquivo: string
  }
  strings: string[]
  contagemDeEnvio: number
  atualizaContagemDeEnvio: (valor: boolean) => void
  attFilaDeEnvio: (
    ID: string,
    name: string,
    nomeArquivo: string,
    retirar: boolean,
  ) => void
  filaDeEnvio: DispositivoEnvProps['devices'][]
}
export const DispositivoEnv = ({
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
  const [enviado, setEnviado] = useState<boolean>(false)
  const [enviando, setEnviando] = useState<boolean>(false)

  const envioArquivo = useCallback(
    async (address: string) => {
      for (let i = 0; i < strings.length; i++) {
        let enviarLinha = true
        console.log(devices.name + ' Começando linha ' + (i + 1))
        let tentativas = 0
        let nullos = 0
        const linha = strings[i]
        if (linha.length > 0) {
          do {
            if (enviarLinha) {
              await enviar(address, linha)
              enviarLinha = false
            }
            const resposta = await ler(address)
            console.log(devices.name + ' tentativa ' + tentativas)
            if (resposta === null) {
              nullos++
              console.log(devices.name + ' nullos ' + nullos)
              if (nullos > 3) {
                enviarLinha = true
                nullos = 0
              }
            } else if (resposta === 'ER grava') {
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
            setTentativasConexoes(tentativasConexoes + 1)
            break
          }
        }
      }
      await checklistEnviado(devices.name, address, devices.nomeArquivo)
      setProgressBar(strings.length)
      await enviar(address, '43480102030405060708')
      await RNBluetoothClassic.disconnectFromDevice(address)
      atualizaContagemDeEnvio(false)
      setEnviarNovamente(false)
      setEnviado(true)
      setEnviando(false)
      attFilaDeEnvio(devices.ID, devices.name, devices.nomeArquivo, true)
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
      console.log('solicitando conexão')
      const conexao = await solicitarConexao(address)
      if (conexao === 'OK') {
        console.log('conexão OK')
        await enviar(address, '524D')
        const resposta = await validaResposta(address)
        if (resposta === 'apagado') {
          console.log('apagado')
          await envioArquivo(address)
        } else {
          console.log(devices.name + ' Erro ao limpar o modulo')
          atualizaContagemDeEnvio(false)
          setTentativasConexoes(tentativasConexoes + 1)
          setEnviando(false)
        }
      } else {
        console.log(devices.name + ' Erro de autenticação com o Módulo')
        atualizaContagemDeEnvio(false)
        setTentativasConexoes(tentativasConexoes + 1)
        setEnviando(false)
      }
    },
    [atualizaContagemDeEnvio, devices.name, tentativasConexoes, envioArquivo],
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
            setTentativasConexoes(tentativasConexoes + 1)
            setEnviando(false)
          })
      } else {
        await enviosLeituras(address)
      }
    },
    [atualizaContagemDeEnvio, devices.name, enviosLeituras, tentativasConexoes],
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
      console.log(
        'entrei ' + devices.ID + ' - ' + contagemDeEnvio + '/' + enviado,
      )
      if (tentativasConexoes > 3) {
        setEnviarNovamente(true)
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
  return (
    <>
      <Container key={devices.ID}>
        <List.Item
          style={{
            backgroundColor: 'rgba(0,170,255,0.2)',
            borderRadius: 10,
            minHeight: 80,
          }}
          titleStyle={{ fontWeight: '700' }}
          title={`${devices.name}`}
          description={() => (
            <>
              <Text>{Math.floor((progressBar * 100) / strings.length)}%</Text>
              {progressBar > 0 && progressBar < strings.length && (
                <ProgressBar
                  progress={(progressBar * 100) / strings.length / 100}
                  color="#5E84E2"
                  style={styles.progress}
                />
              )}
            </>
          )}
          left={() => <List.Icon icon="bluetooth" />}
          right={() => (
            <>
              {enviarNovamente && (
                <Pressable
                  onPress={() => {
                    setTentativasConexoes(0)
                  }}
                >
                  <FontAwesome name="send-o" color="#5E84E2" size={30} />
                </Pressable>
              )}
              {progressBar === strings.length && (
                <FontAwesome name="check-circle" color="#66aa66" size={30} />
              )}
            </>
          )}
        />
      </Container>
    </>
  )
}
const styles = StyleSheet.create({
  progress: {
    height: 10,
    width: '100%',
  },
})
export default DispositivoEnv
