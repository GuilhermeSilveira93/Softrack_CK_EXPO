import AsyncStorage from '@react-native-async-storage/async-storage'
import DocumentPicker from 'react-native-document-picker';
import {readFile} from 'react-native-fs';
export const carregarArquivo = async () => {
  try {
    await AsyncStorage.removeItem('FileName');
    return await DocumentPicker.pickSingle({
      type: ['application/octet-stream'],
      allowMultiSelection: false,
    }).then(async (res:any) => {
      const arquivo = await readFile(res.uri);
      await AsyncStorage.setItem('File', arquivo);
      await AsyncStorage.setItem('FileName', res.name);
      return res.name;
    });
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log(error);
      return ''
    } else {
      console.log(error);
    }
  }
}

// operadores
// glp nao esta la
// tela de posição atual jogando pra fora
// parametros cliente
// cartão lider
// api banco de dados