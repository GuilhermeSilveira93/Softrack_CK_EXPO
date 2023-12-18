import React, { useState, useCallback, Suspense } from 'react'
import { Pressable, ActivityIndicator } from 'react-native'
import { useColorScheme } from 'nativewind'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
import { carregarArquivo } from '@/libs/arquivoCK'
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Avatar } from 'react-native-paper'
import { useFocusEffect, Stack } from 'expo-router'
import { Container } from '@/components/ui/Container'
import { Banner } from '@/components/Index/Banner'
export default function LocalFile() {
  const [nomeArquivo, setNomeArquivo] = useState<string>('')
  const { colorScheme } = useColorScheme()
  const { canStart, start, tourKey } = useTourGuideController('arquivo')
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchNomeArquivo().then((res: string) => setNomeArquivo(res)),
      ])
    }, []),
  )
  const deletarArquivo = () => {
    setNomeArquivo('')
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (canStart) {
                  start()
                }
              }}
            >
              {({ pressed }) => (
                <MaterialIcons
                  name="help-circle-outline"
                  size={25}
                  color={`${colorScheme === 'dark' ? '#fff' : '#293541'}`}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Suspense
        fallback={<ActivityIndicator size="large" color="rgb(0, 255, 159)" />}
      >
        {nomeArquivo.length > 0 && (
          <>
            <TourGuideZone
              zone={3}
              tourKey={tourKey}
              text={
                'Navegue até "Dispositivos" para escanear\ne adicionar na lista.'
              }
              borderRadius={5}
              tooltipBottomOffset={20}
              style={{
                position: 'absolute',
                bottom: '-11%',
                right: '42%',
                height: 55,
                width: 65,
              }}
            />
            <TourGuideZone
              zone={2}
              tourKey={tourKey}
              text={'Caso queira remover, basta clicar neste botão !'}
              borderRadius={5}
              style={{
                position: 'absolute',
                top: '17%',
                right: 17,
                height: 50,
                width: 130,
              }}
            />
            <Banner
              text={`${nomeArquivo.substring(
                0,
                nomeArquivo.length - 4,
              )} Carregado`}
              deletarArquivo={deletarArquivo}
            />
          </>
        )}
      </Suspense>

      <TourGuideZone
        zone={1}
        tourKey={tourKey}
        text={'Para carregar o arquivo, clique aqui.'}
        borderRadius={50}
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          top: '47%',
          right: '37.4%',
        }}
      />
      <Container>
        <Pressable
          onPress={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await carregarArquivo().then((res) => setNomeArquivo(res!))
          }}
        >
          <Avatar.Icon
            size={80}
            color={`${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#fff'}`}
            style={{
              shadowColor: `${
                colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
              }`,
              shadowOpacity: 1,
              elevation: 10,
              backgroundColor: `${
                colorScheme === 'dark' ? '#293541' : '#465DFF'
              }`,
            }}
            icon="folder"
          />
        </Pressable>
      </Container>
    </>
  )
}
