import React from 'react'
import { Text, Pressable, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ProgressBar, List } from 'react-native-paper'
import { useDispositivoEnv } from '@/hooks/EnvioAutomatico/useDispositivoEnv'
import { DispositivoEnvProps } from '@/types/dispositivoEnv'
import { Content } from '../ui/Content'
import { useColorScheme } from 'nativewind'
export const DispositivoEnvTeste = ({
  devices,
  strings,
  atualizaContagemDeEnvio,
  contagemDeEnvio,
  attFilaDeEnvio,
  filaDeEnvio,
}: DispositivoEnvProps) => {
  const { colorScheme } = useColorScheme()
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
    <Content key={devices.ID}>
      <List.Item
        style={{
          backgroundColor: `${
            colorScheme === 'dark' ? '#293541' : 'rgb(222, 222, 222)'
          }`,
          marginBottom: 6,
          borderRadius: 10,
          minHeight: 80,
          minWidth: '100%',
          maxWidth: '100%',
          flex: 1,
        }}
        titleStyle={{
          fontWeight: '700',
          color: `${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'}`,
        }}
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
              <Text className="flex-[2] dark:text-white">
                {Math.floor((progressBar * 100) / strings.length)}%
              </Text>
              <Text className="flex-1 dark:text-white">Status: {status}</Text>
            </View>
            {progressBar > 0 && progressBar < strings.length && (
              <ProgressBar
                progress={(progressBar * 100) / strings.length / 100}
                color={`${
                  colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                }`}
                className="h-3 w-full rounded-xl dark:bg-dark-200"
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
              color={`${
                colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
              }`}
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
                <FontAwesome
                  name="send-o"
                  color={`${
                    colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                  }`}
                  size={30}
                />
              </Pressable>
            )}
            {progressBar === strings.length && (
              <FontAwesome
                name="check-circle"
                color={`${
                  colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                }`}
                size={30}
              />
            )}
          </>
        )}
      />
    </Content>
  )
}
export default DispositivoEnvTeste
