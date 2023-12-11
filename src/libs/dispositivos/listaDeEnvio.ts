import AsyncStorage from "@react-native-async-storage/async-storage";

export const FetchListaDeEnvio = async () => {
  const devices = await AsyncStorage.getItem("listaDeEnvio").then(
    (res) => res
  );
  if (devices) {
    return JSON.parse(devices);
  }
  return [];
};