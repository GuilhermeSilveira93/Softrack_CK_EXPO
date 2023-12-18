import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { requestAccessFineLocationPermission } from '@/libs/bluetooth'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
export { ErrorBoundary } from 'expo-router'

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
  return (
    <>
      <SafeAreaProvider>
        <StatusBar style="auto" />
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
      </SafeAreaProvider>
    </>
  )
}
