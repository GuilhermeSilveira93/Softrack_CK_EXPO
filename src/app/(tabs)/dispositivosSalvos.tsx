import { useFocusEffect, Link, Stack } from 'expo-router'
import React, { useState, useCallback } from 'react'
import {
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  View,
} from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { useColorScheme } from 'nativewind'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-paper'
import { Container } from '@/components/ui/Container'
import Dispositivos from '@/components/DispositivosSalvos/Dispositivos'
import { EscanearDispositivosProps } from '../(Escaneamento)'
export const DispositivosSalvos = () => {
  const { colorScheme } = useColorScheme()
  const [localDevices, setLocalDevices] =
    useState<EscanearDispositivosProps['localDevices']>()
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true)
  const { canStart, start, tourKey } = useTourGuideController('dispositivos')
  useFocusEffect(
    useCallback(() => {
      fetchDevices().then((res) => {
        setLocalDevices(res)
        setLoadingDevices(false)
      })
    }, []),
  )
  const attLocalDevices = async (
    novosDispositivos: EscanearDispositivosProps['localDevices'],
  ) => {
    setLocalDevices(novosDispositivos)
  }
  if (loadingDevices) {
    return (
      <Container>
        <ActivityIndicator
          size="large"
          color={`${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'}`}
        />
      </Container>
    )
  }
  if (!localDevices || localDevices?.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
            },
            headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
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
                    size={25}
                    color={`${
                      colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                    }`}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Container>
          <TourGuideZone
            zone={1}
            tourKey={tourKey}
            text={'Clique para escanear os dispositivos próximos.'}
          >
            <Link href={'/(Escaneamento)'} asChild>
              <Pressable className="bg-dark-200 shadow-dark-200 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100">
                <MaterialCommunityIcons
                  name="forklift"
                  size={30}
                  color={`${
                    colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#FFF'
                  }`}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-white">Escanear Dispositivos</Text>
              </Pressable>
            </Link>
          </TourGuideZone>
        </Container>
      </>
    )
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
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
                  size={25}
                  color={`${
                    colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                  }`}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <TourGuideZone
        zone={4}
        tourKey={tourKey}
        text={
          'Com dispositivos e arquivo adicionados no Aparelho\nvocê pode seguir para a tela de "Enviar.'
        }
        style={{
          position: 'absolute',
          bottom: '-9%',
          right: '8%',
          height: 55,
          width: 65,
        }}
      />
      <Container>
        <ScrollView fadingEdgeLength={1}>
          {localDevices?.map((devices, index) => {
            return (
              <Dispositivos
                tourKey={tourKey}
                index={index}
                name={devices.name}
                ID={devices.ID}
                dispositivosSalvos={localDevices}
                key={devices.ID}
                attLocalDevices={attLocalDevices}
              />
            )
          })}
          <Divider
            style={{
              width: '100%',
              height: 5,
              backgroundColor: 'rgb(200,200,200)',
              marginVertical: 10,
            }}
          />
          <View className="flex p-4 items-center w-full">
            <Link href={'/(Escaneamento)'} asChild>
              <Pressable className="bg-dark-200 shadow-dark-200 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100">
                <MaterialCommunityIcons
                  name="forklift"
                  size={30}
                  color={`${
                    colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#FFF'
                  }`}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-white">Escanear Dispositivos</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </Container>
    </>
  )
}
export default DispositivosSalvos
