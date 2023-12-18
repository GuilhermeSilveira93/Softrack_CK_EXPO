import React, { useState, useCallback } from 'react'
import { useRouter, Link, Stack } from 'expo-router'
import { Pressable, ScrollView, View, Text } from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import { Divider } from 'react-native-paper'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { Container } from '@/components/ui/Container'
import Dispositivos from '@/components/ListaDeEnvioChecklist/Dispositivos'
import { EscanearDispositivosProps } from '../(Escaneamento)'
import { LocalDevicesProps } from '@/types/localDevicesProps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
import { useFocusEffect } from 'expo-router/src/useFocusEffect'
import { useColorScheme } from 'nativewind'
export const ListaDeEnvioChecklist = () => {
  const { colorScheme } = useColorScheme()
  const router = useRouter()
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps['localDevices']
  >([])
  const [listaDeEnvio, setListaDeEnvio] = useState<LocalDevicesProps[]>([])
  const { canStart, start, tourKey } = useTourGuideController('listaDeEnvio')
  const [nomeArquivo, setNomeArquivo] = useState<string>('')
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchDevices().then(
          (res: EscanearDispositivosProps['localDevices']) => {
            if (res.length > 0) {
              setLocalDevices(res)
            } else {
              router.push('/(tabs)/')
            }
          },
        ),
        fetchNomeArquivo().then((res) => setNomeArquivo(res)),
        setListaDeEnvio([]),
      ])
    }, [router]),
  )
  const ListaDeEnvio = useCallback(
    async (ID: string, name: string, nomeArquivo: string) => {
      let existe = false
      listaDeEnvio.forEach((item) => {
        if (item.ID === ID) {
          existe = true
        }
      })
      if (existe) {
        const dispositivos = listaDeEnvio.filter((item) => item.ID !== ID)
        setListaDeEnvio(dispositivos)
        await AsyncStorage.removeItem('listaDeEnvio')
        await AsyncStorage.setItem('listaDeEnvio', JSON.stringify(dispositivos))
      } else {
        const dispositivos = [...listaDeEnvio, { ID, name, nomeArquivo }]
        setListaDeEnvio(dispositivos)
        await AsyncStorage.removeItem('listaDeEnvio')
        await AsyncStorage.setItem('listaDeEnvio', JSON.stringify(dispositivos))
      }
    },
    [listaDeEnvio],
  )
  const incluirTodos = async () => {
    if (listaDeEnvio.length === localDevices.length) {
      await AsyncStorage.removeItem('listaDeEnvio')
      await AsyncStorage.setItem('listaDeEnvio', '')
      setListaDeEnvio([])
    } else {
      await AsyncStorage.removeItem('listaDeEnvio')
      await AsyncStorage.setItem('listaDeEnvio', JSON.stringify(localDevices))
      setListaDeEnvio(localDevices)
    }
  }
  return (
    <Container>
      <TourGuideZone
        zone={1}
        tourKey={tourKey}
        text={
          'Selecione individualmente os dispositivos para os quais deseja enviar o arquivo previamente selecionado'
        }
        borderRadius={20}
        style={{
          position: 'absolute',
          top: 70,
          right: 33,
          height: 40,
          width: 40,
        }}
      />
      <TourGuideZone
        zone={2}
        tourKey={tourKey}
        text={
          'Alternativamente, é possivel selecionar todos os dispositivos de uma única vez.'
        }
        borderRadius={17}
        style={{
          position: 'absolute',
          top: -15,
          right: 52,
          height: 30,
          width: 30,
        }}
      />
      <TourGuideZone
        zone={3}
        tourKey={tourKey}
        text={
          'Com os dispositivos selecionados, clique aqui para iniciar o processo de envio.'
        }
        borderRadius={15}
        tooltipBottomOffset={20}
        style={{
          position: 'absolute',
          bottom: -12,
          right: 25,
          height: 70,
          width: '90%',
        }}
      />
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable onPress={() => incluirTodos()}>
                {({ pressed }) => (
                  <AntDesign
                    name="checkcircle"
                    color={`${
                      colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                    }`}
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
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
            </View>
          ),
        }}
      />
      <ScrollView>
        {localDevices?.map((devices) => {
          let existe = false
          listaDeEnvio.forEach((dispositivo) => {
            if (dispositivo.ID === devices.ID) {
              existe = true
            }
          })
          return (
            <Dispositivos
              name={devices.name}
              ID={devices.ID}
              dispositivosSalvos={localDevices}
              key={devices.ID}
              listaDeEnvio={ListaDeEnvio}
              nomeArquivo={nomeArquivo}
              existe={existe}
            />
          )
        })}
      </ScrollView>
      <View className="flex p-4 items-center w-full absolute bottom-0">
        <Divider
          style={{
            width: '100%',
            height: 2,
            backgroundColor: 'rgb(200,200,200)',
          }}
        />
        <Link href={'/(EnvioAutomatico)'} asChild>
          <Pressable className="bg-dark-200 shadow-dark-200 dark:bg-dark-300 p-4 rounded-2xl flex flex-row items-center shadow-xl dark:shadow-dark-100">
            <MaterialCommunityIcons
              name="file-send"
              size={30}
              color={`${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#FFF'}`}
              style={{ marginRight: 10 }}
            />
            <Text className="text-white">
              Enviar para Dispositivos Selecionados
            </Text>
          </Pressable>
        </Link>
      </View>
    </Container>
  )
}
export default ListaDeEnvioChecklist
