import AsyncStorage from "@react-native-async-storage/async-storage"

export const deleteFile = async () => {
  try {
    await AsyncStorage.removeItem('FileName')
    return ''
  } catch (error) {
    console.log(error)
    return ''
  }
  
}