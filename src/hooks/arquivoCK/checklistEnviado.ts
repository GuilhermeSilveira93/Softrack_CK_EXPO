import AsyncStorage from "@react-native-async-storage/async-storage";
type checklistEnviadoProps = {
  name: string;
  id: string;
  nomeArquivo: string;
};
export const checklistEnviado = async (name:string, id:string, nomeArquivo:string) => {
  try {
    const checklistsEnviados: checklistEnviadoProps[] =
      await AsyncStorage.getItem("ChecklistEnviado").then((res) => {
        if (res) {
          return JSON.parse(res);
        }
        return [];
      });
    const existe = checklistsEnviados.filter((item) => item.id === id);
    if (existe.length > 0) {
      const resto = checklistsEnviados?.filter((item) => item.id !== id);
      const novaLista = [...resto, { Address: id, Name: name, nomeArquivo }];
      await AsyncStorage.removeItem("ChecklistEnviado");
      await AsyncStorage.setItem("ChecklistEnviado", JSON.stringify(novaLista));
    } else {
      let dispositivosNovos = [{ id, name, nomeArquivo }];
      if (checklistsEnviados) {
        dispositivosNovos = [...checklistsEnviados, ...dispositivosNovos];
      }
      await AsyncStorage.setItem(
        "ChecklistEnviado",
        JSON.stringify(dispositivosNovos)
      );
    }
    return true;
  } catch (error) {
    return false;
  }
};
export const fetchChecklistEnviado = async () => {
  const devices = await AsyncStorage.getItem("ChecklistEnviado").then(
    (res) => res
  );
  if (devices) {
    return JSON.parse(devices);
  }
  return [];
};
