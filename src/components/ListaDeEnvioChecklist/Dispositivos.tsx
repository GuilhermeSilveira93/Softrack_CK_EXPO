import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { List } from 'react-native-paper'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import { stringData } from '@/libs/dispositivos'
import { Content } from '../ui/Content'
import { useColorScheme } from 'nativewind'

type DispositivosProps = {
  ID: string
  name: string
  existe: boolean
  dispositivosSalvos: {
    ID: string
    name: string
  }[]
  listaDeEnvio: (ID: string, name: string, nomeArquivo: string) => void
  nomeArquivo: string
}
const Dispositivos = ({
  ID,
  name,
  listaDeEnvio,
  existe,
  nomeArquivo,
}: DispositivosProps) => {
  const { colorScheme } = useColorScheme()
  const [checklistEnviado, setChecklistEnviado] = useState<ChecklistEnviado>()
  const dataFormatada = checklistEnviado?.data
    ? stringData(checklistEnviado?.data)
    : ''
  const subtitle = checklistEnviado?.nomeArquivo
    ? `${checklistEnviado?.nomeArquivo.substring(
        0,
        checklistEnviado?.nomeArquivo.length - 3,
      )}`
    : `Esse dispositivo ainda não enviou arquivo.`
  useEffect(() => {
    fetchChecklistEnviado(ID).then((res) => {
      setChecklistEnviado(res[0])
    })
  })
  return (
    <Content key={ID}>
      <List.Item
        style={{
          backgroundColor: `${
            colorScheme === 'dark' ? '#293541' : 'rgb(222, 222, 222)'
          }`,
          borderRadius: 10,
          marginBottom: 6,
          minWidth: '100%',
          maxWidth: '100%',
        }}
        title={`${name}`}
        description={() => {
          if (!dataFormatada) {
            return (
              <>
                <Text className="dark:text-white">{subtitle}</Text>
              </>
            )
          }
          return (
            <>
              <Text className="dark:text-white">
                Ultimo Envio Deste Dispositivo:{' '}
              </Text>
              <Text className="dark:text-white">{dataFormatada}</Text>
              <Text className="dark:text-white">{subtitle}</Text>
            </>
          )
        }}
        titleStyle={{
          fontWeight: '700',
          color: `${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'}`,
        }}
        descriptionStyle={{ color: '#fff' }}
        left={() => (
          <View style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <MaterialCommunityIcons
              name={'bluetooth-connect'}
              size={40}
              color={`${
                colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
              }`}
            />
          </View>
        )}
        right={() => (
          <Pressable
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
            onPress={() => listaDeEnvio(ID, name, nomeArquivo)}
          >
            <AntDesign
              name={existe ? 'checkcircle' : 'checkcircleo'}
              color={`${
                colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
              }`}
              size={40}
            />
          </Pressable>
        )}
      />
    </Content>
  )
}
export default Dispositivos
