import Stack from 'expo-router/stack'
import { useColorScheme } from 'nativewind'

export const EnvioDeChecklist = () => {
  const { colorScheme } = useColorScheme()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Envio de Checklist',
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#ccc'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
        }}
      />
    </Stack>
  )
}
export default EnvioDeChecklist
