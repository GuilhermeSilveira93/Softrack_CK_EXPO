import { Stack } from "expo-router";
export const TabRoutes = () => {
  return (
    <Stack>
      <Stack.Screen
        name="DispositivosSalvos"
        options={{
          title: "Dispositivos Salvos",
        }}
      />
    </Stack>
  );
};
export default TabRoutes;
