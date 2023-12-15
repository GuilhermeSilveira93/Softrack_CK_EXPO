import React, { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/ui/Container'
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic'
import { ActivityIndicator, RefreshControl } from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import Dispositivos from '@/components/Escaneamento/Dispositivos'
import { Scroll } from '@/components/ui/Scroll'
import { Button } from 'react-native-paper'
export type EscanearDispositivosProps = {
  localDevices: {
    ID: string
    name: string
    nomeArquivo?: string
  }[]
  scanning: boolean
  showModal: boolean
  handleDeviceID: string
  handleDeviceNAME: string
}
export const EscanearDispositivos = () => {
  const [bloqueio, setBloqueio] = useState<boolean>(false)
  const [dispositivos, setDispositivos] = useState<BluetoothDevice[]>([])
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps['localDevices']
  >([])
  const [scanning, setScanning] =
    useState<EscanearDispositivosProps['scanning']>(false)

  const startScan = useCallback(async () => {
    try {
      setScanning(true)
      console.log('Iniciando escaneamento...')
      await RNBluetoothClassic.startDiscovery()
        .then((res: BluetoothDevice[]) => {
          setDispositivos(
            res.filter((devices) => devices.name.includes('SFTK_BT')),
          )
        })
        .catch((err) => {
          alert(err)
        })
      console.log('Escaneado')
    } catch (error) {
      console.log(error)
    } finally {
      setScanning(false)
    }
  }, [])
  useEffect(() => {
    fetchDevices().then((res) => setLocalDevices(res))
    startScan()
  }, [startScan])
  const setaBloqueio = () => {
    setBloqueio((prev) => !prev)
  }

  const attLocalDevices = async (
    novosDispositivos: EscanearDispositivosProps['localDevices'],
  ) => {
    setLocalDevices(novosDispositivos)
  }
  if (scanning) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#1c73d2" />
      </Container>
    )
  }
  if (!scanning && dispositivos.length < 1) {
    return (
      <Container>
        <Button
          mode="contained-tonal"
          style={{
            backgroundColor: '#1c73d2',
            paddingVertical: 5,
            paddingHorizontal: 15,
          }}
          textColor="#fff"
          onPress={() => startScan()}
        >
          Escanear
        </Button>
      </Container>
    )
  }
  return (
    <Container>
      <Scroll
        contentContainerStyle={{ minHeight: 'auto' }}
        fadingEdgeLength={1}
        refreshControl={
          <RefreshControl refreshing={scanning} onRefresh={startScan} />
        }
      >
        {dispositivos?.map((device) => {
          return (
            <Dispositivos
              setaBloqueio={setaBloqueio}
              bloqueio={bloqueio}
              key={device.id}
              dispositivosSalvos={localDevices}
              name={device.name}
              ID={device.id}
              attLocalDevices={attLocalDevices}
            />
          )
        })}
        {dispositivos.length > 0 && (
          <Button
            disabled={scanning}
            mode="contained-tonal"
            icon="trash-can"
            style={{
              backgroundColor: '#1c73d2',
              paddingVertical: 5,
              paddingHorizontal: 15,
            }}
            textColor="#fff"
            onPress={() => setDispositivos([])}
          >
            Limpar Lista
          </Button>
        )}
      </Scroll>
    </Container>
  )
}
export default EscanearDispositivos
