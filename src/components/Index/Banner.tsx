import React from 'react'
import { View } from 'react-native'
import { deleteFile } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
import { useColorScheme } from 'nativewind'
import { TourGuideZone } from 'rn-tourguide'
import { Button, P } from '@/components/ui'
type BannerProps = {
  text: string
  deletarArquivo: () => void
  tourKey: string
}
export const Banner = ({ text, deletarArquivo, tourKey }: BannerProps) => {
  const { colorScheme } = useColorScheme()

  return (
    <View className="bg-gray-300 drop-shadow-md shadow-dark-200 dark:shadow-dark-100 dark:bg-dark-300 absolute z-10 top-4 p-5 flex flex-row flex-wrap justify-end gap-4">
      <View className="flex-row justify-around items-center w-full shadow-2xl shadow-dark-100">
        <Avatar.Icon
          size={50}
          style={{
            backgroundColor: `${
              colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
            }`,
            marginRight: 5,
          }}
          icon="file"
        />
        <P
          variant="normal"
          className="max-w-[75%]"
          lineBreakMode="clip"
          numberOfLines={2}
        >
          {text}
        </P>
      </View>
      <TourGuideZone
        zone={2}
        tourKey={tourKey}
        text={'Caso queira remover, basta clicar neste botão !'}
        borderRadius={5}
      >
        <Button
          variant="delete"
          onPress={async () => {
            await deleteFile()
            deletarArquivo()
          }}
        >
          <P variant="button">Excluir Arquivo</P>
        </Button>
      </TourGuideZone>
    </View>
  )
}
