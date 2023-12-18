import React, { useState, useCallback } from 'react'
import { useRouter, Link, Stack } from 'expo-router'
import { Pressable } from 'react-native'
import { fetchDevices } from '@/libs/dispositivos'
import { Divider, Button } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Container } from '@/components/ui/Container'
import Dispositivos from '@/components/ListaDeEnvioChecklist/Dispositivos'
import { EscanearDispositivosProps } from '../(Escaneamento)'
import { LocalDevicesProps } from '@/types/localDevicesProps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
import { useFocusEffect } from 'expo-router/src/useFocusEffect'
import { Scroll } from '@/components/ui/Scroll'
export const ListaDeEnvioChecklist = () => {
  const router = useRouter()
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps['localDevices']
  >([])
  const [listaDeEnvio, setListaDeEnvio] = useState<LocalDevicesProps[]>([])
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
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => incluirTodos()}>
              {({ pressed }) => (
                <AntDesign
                  name="checkcircle"
                  color={'rgb(0, 255, 159)'}
                  size={25}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Scroll>
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
        <Divider
          style={{
            width: '100%',
            height: 5,
            backgroundColor: 'rgb(200,200,200)',
            marginVertical: 10,
          }}
        />
        <Link href={'/(EnvioAutomatico)'} asChild>
          <Button
            icon="magnify-scan"
            mode="contained"
            style={{ backgroundColor: '#1c73d2' }}
          >
            Enviar para Dispositivos Selecionados
          </Button>
        </Link>
      </Scroll>
    </Container>
  )
}
export default ListaDeEnvioChecklist
