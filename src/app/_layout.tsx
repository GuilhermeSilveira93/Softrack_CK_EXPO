import { useEffect, useState } from "react";
import { requestAccessFineLocationPermission, isBluetoothEnable } from "../hooks/bluetooth";
import { Slot } from "expo-router";

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
