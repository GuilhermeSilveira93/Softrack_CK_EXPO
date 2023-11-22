import { Stack } from "expo-router";
export const TabRoutes = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0061FF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        fullScreenGestureEnabled:true
      }}>
      <Stack.Screen
        name="DispositivosSalvos"
        options={{
          title: "Dispositivos Salvos",
        }}
      />
      <Stack.Screen
        name="EscanearDispositivos"
        options={{
          title: "Escanear Dispositivos",
        }}
      />
    </Stack>
  );
};
export default TabRoutes;
