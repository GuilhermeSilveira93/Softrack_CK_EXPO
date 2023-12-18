import { Stack } from 'expo-router'
import { useColorScheme } from 'nativewind'

export const Escanemento = () => {
  const { colorScheme } = useColorScheme()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Escaneando Dispositivos',
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#fff'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
        }}
      />
    </Stack>
  )
}
export default Escanemento
