import { LocalDevices } from "@/types/localDevices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchDevices = async () => {
  const devices = await AsyncStorage.getItem("listaDispositivos");
  if (devices) {
    return JSON.parse(devices);
  }
  return [];
};
export const deleteDevice = async (devices: LocalDevices[], handleDevice:string) => {
  const resto = devices.filter((device) => device.ID !== handleDevice);
  await AsyncStorage.removeItem("listaDispositivos");
  await AsyncStorage.setItem("listaDispositivos", JSON.stringify(resto));
};
