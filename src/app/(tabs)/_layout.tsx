import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
export const unstable_settings = {
  initialRouteName: 'index',
};
export const Layout = () => {
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
        name="dispositivos"
        options={{
          title: "Dispositivos",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="forklift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="envioAutomatico"
        options={{
          title: "Enviar Checklist",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="ios-send" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;
