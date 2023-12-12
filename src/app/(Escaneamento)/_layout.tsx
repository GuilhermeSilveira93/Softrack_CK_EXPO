import { Stack } from 'expo-router'

export const Escanemento = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Escaneando Dispositivos',
        }}
      />
    </Stack>
  )
}
export default Escanemento
