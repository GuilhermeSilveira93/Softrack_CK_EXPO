import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Checklist',

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dispositivosSalvos"
        options={{
          title: 'Dispositivos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="forklift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listaDeEnvioChecklist"
        options={{
          title: 'Enviar',
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
