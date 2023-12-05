import { LocalDevices } from "@/types/localDevices";import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchDispositivosEnviados = async () => {
  const devices = await AsyncStorage.getItem("dispositivosEnviados").then(
    (res) => res
  );
  if (devices) {
    return JSON.parse(devices);
  }
  return [];
};
export const addDispositivosEnviados = async (dispositivo: LocalDevices) => {
  try {
    let devices: LocalDevices[] = await AsyncStorage.getItem(
      "dispositivosEnviados"
    ).then((res) => {
      if (res) {
        return JSON.parse(res);
      } else {
        [];
      }
    });
    const existe = devices.filter((device) => device.ID === dispositivo.ID);
    if (existe.length > 0) {
      const resto = devices?.filter((item) => item.ID !== dispositivo.ID);
      const atualizado = [...resto, dispositivo];
      await AsyncStorage.removeItem("dispositivosEnviados");
      await AsyncStorage.setItem(
        "dispositivosEnviados",
        JSON.stringify(atualizado)
      );
    }
  } catch (error) {
    return false;
  }
};
