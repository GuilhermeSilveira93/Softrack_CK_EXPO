import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
export const TabRoutes = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="ios-home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Dispositivos",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="forklift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="enviarCK"
        options={{
          title: "EnviarCK",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="ios-send" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabRoutes;
