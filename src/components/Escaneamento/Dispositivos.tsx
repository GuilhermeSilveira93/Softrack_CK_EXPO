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
import { useColorScheme } from 'nativewind'
import { TourGuideZone } from 'rn-tourguide'
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
  index: number
  tourKey: string
}
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  attLocalDevices,
  setaBloqueio,
  bloqueio,
  index,
  tourKey,
}: DispositivosProps) => {
  const { colorScheme } = useColorScheme()
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
    <TourGuideZone
      zone={1}
      isTourGuide={index === 0}
      tourKey={tourKey}
      text={
        'Para adicionar um dispositivo, é necessário Parear, caso isso nunca tenha sido feito.\nClique em qualquer região do dispositivo desejado para Parear.'
      }
    >
      <TourGuideZone
        zone={2}
        isTourGuide={index === 0}
        tourKey={tourKey}
        text={
          'Caso já esteja Pareado, um "Switch" irá aparecer no lado direito.\nClique em qualquer lugar para alterná-lo para adicionar à lista de Dispositivos.'
        }
      >
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
                justifyContent: 'center',
                minHeight: 90,
                maxHeight: 90,
                minWidth: '100%',
                maxWidth: '100%',
              }}
              title={`${name}`}
              description={subtitle}
              titleStyle={{
                fontWeight: '700',
                color: `${
                  colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                }`,
              }}
              descriptionStyle={{
                color: `${colorScheme === 'dark' ? '#fff' : '#000'}`,
              }}
              left={() => (
                <View>
                  {pareando ? (
                    <ActivityIndicator
                      size="large"
                      color={`${
                        colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
                      }`}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name={
                          !pareado ? 'bluetooth-connect' : 'bluetooth-connect'
                        }
                        size={40}
                        color={
                          !pareado
                            ? '#aaa'
                            : `${
                                colorScheme === 'dark'
                                  ? 'rgb(0, 255, 159)'
                                  : '#465DFF'
                              }`
                        }
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
                          color={
                            existe.length > 0
                              ? `${
                                  colorScheme === 'dark'
                                    ? 'rgb(0, 255, 159)'
                                    : '#465DFF'
                                }`
                              : '#aaa'
                          }
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
      </TourGuideZone>
    </TourGuideZone>
  )
}
export default Dispositivos
