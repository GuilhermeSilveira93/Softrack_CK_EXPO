import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { isBluetoothEnable,requestAccessFineLocationPermission } from "../hooks/bluetooth";
import { useEffect } from "react";
export { ErrorBoundary } from "expo-router";
export const unstable_settings = {
  initialRouteName: "(tabs)",
};
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({...FontAwesome.font});
  useEffect(() => {
    isBluetoothEnable()
    requestAccessFineLocationPermission()
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
