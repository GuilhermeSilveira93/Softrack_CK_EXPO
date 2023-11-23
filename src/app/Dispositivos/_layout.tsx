import { Stack } from "expo-router";
export const StackRouter = () => {
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
export default StackRouter;
