import { useFocusEffect, Link } from 'expo-router'
import React, { useState, useCallback } from 'react'
import {
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  View,
} from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-paper'
import { Container } from '@/components/ui/Container'
import Dispositivos from '@/components/DispositivosSalvos/Dispositivos'
import { EscanearDispositivosProps } from '../(Escaneamento)'
export const DispositivosSalvos = () => {
  const [localDevices, setLocalDevices] =
    useState<EscanearDispositivosProps['localDevices']>()
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true)
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
        <ActivityIndicator size="large" color="rgb(0, 255, 159)" />
      </Container>
    )
  }
  if (!localDevices || localDevices?.length === 0) {
    return (
      <>
        <Container>
          <Link href={'/(Escaneamento)'} asChild>
            <Pressable className="dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl shadow-dark-100">
              <MaterialCommunityIcons
                name="forklift"
                size={30}
                color={'rgb(0, 255, 159)'}
                style={{ marginRight: 10 }}
              />
              <Text className="dark:text-dark-100">Escanear Dispositivos</Text>
            </Pressable>
          </Link>
        </Container>
      </>
    )
  }
  return (
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
        <Link href={'/(Escaneamento)'} asChild>
          <View className="flex p-4 items-center w-full">
            <Pressable className="dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl shadow-dark-100">
              <MaterialCommunityIcons
                name="forklift"
                size={30}
                color={'rgb(0, 255, 159)'}
                style={{ marginRight: 10 }}
              />
              <Text className="dark:text-white">Escanear Dispositivos</Text>
            </Pressable>
          </View>
        </Link>
      </ScrollView>
    </Container>
  )
}
export default DispositivosSalvos
