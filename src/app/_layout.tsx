import { useEffect, useState } from "react";
import { requestAccessFineLocationPermission, isBluetoothEnable } from "../hooks/bluetooth";
import { Slot, Tabs,ExpoRoot } from "expo-router";
import TabRoutes from "./(tabs)/_layout";

export const RootLayout = () => {
  const [bluetooth,setBluetooth] = useState(false)
  useEffect(()=>{
    isBluetoothEnable()
    requestAccessFineLocationPermission()
    setBluetooth(true)
   },[])
  return (
    <Slot />
  );
};
export default RootLayout;
