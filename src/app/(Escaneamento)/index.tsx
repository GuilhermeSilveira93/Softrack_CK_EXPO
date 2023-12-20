import React, { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/ui/Container'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { Stack } from 'expo-router'
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
  const { canStart, start, tourKey } = useTourGuideController('escaneamento')
  const { colorScheme } = useColorScheme()
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
            /* res, */
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
        <ActivityIndicator
          size="large"
          color={`${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'}`}
        />
      </Container>
    )
  }
  if (!scanning && dispositivos.length < 1) {
    return (
      <Container>
        <Pressable
          className="bg-dark-200 shadow-dark-200 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100"
          onPress={() => startScan()}
        >
          <Text className="text-white dark:text-dark-100">Escanear</Text>
        </Pressable>
      </Container>
    )
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (canStart) {
                  start()
                }
              }}
            >
              {({ pressed }) => (
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  color={`${
                    colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                  }`}
                  size={25}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <TourGuideZone
        zone={1}
        tourKey={tourKey}
        text={
          'Para adicionar um dispositivo, é necessário Parear, caso isso nunca tenha sido feito.\nClique em qualquer região do dispositivo desejado para Parear.'
        }
        borderRadius={5}
        style={{
          position: 'absolute',
          top: 32,
          left: 4,
          height: 127,
          width: '98%',
        }}
      />
      <TourGuideZone
        zone={2}
        tourKey={tourKey}
        text={
          'Caso já esteja Pareado, um "Switch" irá aparecer no lado direito.\nClique em qualquer lugar para alterná-lo para adicionar à lista de Dispositivos.'
        }
        borderRadius={5}
        style={{
          position: 'absolute',
          top: 32,
          left: 4,
          height: 127,
          width: '98%',
        }}
      />
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
                className="bg-dark-200 shadow-dark-200 dark:shadow-dark-100 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl"
                disabled={scanning}
                onPress={() => setDispositivos([])}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={30}
                  color={`${colorScheme === 'dark' ? '#f00' : '#fff'}`}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-white">Limpar Lista</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  )
}
export default EscanearDispositivos
