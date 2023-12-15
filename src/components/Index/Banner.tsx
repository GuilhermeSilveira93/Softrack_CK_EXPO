import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Container } from '../ui/Container'
import { deleteFile } from '@/libs/arquivoCK'
import { Avatar } from 'react-native-paper'
type BannerProps = {
  text: string
  deletarArquivo: () => void
}
export const Banner = ({ text }: BannerProps) => {
  return (
    <Container>
      <View className="flex">
        <Avatar.Icon
          size={50}
          style={{ backgroundColor: 'blue' }}
          icon="file"
        />
        <Text>{text}</Text>
      </View>
      <View>
        <Pressable
          onPress={async () => {
            await deleteFile()
          }}
        >
          <Text>Remover Arquivo</Text>
        </Pressable>
      </View>
    </Container>
  )
}
