import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dispositivosSalvos"
        options={{
          title: "Dispositivos Locais",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="forklift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listaDeEnvioChecklist"
        options={{
          title: "Lista de Envio",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="abacus" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
