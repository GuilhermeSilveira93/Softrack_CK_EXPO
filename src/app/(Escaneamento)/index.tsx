import React, { useState, useEffect, useCallback } from 'react'
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native'
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic'

import Dispositivos from '@/components/Escaneamento/Dispositivos'
import { P, Button } from '@/components/ui'
import { Container } from '@/components/ui/Container'

import { fetchDevices } from '@/libs/dispositivos'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
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
      setTimeout(async () => {
        await RNBluetoothClassic.cancelDiscovery()
        console.log('escaneamento parado')
      }, 1000 * 20)
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
        <Container>
          <TourGuideZone
            zone={3}
            tourKey={tourKey}
            text={'Caso não esteja vendo dispositivos, escaneie novamente.'}
          >
            <Button variant="normal" onPress={() => startScan()}>
              <P variant="button">Escanerar</P>
            </Button>
          </TourGuideZone>
        </Container>
      </>
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
      <Container>
        <ScrollView
          fadingEdgeLength={1}
          refreshControl={
            <RefreshControl refreshing={scanning} onRefresh={startScan} />
          }
        >
          {dispositivos?.map((device, index) => {
            return (
              <Dispositivos
                index={index}
                tourKey={tourKey}
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
              <Button
                variant="delete"
                disabled={scanning}
                onPress={() => setDispositivos([])}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={30}
                  color={'#fff'}
                  style={{ marginRight: 10 }}
                />
                <P variant="button">Limpar Lista</P>
              </Button>
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  )
}
export default EscanearDispositivos
