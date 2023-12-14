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
import { useColorScheme } from 'nativewind'
export { ErrorBoundary } from 'expo-router'

// eslint-disable-next-line camelcase
export const unstable_settings = {
  initialRouteName: '/(tabs)/index',
}
SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font })
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
  useEffect(() => {
    toggleColorScheme()
    setColorScheme('system')
    isBluetoothEnable()
    console.log(colorScheme)
    requestAccessFineLocationPermission()
    if (error) throw error
  }, [error, setColorScheme, colorScheme, toggleColorScheme])

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
        <StatusBar />
      </SafeAreaProvider>
    </>
  )
}
