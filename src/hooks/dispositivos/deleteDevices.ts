import { LocalDevices } from "@/types/localDevices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const deleteDevice = async (
  handleDeviceID: string
) => {
  const dispositivosLocais:LocalDevices[] = await AsyncStorage.getItem('listaDispositivos')
  .then((res) => {
    if (res) {
      return JSON.parse(res)
    }
  })
  const resto = dispositivosLocais.filter((device) => device.ID !== handleDeviceID);
  await AsyncStorage.removeItem("listaDispositivos");
  await AsyncStorage.setItem("listaDispositivos", JSON.stringify(resto));
};