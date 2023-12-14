import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import {
  isBluetoothEnable,
  requestAccessFineLocationPermission,
} from '@/libs/bluetooth'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'react-native-paper'
export { ErrorBoundary } from 'expo-router'

// eslint-disable-next-line camelcase
export const unstable_settings = {
  initialRouteName: '/(tabs)/index',
}
SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font })
  useEffect(() => {
    isBluetoothEnable()
    requestAccessFineLocationPermission()
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
        <ThemeProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#3d3d3d' },
              }}
            />
            <Stack.Screen
              name="(Escaneamento)"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#3d3d3d' },
              }}
            />
            <Stack.Screen
              name="(EnvioAutomatico)"
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#3d3d3d' },
              }}
            />
          </Stack>
          <StatusBar animated translucent={false} />
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  )
}
