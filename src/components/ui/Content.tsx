import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Content = ({ children }: ContainerProps) => {
  return (
    <View className="w-full flex content-center justify-center items-center gap-1">
      {children}
    </View>
  )
}
