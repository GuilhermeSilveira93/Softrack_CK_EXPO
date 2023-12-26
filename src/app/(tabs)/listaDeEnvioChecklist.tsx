import React, { useState, useCallback } from 'react'
import { useRouter, Link, Stack, useFocusEffect } from 'expo-router'
import { Pressable, ScrollView, View } from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import { Divider } from 'react-native-paper'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import Dispositivos from '@/components/ListaDeEnvioChecklist/Dispositivos'
import { P, Button, Container } from '@/components/ui'
import { EscanearDispositivosProps } from '../(Escaneamento)'
import { LocalDevicesProps } from '@/types/localDevicesProps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
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
        zone={2}
        tourKey={tourKey}
        text={
          'Alternativamente, é possivel selecionar todos os dispositivos de uma única vez.'
        }
        borderRadius={17}
        style={{
          position: 'absolute',
          top: -40,
          right: 52,
          height: 30,
          width: 30,
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
        {localDevices?.map((devices, index) => {
          let existe = false
          listaDeEnvio.forEach((dispositivo) => {
            if (dispositivo.ID === devices.ID) {
              existe = true
            }
          })
          return (
            <Dispositivos
              index={index}
              tourKey={tourKey}
              name={devices.name}
              ID={devices.ID}
              key={devices.ID}
              listaDeEnvio={ListaDeEnvio}
              nomeArquivo={nomeArquivo}
              existe={existe}
            />
          )
        })}
      </ScrollView>
      <Divider
        style={{
          width: '100%',
          height: 5,
          backgroundColor: 'rgb(200,200,200)',
          marginVertical: 10,
        }}
      />
      <View className="flex p-3 items-center w-full">
        <TourGuideZone
          zone={3}
          tourKey={tourKey}
          text={
            'Com os dispositivos selecionados, clique aqui para iniciar o processo de envio.'
          }
        >
          <Link href={'/(EnvioAutomatico)'} asChild>
            <Button variant="normal">
              <MaterialCommunityIcons
                name="file-send"
                size={30}
                color={`${
                  colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#FFF'
                }`}
                style={{ marginRight: 10 }}
              />
              <P variant="button">Enviar para Dispositivos Selecionados</P>
            </Button>
          </Link>
        </TourGuideZone>
      </View>
    </Container>
  )
}
export default ListaDeEnvioChecklist
