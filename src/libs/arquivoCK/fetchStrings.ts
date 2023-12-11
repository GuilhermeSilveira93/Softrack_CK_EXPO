import AsyncStorage from "@react-native-async-storage/async-storage";
export const fetchStrings = async () => {
  const file: string[] = await AsyncStorage.getItem("File").then(
    (res) => {
      if (res) {
        return res.split(String.fromCharCode(13) + String.fromCharCode(10))
      }
      return [];
    }
  );
  return file
};