import React from 'react'
import { Pressable, View } from 'react-native'
import { ProgressBar, List } from 'react-native-paper'

import { useDispositivoEnv } from '@/hooks/EnvioAutomatico/useDispositivoEnv'
import { DispositivoEnvProps } from '@/types/dispositivoEnv'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from 'nativewind'
import { TourGuideZone } from 'rn-tourguide'

import { P } from '../ui'
import { Content } from '../ui/Content'
export const DispositivoEnvTeste = ({
  devices,
  strings,
  atualizaContagemDeEnvio,
  contagemDeEnvio,
  attFilaDeEnvio,
  filaDeEnvio,
  index,
  tourKey,
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
    <TourGuideZone
      zone={1}
      isTourGuide={index === 0}
      tourKey={tourKey}
      text={'Cada item simboliza um dispositivo que o app está atualizando'}
    >
      <Content key={devices.ID}>
        <List.Item
          style={{
            minHeight: 90,
            maxHeight: 90,
            minWidth: '100%',
            maxWidth: '100%',
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
                <P variant="normal" className="flex-[2] dark:text-white">
                  {Math.floor((progressBar * 100) / strings.length)}%
                </P>
                <P variant="normal" className="flex-1 dark:text-white">
                  Status: {status}
                </P>
              </View>
              {progressBar > 0 && progressBar < strings.length && (
                <TourGuideZone
                  zone={2}
                  isTourGuide={index === 0}
                  tourKey={tourKey}
                  text={'Progresso de envio do arquivo'}
                >
                  <ProgressBar
                    progress={(progressBar * 100) / strings.length / 100}
                    color={`${
                      colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                    }`}
                    className="h-3 w-full rounded-xl dark:bg-dark-200"
                  />
                </TourGuideZone>
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
            <View className="justify-center">
              {enviarNovamente && (
                <TourGuideZone
                  zone={3}
                  isTourGuide={index === 0}
                  shape="circle"
                  tourKey={tourKey}
                  text={
                    'Icone para fazer uma nova tentativa de envio.\nClicando aqui, uma nova tentativa será feita.\nCaso o erro persista, entre em contato com a Softrack.'
                  }
                >
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
                </TourGuideZone>
              )}
              {progressBar === strings.length && (
                <TourGuideZone
                  zone={3}
                  isTourGuide={index === 0}
                  tourKey={tourKey}
                  text={'Este icone indica um envio realizado com sucesso.'}
                >
                  <FontAwesome
                    name="check-circle"
                    color={`${
                      colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                    }`}
                    size={30}
                  />
                </TourGuideZone>
              )}
            </View>
          )}
        />
      </Content>
    </TourGuideZone>
  )
}
export default DispositivoEnvTeste
