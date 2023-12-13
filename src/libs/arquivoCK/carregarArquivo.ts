import AsyncStorage from '@react-native-async-storage/async-storage'
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker'
import { readFile } from 'react-native-fs'
export const carregarArquivo = async () => {
  try {
    await AsyncStorage.removeItem('FileName')
    return await DocumentPicker.pickSingle({
      type: ['application/octet-stream'],
      allowMultiSelection: false,
    }).then(async (res: DocumentPickerResponse) => {
      const arquivo = await readFile(res.uri)
      await AsyncStorage.setItem('File', arquivo)
      if (res) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await AsyncStorage.setItem('FileName', res.name!)
        return res.name
      }
      return ''
    })
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log(error)
      return ''
    } else {
      console.log(error)
      return ''
    }
  }
}
