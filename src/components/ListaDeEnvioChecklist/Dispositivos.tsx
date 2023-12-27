import React, { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { List } from 'react-native-paper'

import { stringData } from '@/libs/dispositivos'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from 'nativewind'
import { TourGuideZone } from 'rn-tourguide'

import { P } from '../ui'
import { Content } from '../ui/Content'

type DispositivosProps = {
  ID: string
  name: string
  existe: boolean
  listaDeEnvio: (ID: string, name: string, nomeArquivo: string) => void
  nomeArquivo: string
  index: number
  tourKey: string
}
const Dispositivos = ({
  ID,
  name,
  listaDeEnvio,
  existe,
  nomeArquivo,
  index,
  tourKey,
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
          minHeight: 90,
          maxHeight: 90,
          minWidth: '100%',
          maxWidth: '100%',
        }}
        title={`${name}`}
        description={() => {
          if (!dataFormatada) {
            return (
              <>
                <P variant="normal" className="dark:text-white">
                  {subtitle}
                </P>
              </>
            )
          }
          return (
            <>
              <P variant="normal" className="dark:text-white">
                Ultimo Envio Deste Dispositivo:{' '}
              </P>
              <P variant="normal" className="dark:text-white">
                {dataFormatada}
              </P>
              <P variant="normal" className="dark:text-white">
                {subtitle}
              </P>
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
          <View className="justify-center">
            <TourGuideZone
              zone={1}
              isTourGuide={index === 0}
              tourKey={tourKey}
              shape="circle"
              text={
                'Selecione individualmente os dispositivos para os quais deseja enviar o arquivo previamente selecionado'
              }
            >
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
            </TourGuideZone>
          </View>
        )}
      />
    </Content>
  )
}
export default Dispositivos
