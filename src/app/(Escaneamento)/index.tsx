import React, { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/ui/Container'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import Dispositivos from '@/components/Escaneamento/Dispositivos'
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
        <ActivityIndicator size="large" color="rgb(0, 255, 159)" />
      </Container>
    )
  }
  if (!scanning && dispositivos.length < 1) {
    return (
      <Container>
        <Pressable
          className="dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl shadow-dark-100"
          onPress={() => startScan()}
        >
          <Text className="dark:text-dark-100">Escanear</Text>
        </Pressable>
      </Container>
    )
  }
  return (
    <Container>
      <ScrollView
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
          <View className="flex p-4 items-center w-full">
            <Pressable
              className="dark:bg-dark-300 max-w-[60%] p-4 rounded-2xl flex flex-row items-center shadow-xl shadow-dark-100"
              disabled={scanning}
              onPress={() => setDispositivos([])}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={30}
                color={'#f00'}
                style={{ marginRight: 10 }}
              />
              <Text className="dark:text-white">Limpar Lista</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}
export default EscanearDispositivos
