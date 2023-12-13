import React from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ProgressBar, List } from 'react-native-paper'
import { Container } from '@/components/ui/Container'
import { useDispositivoEnv } from '@/hooks/EnvioAutomatico/useDispositivoEnv'
import { DispositivoEnvProps } from '@/types/dispositivoEnv'
export const DispositivoEnvTeste = ({
  devices,
  strings,
  atualizaContagemDeEnvio,
  contagemDeEnvio,
  attFilaDeEnvio,
  filaDeEnvio,
}: DispositivoEnvProps) => {
  const { progressBar, enviarNovamente, status, setTentativasConexoes } =
    useDispositivoEnv({
      devices,
      strings,
      atualizaContagemDeEnvio,
      contagemDeEnvio,
      attFilaDeEnvio,
      filaDeEnvio,
    })
  return (
    <Container key={devices.ID}>
      <List.Item
        style={{
          backgroundColor: 'rgba(0,170,255,0.2)',
          borderRadius: 10,
          minHeight: 80,
        }}
        titleStyle={{ fontWeight: '700' }}
        title={`${devices.name}`}
        description={() => (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              <Text style={{ flex: 2 }}>
                {Math.floor((progressBar * 100) / strings.length)}%
              </Text>
              <Text style={{ flex: 1 }}>Status: {status}</Text>
            </View>
            {progressBar > 0 && progressBar < strings.length && (
              <ProgressBar
                progress={(progressBar * 100) / strings.length / 100}
                color="#5E84E2"
                style={styles.progress}
              />
            )}
          </>
        )}
        left={() => (
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            <MaterialCommunityIcons
              name={'bluetooth-connect'}
              size={40}
              color={'#1c73d2'}
            />
          </View>
        )}
        right={() => (
          <>
            {enviarNovamente && (
              <Pressable
                onPress={() => {
                  setTentativasConexoes(0)
                }}
              >
                <FontAwesome name="send-o" color="#5E84E2" size={30} />
              </Pressable>
            )}
            {progressBar === strings.length && (
              <FontAwesome name="check-circle" color="#66aa66" size={30} />
            )}
          </>
        )}
      />
    </Container>
  )
}
const styles = StyleSheet.create({
  progress: {
    height: 10,
    width: '100%',
    borderRadius: 10,
  },
})
export default DispositivoEnvTeste
