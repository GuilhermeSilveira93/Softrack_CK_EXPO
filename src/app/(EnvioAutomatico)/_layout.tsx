import { Stack } from "expo-router";

export const EnvioDeChecklist = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Envio de Checklist",
        }}
      />
    </Stack>
  );
};
export default EnvioDeChecklist;
