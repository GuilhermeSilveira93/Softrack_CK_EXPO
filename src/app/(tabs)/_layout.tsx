import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { useColorScheme } from 'nativewind'
export default function TabLayout() {
  const { colorScheme } = useColorScheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#465DFF',
        tabBarItemStyle: {
          backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#ccc'}`,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Checklist',
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#ccc'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dispositivosSalvos"
        options={{
          title: 'Dispositivos',
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#ccc'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="forklift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listaDeEnvioChecklist"
        options={{
          title: 'Enviar',
          headerStyle: {
            backgroundColor: `${colorScheme === 'dark' ? '#293541' : '#ccc'}`,
          },
          headerTintColor: `${colorScheme === 'dark' ? '#fff' : '#293541'}`,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cube-send"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
