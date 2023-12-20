import React, { useState, useCallback } from 'react'
import { Stack } from 'expo-router'
import { Pressable, Text, ScrollView, RefreshControl, View } from 'react-native'
import DispositivoEnv from '@/components/EnvioAutomatico/DispositivoEnv'
import { fetchArquivo } from '@/libs/localDataBase/st_checklist'
import { FetchListaDeEnvio } from '@/libs/dispositivos'
import { Container } from '@/components/ui/Container'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router/src/useFocusEffect'
import { useColorScheme } from 'nativewind'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
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
  const { canStart, start, tourKey } = useTourGuideController('envioChecklist')
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
        <TourGuideZone
          zone={2}
          tourKey={tourKey}
          text={
            'Icone para tentar novamente.\nPS: Clicando aqui, será enviado o arquivo previamente carregado para TODOS da lista.'
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
            title: `Enviando Arquivo`,
            headerStyle: {
              backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
            },
            headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                  {({ pressed }) => (
                    <MaterialCommunityIcons
                      name="update"
                      size={25}
                      color={`${
                        colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                      }`}
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
        <ScrollView
          contentContainerStyle={{ minHeight: 'auto' }}
          fadingEdgeLength={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {listaDeEnvio.map((dispositivo, index) => {
            return (
              <DispositivoEnv
                devices={dispositivo}
                index={index}
                tourKey={tourKey}
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
                  <MaterialCommunityIcons
                    name="update"
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
