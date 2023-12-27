import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import { List } from 'react-native-paper'

import { stringData } from '@/libs/dispositivos'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { dispositivosPareados } from '@/libs/localDataBase/st_dispositivo/dispositivosPareados'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'nativewind'
import { TourGuideZone } from 'rn-tourguide'

import { P } from '../ui'
import { Content } from '../ui/Content'
type DispositivosProps = {
  ID: string
  name: string
  dispositivosSalvos: {
    ID: string
    name: string
  }[]
  bloqueio?: boolean
  attLocalDevices: (
    novosDispositivos: DispositivosProps['dispositivosSalvos'],
  ) => void
  index: number
  tourKey: string
}
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  attLocalDevices,
  index,
  tourKey,
}: DispositivosProps) => {
  const { colorScheme } = useColorScheme()
  const [pareado, setPareado] = useState<boolean>(false)
  const [adicionando, setAdicionando] = useState<boolean>(false)
  const [checklistEnviado, setChecklistEnviado] = useState<ChecklistEnviado>()
  const existe = dispositivosSalvos.filter((item) => item.ID === ID)
  const dataFormatada = checklistEnviado?.data
    ? stringData(checklistEnviado?.data)
    : ''
  const subtitle =
    checklistEnviado?.nomeArquivo && checklistEnviado?.nomeArquivo?.length > 0
      ? `${checklistEnviado?.nomeArquivo.substring(
          0,
          checklistEnviado?.nomeArquivo.length - 3,
        )}`
      : `Esse aparelho ainda não enviou um arquivo.`
  const addDispositivoNaLista = useCallback(async () => {
    setAdicionando(true)
    if (existe.length > 0) {
      const resto = dispositivosSalvos?.filter((item) => item.ID !== ID)
      await AsyncStorage.removeItem('listaDispositivos')
      await AsyncStorage.setItem('listaDispositivos', JSON.stringify(resto))
      setAdicionando(false)
      attLocalDevices(resto)
    } else {
      let dispositivosNovos = [{ ID, name }]
      if (dispositivosSalvos) {
        dispositivosNovos = [...dispositivosSalvos, ...dispositivosNovos]
      }
      await AsyncStorage.setItem(
        'listaDispositivos',
        JSON.stringify(dispositivosNovos),
      )
      setAdicionando(false)
      attLocalDevices(dispositivosNovos)
    }
  }, [ID, attLocalDevices, dispositivosSalvos, existe.length, name])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    useCallback(() => {
      dispositivosPareados(ID).then((res) => {
        if (res) {
          setPareado(res)
        } else {
          addDispositivoNaLista()
        }
      })
      fetchChecklistEnviado(ID).then((res) => {
        setChecklistEnviado(res[0])
      })
    }, [ID, addDispositivoNaLista]),
    [dispositivosSalvos],
  )
  return (
    <TourGuideZone
      zone={2}
      tourKey={tourKey}
      shape="rectangle"
      isTourGuide={index === 0}
      text={
        'Os dispositivos salvos, são exibidos nesta tela\nNa tela "Enviar", você poderá\nselecionar os dispositivos que deseja atualizar.'
      }
    >
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
            <Pressable
              style={{ display: 'flex', justifyContent: 'space-evenly' }}
            >
              <MaterialCommunityIcons
                name={!pareado ? 'link-off' : 'bluetooth-connect'}
                size={40}
                color={
                  !pareado
                    ? '#aaa'
                    : `${
                        colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                      }`
                }
              />
            </Pressable>
          )}
          right={() => (
            <View className="justify-center">
              <TourGuideZone
                zone={3}
                shape="circle"
                isTourGuide={index === 0}
                tourKey={tourKey}
                text={
                  'Para remover o dispositivo do aparelho, basta clicar aqui.'
                }
                style={{
                  justifyContent: 'center',
                }}
              >
                <Pressable onPress={() => addDispositivoNaLista()}>
                  {adicionando ? (
                    <ActivityIndicator
                      size="large"
                      color={`${
                        colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                      }`}
                    />
                  ) : (
                    <AntDesign
                      name={existe.length > 0 ? 'checkcircle' : 'checkcircleo'}
                      color={`${
                        colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                      }`}
                      size={40}
                    />
                  )}
                </Pressable>
              </TourGuideZone>
            </View>
          )}
        />
      </Content>
    </TourGuideZone>
  )
}

export default Dispositivos
