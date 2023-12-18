import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { deleteFile } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
type BannerProps = {
  text: string
  deletarArquivo: () => void
}
export const Banner = ({ text, deletarArquivo }: BannerProps) => {
  return (
    <View className="dark:bg-dark-300 p-5 flex flex-row flex-wrap justify-end gap-4">
      <View className="flex flex-row justify-around items-center flex-wrap w-full">
        <Avatar.Icon
          size={50}
          style={{ backgroundColor: 'rgb(0, 255, 159)' }}
          icon="file"
        />
        <Text className="w-56 dark:text-dark-100">{text}</Text>
      </View>
      <Pressable
        className="dark:bg-dark-500 p-2 max-w-[35%] rounded-md relative right-0"
        onPress={async () => {
          await deleteFile()
          deletarArquivo()
        }}
      >
        <Text className="dark:text-white">Remover Arquivo</Text>
      </Pressable>
    </View>
  )
}
