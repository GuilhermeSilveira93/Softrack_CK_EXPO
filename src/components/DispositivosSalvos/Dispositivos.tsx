import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, ActivityIndicator, Text } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { List } from 'react-native-paper'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { dispositivosPareados } from '@/libs/localDataBase/st_dispositivo/dispositivosPareados'
import { Container } from '@/components/ui/Container'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import { stringData } from '@/libs/dispositivos'
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
  const [pareado, setPareado] = useState<boolean>(false)
  const [adicionando, setAdicionando] = useState<boolean>(false)
  const [checklistEnviado, setChecklistEnviado] = useState<ChecklistEnviado>()
  const existe = dispositivosSalvos.filter((item) => item.ID === ID)
  const dataFormatada = checklistEnviado?.data
    ? stringData(checklistEnviado?.data)
    : ''
  const subtitle = checklistEnviado?.nomeArquivo
    ? `${checklistEnviado?.nomeArquivo.substring(
        0,
        checklistEnviado?.nomeArquivo.length - 3,
      )}`
    : `Esse dispositivo ainda não enviou arquivo.`
  useEffect(
    useCallback(() => {
      dispositivosPareados(ID).then((res) => setPareado(res))
      fetchChecklistEnviado(ID).then((res) => {
        setChecklistEnviado(res[0])
      })
    }, [ID]),
    [],
  )
  const addDispositivoNaLista = async () => {
    if (!pareado) {
      alert('Faça o pareamento da máquina antes de adicionar na lista.')
      return
    }
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
  }
  return (
    <Container key={ID}>
      <List.Item
        style={{
          backgroundColor: 'rgba(0,170,255,0.2)',
          borderRadius: 10,
        }}
        titleStyle={{ fontWeight: '700' }}
        title={`${name}`}
        description={() => {
          if (!dataFormatada) {
            return (
              <>
                <Text>{subtitle}</Text>
              </>
            )
          }
          return (
            <>
              <Text>Ultimo Envio Deste Dispositivo: </Text>
              <Text>{dataFormatada}</Text>
              <Text>{subtitle}</Text>
            </>
          )
        }}
        left={() => (
          <Pressable
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <>
              <MaterialCommunityIcons
                name={!pareado ? 'link-off' : 'bluetooth-connect'}
                size={40}
                color={!pareado ? '#aaa' : '#1c73d2'}
              />
            </>
          </Pressable>
        )}
        right={() => (
          <Pressable
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
            onPress={() => addDispositivoNaLista()}
          >
            {adicionando ? (
              <ActivityIndicator size="large" color="#1c73d2" />
            ) : (
              <AntDesign
                name={existe.length > 0 ? 'checkcircle' : 'checkcircleo'}
                color="rgb(0,150,255)"
                size={40}
              />
            )}
          </Pressable>
        )}
      />
    </Container>
  )
}
export default Dispositivos
