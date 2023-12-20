import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { deleteFile } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
import { useColorScheme } from 'nativewind'
type BannerProps = {
  text: string
  deletarArquivo: () => void
}
export const Banner = ({ text, deletarArquivo }: BannerProps) => {
  const { colorScheme } = useColorScheme()

  return (
    <View className="bg-gray-200 drop-shadow-md shadow-dark-200 dark:shadow-dark-100 dark:bg-dark-300 absolute z-10 top-4 p-5 flex flex-row flex-wrap justify-end gap-4">
      <View className="flex flex-row justify-around items-center flex-wrap w-full shadow-2xl shadow-dark-100">
        <Avatar.Icon
          size={50}
          style={{
            backgroundColor: `${
              colorScheme === 'dark' ? 'rgb(0, 255, 159)' : '#465DFF'
            }`,
          }}
          icon="file"
        />
        <Text className="w-56 dark:text-dark-100">{text}</Text>
      </View>
      <Pressable
        className="bg-dark-500 p-2 max-w-[55%] rounded-md relative right-0"
        onPress={async () => {
          await deleteFile()
          deletarArquivo()
        }}
      >
        <Text className="text-white">Remover Arquivo</Text>
      </Pressable>
    </View>
  )
}
