import AsyncStorage from '@react-native-async-storage/async-storage'
export const fetchNomeArquivo = async () => {
  const file: string = await AsyncStorage.getItem('FileName').then((res) => {
    if (res) {
      return res
    }
    return ''
  })
  return file
}
