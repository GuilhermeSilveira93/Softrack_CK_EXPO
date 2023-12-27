import { useEffect } from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { requestAccessFineLocationPermission } from '@/libs/bluetooth'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { TourGuideProvider } from 'rn-tourguide'


// eslint-disable-next-line camelcase
export const unstable_settings = {
  initialRouteName: '/(tabs)/index',
}
SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font })
  useEffect(() => {
    requestAccessFineLocationPermission()
    RNBluetoothClassic.requestBluetoothEnabled()
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const { colorScheme } = useColorScheme()
  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <TourGuideProvider
          {...{
            backdropColor: `${
              colorScheme === 'dark'
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(0,0,0,0.4)'
            }`,
            maskOffset: 2,
            verticalOffset: 25,
            borderRadius: 10,
            labels: {
              previous: 'Voltar',
              next: 'Próximo',
              skip: 'Pular',
              finish: 'Finalizar',
            },
          }}
          preventOutsideInteraction
        >
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(Escaneamento)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(EnvioAutomatico)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </TourGuideProvider>
      </SafeAreaProvider>
    </>
  )
}
