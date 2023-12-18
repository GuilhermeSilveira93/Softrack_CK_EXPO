import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { deleteFile } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
import Colors from 'tailwindcss/colors'
type BannerProps = {
  text: string
  deletarArquivo: () => void
}
export const Banner = ({ text, deletarArquivo }: BannerProps) => {
  return (
    <View className="bg-dark-100 shadow-md shadow-white p-5 flex flex-row flex-wrap justify-end gap-4">
      <View className="flex flex-row justify-around items-center flex-wrap w-full">
        <Avatar.Icon
          size={50}
          style={{ backgroundColor: 'blue' }}
          icon="file"
        />
        <Text className="w-56">{text}</Text>
      </View>
      <Pressable
        className="bg-slate-400 p-2 max-w-[35%] rounded-md relative right-0"
        onPress={async () => {
          await deleteFile()
          deletarArquivo()
        }}
      >
        <Text>Remover Arquivo</Text>
      </Pressable>
    </View>
  )
}
