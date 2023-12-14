import React, { useState, useCallback, Suspense } from 'react'
import { Pressable, ActivityIndicator } from 'react-native'
import { useColorScheme } from 'nativewind'
import { fetchNomeArquivo } from '@/libs/localDataBase/st_checklist'
import { carregarArquivo, deleteFile } from '@/libs/arquivoCK'
import { Banner, Avatar } from 'react-native-paper'
import { useFocusEffect } from 'expo-router'
import { Container } from '@/components/ui/Container'
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
  return (
    <>
      <Suspense fallback={<ActivityIndicator size="large" color="#1c73d2" />}>
        <Banner
          visible={nomeArquivo?.length > 0}
          actions={[
            {
              label: 'Remover arquivo',
              onPress: async () => {
                await deleteFile().then((res) => setNomeArquivo(res))
              },
            },
          ]}
          icon={() => (
            <Avatar.Icon
              size={50}
              style={{ backgroundColor: 'blue' }}
              icon="file"
            />
          )}
        >
          Arquivo {nomeArquivo} na memória
        </Banner>
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
            color={`${colorScheme === 'dark' ? '#fff' : '#465DFF'}`}
            style={{
              backgroundColor: `${
                colorScheme === 'dark' ? '#465DFF' : '#293541'
              }`,
            }}
            icon="folder"
          />
        </Pressable>
      </Container>
    </>
  )
}
