import AsyncStorage from '@react-native-async-storage/async-storage'
import { ChecklistEnviado } from '@/@types/checklistsEnviados'
export const checklistEnviado = async (
  name: string,
  id: string,
  nomeArquivo: string,
) => {
  const data = new Date()
  try {
    const checklistsEnviados: ChecklistEnviado[] = await AsyncStorage.getItem(
      'ChecklistEnviado',
    ).then((res) => {
      if (res) {
        return JSON.parse(res)
      }
      return []
    })
    const existe = checklistsEnviados.filter((item) => item.id === id)
    if (existe.length > 0) {
      const resto = checklistsEnviados?.filter((item) => item.id !== id)
      const dispositivosNovos = [...resto, { id, name, nomeArquivo, data }]
      await AsyncStorage.removeItem('ChecklistEnviado')
      await AsyncStorage.setItem(
        'ChecklistEnviado',
        JSON.stringify(dispositivosNovos),
      )
    } else {
      let dispositivosNovos = [{ id, name, nomeArquivo, data }]
      dispositivosNovos = [...checklistsEnviados, ...dispositivosNovos]
      await AsyncStorage.setItem(
        'ChecklistEnviado',
        JSON.stringify(dispositivosNovos),
      )
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
export const fetchChecklistEnviado = async (ID: string) => {
  const devices = await AsyncStorage.getItem('ChecklistEnviado').then(
    (res) => res,
  )
  if (devices) {
    const checklistsEnviados: ChecklistEnviado[] = JSON.parse(devices)
    return checklistsEnviados.filter((item) => item.id === ID)
  }
  return []
}
