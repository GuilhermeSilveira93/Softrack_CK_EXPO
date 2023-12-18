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
                    color={`${colorScheme === 'dark' ? '#fff' : '#293541'}`}
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
            borderRadius={5}
            style={{
              position: 'absolute',
              bottom: '42%',
              right: '20%',
              height: 70,
              width: '65%',
            }}
          />
          <Link href={'/(Escaneamento)'} asChild>
            <Pressable className="dark:bg-dark-300 bg-dark-200 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100 shadow-dark-200">
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
                  color={`${colorScheme === 'dark' ? '#fff' : '#293541'}`}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <TourGuideZone
        zone={2}
        tourKey={tourKey}
        text={
          'Os dispositivos salvos, são exibidos nesta tela\nNa tela "Enviar", você poderá\nselecionar os dispositivos que deseja\natualizar.'
        }
        style={{
          position: 'absolute',
          top: 35,
          left: 20,
          height: 90,
          width: '89%',
        }}
      />
      <TourGuideZone
        zone={3}
        tourKey={tourKey}
        text={'Para remover o dispositivo do aparelho, basta clicar aqui.'}
        borderRadius={25}
        tooltipBottomOffset={20}
        style={{
          position: 'absolute',
          top: '8%',
          right: '7.5%',
          height: 50,
          width: 50,
        }}
      />
      <TourGuideZone
        zone={4}
        tourKey={tourKey}
        text={
          'Com dispositivos e arquivo adicionados no Aparelho\nvocê pode seguir para a tela de "Enviar.'
        }
        borderRadius={25}
        tooltipBottomOffset={20}
        style={{
          position: 'absolute',
          bottom: '-11%',
          right: 30,
          height: 55,
          width: 65,
        }}
      />
      <Container>
        <ScrollView fadingEdgeLength={1}>
          {localDevices?.map((devices) => {
            return (
              <Dispositivos
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
              <Pressable className="bg-dark-200 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100 shadow-dark-200">
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
