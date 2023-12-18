import React, { useState, useCallback, Suspense } from 'react'
import { Pressable, ActivityIndicator } from 'react-native'
import { useColorScheme } from 'nativewind'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
import { carregarArquivo } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
import { useFocusEffect } from 'expo-router'
import { Container } from '@/components/ui/Container'
import { Banner } from '@/components/Index/Banner'
export default function LocalFile() {
  const [nomeArquivo, setNomeArquivo] = useState<string>('')
  const { colorScheme } = useColorScheme()
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchNomeArquivo().then((res: string) => setNomeArquivo(res)),
      ])
    }, []),
  )
  const deletarArquivo = () => {
    setNomeArquivo('')
  }
  return (
    <>
      <Suspense
        fallback={<ActivityIndicator size="large" color="rgb(0, 255, 159)" />}
      >
        {nomeArquivo.length > 0 && (
          <Banner
            text={`${nomeArquivo.substring(
              0,
              nomeArquivo.length - 4,
            )} Carregado`}
            deletarArquivo={deletarArquivo}
          />
        )}
      </Suspense>
      <Container>
        <Pressable
          onPress={async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await carregarArquivo().then((res) => setNomeArquivo(res!))
          }}
        >
          <Avatar.Icon
            size={80}
            color={`${
              colorScheme === 'dark' ? 'rgb(0, 255, 159)' : 'rgb(0, 255, 159)'
            }`}
            style={{
              shadowColor: 'rgb(0, 255, 159)',
              shadowOpacity: 1,
              elevation: 10,
              backgroundColor: `${
                colorScheme === 'dark' ? '#293541' : '#293541'
              }`,
            }}
            icon="folder"
          />
        </Pressable>
      </Container>
    </>
  )
}
