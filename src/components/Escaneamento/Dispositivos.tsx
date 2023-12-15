import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, ActivityIndicator, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import RNBluetoothClassic from 'react-native-bluetooth-classic'
import { dispositivosPareados } from '@/libs/localDataBase/st_dispositivo/dispositivosPareados'
import { List } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchChecklistEnviado } from '@/libs/localDataBase/st_dispositivo_checklist'
import { ChecklistEnviado } from '@/types/checklistsEnviados'
import { Content } from '../ui/Content'
type DispositivosProps = {
  ID: string
  name: string
  dispositivosSalvos: {
    ID: string
    name: string
  }[]
  setaBloqueio: () => void
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
  setaBloqueio,
  bloqueio,
}: DispositivosProps) => {
  const [pareado, setPareado] = useState<boolean>(false)
  const [pareando, setPareando] = useState<boolean>(false)
  const [checklistEnviado, setChecklistEnviado] = useState<ChecklistEnviado>()
  const existe = dispositivosSalvos.filter((item) => item.ID === ID)
  const subtitle = checklistEnviado?.nomeArquivo
    ? `${checklistEnviado?.nomeArquivo.substring(
        0,
        checklistEnviado?.nomeArquivo.length - 3,
      )} já enviado`
    : `Nenhum arquivo enviado`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    useCallback(() => {
      dispositivosPareados(ID).then((res) => setPareado(res))
      fetchChecklistEnviado(ID).then((res) => {
        setChecklistEnviado(res[0])
      })
    }, [ID]),
    [],
  )

  const parear = async () => {
    if (setaBloqueio) {
      setaBloqueio()
    }
    setPareando(true)
    await RNBluetoothClassic.pairDevice(ID)
      .then(async (res) => {
        if (res.bonded) {
          setPareado(true)
          setPareando(false)
        } else {
          alert(
            'Só é possivel adicionar na lista, se o dispositivo estiver pareado.',
          )
          setPareando(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setPareando(false)
      })
    setPareando(false)
    if (setaBloqueio) {
      setaBloqueio()
    }
  }
  const addDispositivoNaLista = async () => {
    if (!pareado) {
      alert('Faça o pareamento da máquina antes de adicionar na lista.')
      return
    }
    if (existe.length > 0) {
      const resto = dispositivosSalvos?.filter((item) => item.ID !== ID)
      await AsyncStorage.removeItem('listaDispositivos')
      await AsyncStorage.setItem('listaDispositivos', JSON.stringify(resto))
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
      attLocalDevices(dispositivosNovos)
    }
  }
  return (
    <Content key={ID}>
      <Pressable
        disabled={bloqueio}
        onPress={() => {
          if (!pareado) {
            parear()
          } else {
            addDispositivoNaLista()
          }
        }}
      >
        <List.Item
          style={{
            backgroundColor: 'rgba(0,170,255,0.2)',
            borderRadius: 10,
            maxWidth: '100%',
          }}
          title={`${name}`}
          description={subtitle}
          titleStyle={{ fontWeight: '700', color: '#465DFF' }}
          descriptionStyle={{ color: '#fff' }}
          left={() => (
            <View>
              {pareando ? (
                <ActivityIndicator size="large" color="#1c73d2" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={!pareado ? 'bluetooth-connect' : 'bluetooth-connect'}
                    size={40}
                    color={!pareado ? '#aaa' : '#1c73d2'}
                  />
                </>
              )}
            </View>
          )}
          right={
            pareado
              ? () => (
                  <View>
                    <MaterialCommunityIcons
                      name={
                        existe.length > 0
                          ? 'toggle-switch'
                          : 'toggle-switch-off'
                      }
                      color={existe.length > 0 ? 'rgb(0,150,255)' : '#aaa'}
                      size={40}
                    />
                  </View>
                )
              : () => {
                  return null
                }
          }
        />
      </Pressable>
    </Content>
  )
}
export default Dispositivos
