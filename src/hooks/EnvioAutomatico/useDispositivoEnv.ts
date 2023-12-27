import { useState, useEffect, useCallback } from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'

import { DispositivoEnvProps } from '@/types/dispositivoEnv'

import { useEnvioArquivo } from './useEnvioArquivo'
import { useEnviosLeituras } from './useEnviosLeituras'
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
  const [enviando, setEnviando] = useState<boolean>(false)
  const { enviado, envioArquivo } = useEnvioArquivo({
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
  })
  const { enviosLeituras } = useEnviosLeituras({
    setStatus,
    envioArquivo,
    atualizaContagemDeEnvio,
    setTentativasConexoes,
    setEnviando,
    devices,
  })
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
      if (tentativasConexoes > 3) {
        setEnviarNovamente(true)
        setStatus('Envio Falhou')
      } else {
        setEnviando(true)
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
