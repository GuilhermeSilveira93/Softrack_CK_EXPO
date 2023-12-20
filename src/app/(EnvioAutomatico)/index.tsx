import React, { useState, useCallback } from 'react'
import { Stack } from 'expo-router'
import { Pressable, Text, ScrollView, RefreshControl } from 'react-native'
import DispositivoEnv from '@/components/EnvioAutomatico/DispositivoEnv'
import { fetchArquivo } from '@/libs/localDataBase/st_checklist'
import { FetchListaDeEnvio } from '@/libs/dispositivos'
import { Container } from '@/components/ui/Container'
import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router/src/useFocusEffect'
import { useColorScheme } from 'nativewind'
type EnvioAutomaticoProps = {
  listaDeEnvio: {
    ID: string
    name: string
    nomeArquivo: string
  }[]
}
export const EnvioAutomatico = () => {
  const [strings, setStrings] = useState<string[]>([])
  const [contagemDeEnvio, setContagemDeEnvio] = useState<number>(0)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [atualizarTudo, setAtualizarTudo] = useState<boolean>(false)
  const [listaDeEnvio, setListaDeEnvio] = useState<
    EnvioAutomaticoProps['listaDeEnvio']
  >([])
  const [filaDeEnvio, setFilaDeEnvio] = useState<
    EnvioAutomaticoProps['listaDeEnvio']
  >([])
  const { colorScheme } = useColorScheme()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        FetchListaDeEnvio().then((res) => {
          setListaDeEnvio(res)
        }),
        fetchArquivo().then((res) => setStrings(res)),
      ])
    }, []),
  )
  const attFilaDeEnvio = useCallback(
    (ID: string, name: string, nomeArquivo: string, retirar: boolean) => {
      if (!retirar) {
        let existe = false
        if (filaDeEnvio.length > 0) {
          filaDeEnvio.forEach((item) => {
            existe = item.ID === ID || existe
          })
        }
        const fila = [{ ID, name, nomeArquivo }]
        if (!existe) {
          setFilaDeEnvio((prev) => [...prev, ...fila])
        }
      } else {
        setFilaDeEnvio((prev) => prev.filter((item) => item.ID !== ID))
      }
    },
    [filaDeEnvio],
  )
  const atualizaContagemDeEnvio = (valor: boolean) => {
    if (valor) {
      setContagemDeEnvio((prev) => prev + 1)
    } else {
      setContagemDeEnvio((prev) => prev - 1)
    }
  }
  const onRefresh = useCallback(() => {
    if (contagemDeEnvio === 0) {
      setRefreshing(true)
      setAtualizarTudo(!atualizarTudo)
      setTimeout(() => {
        setRefreshing(false)
      }, 2000)
    }
  }, [atualizarTudo, contagemDeEnvio])

  if (listaDeEnvio?.length > 0 && strings?.length > 0) {
    return (
      <Container>
        <Stack.Screen
          options={{
            title: `Atualizando dispositivos`,
            headerStyle: {
              backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
            },
            headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
            headerRight: () => (
              <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    color={`${colorScheme === 'dark' ? '#fff' : '#293541'}`}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <ScrollView
          contentContainerStyle={{ minHeight: 'auto' }}
          fadingEdgeLength={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {listaDeEnvio.map((dispositivo) => {
            return (
              <DispositivoEnv
                devices={dispositivo}
                contagemDeEnvio={contagemDeEnvio}
                strings={strings}
                filaDeEnvio={filaDeEnvio}
                atualizaContagemDeEnvio={atualizaContagemDeEnvio}
                attFilaDeEnvio={attFilaDeEnvio}
                key={dispositivo.ID}
              />
            )
          })}
        </ScrollView>
      </Container>
    )
  } else {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    color={`${colorScheme === 'dark' ? '#293541' : '#ccc'}`}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Container>
          <Text className="dark:text-dark-100">
            Para enviar o checklist, é necessario ter uma lista de dispositivos
            e um arquivo previamente carregado.
          </Text>
          <Text className="dark:text-dark-100">
            Navegue para as abas anteriores e faça o processo.
          </Text>
        </Container>
      </>
    )
  }
}
export default EnvioAutomatico
