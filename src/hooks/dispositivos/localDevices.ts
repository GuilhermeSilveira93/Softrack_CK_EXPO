import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchDevices = async () => {
  const devices = await AsyncStorage.getItem("listaDispositivos").then(
    (res) => res
  );
  if (devices) {
    return JSON.parse(devices);
  }
  return [];
};
