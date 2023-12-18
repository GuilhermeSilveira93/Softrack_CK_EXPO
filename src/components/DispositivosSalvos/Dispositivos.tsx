import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, ActivityIndicator, Text } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { List } from 'react-native-paper'
import { dispositivosPareados } from '@/libs/localDataBase/st_dispositivo/dispositivosPareados'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import { stringData } from '@/libs/dispositivos'
import { Content } from '../ui/Content'
import { useColorScheme } from 'nativewind'
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
}
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  attLocalDevices,
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
      : `Esse dispositivo ainda não enviou arquivo.`
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
    <Content key={ID}>
      <List.Item
        style={{
          marginBottom: 6,
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
          <Pressable
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <MaterialCommunityIcons
              name={!pareado ? 'link-off' : 'bluetooth-connect'}
              size={40}
              color={
                !pareado
                  ? '#aaa'
                  : `${colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'}`
              }
            />
          </Pressable>
        )}
        right={() => (
          <Pressable
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
            onPress={() => addDispositivoNaLista()}
          >
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
        )}
      />
    </Content>
  )
}
export default Dispositivos
