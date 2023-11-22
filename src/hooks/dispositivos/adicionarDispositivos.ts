import { LocalDevices } from "@/types/localDevices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const adicionarDispositivosLocais = async (
  localDevices: LocalDevices[]
) => {
  await AsyncStorage.setItem("listaDispositivos", JSON.stringify(localDevices));
  alert("adicionado");
};