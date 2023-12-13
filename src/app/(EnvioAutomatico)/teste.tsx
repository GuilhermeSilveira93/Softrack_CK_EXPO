// EnvioAutomatico.js
import React from 'react'
import { ScrollView, RefreshControl, Pressable, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Container } from '@/components/ui/Container'
import { Stack } from 'expo-router'
import DispositivoEnv from '@/components/EnvioAutomatico/DispositivoEnv'
import { useEnvioAutomatico } from './useEnvioAutomatico'

export const EnvioAutomatico = () => {
  const {
    strings,
    contagemDeEnvio,
    refreshing,
    atualizarTudo,
    listaDeEnvio,
    filaDeEnvio,
    attFilaDeEnvio,
    atualizaContagemDeEnvio,
    onRefresh,
  } = useEnvioAutomatico()

  if (listaDeEnvio?.length > 0 && strings?.length > 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: `Enviar Checklist ${contagemDeEnvio}`,
            headerRight: () => (
              <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
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
      </>
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
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Container>
          <Text>
            Para enviar o checklist, é necessário ter uma lista de dispositivos
            e um arquivo previamente carregado.
          </Text>
          <Text>Navegue para as abas anteriores e faça o processo.</Text>
        </Container>
      </>
    )
  }
}
