import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Content = ({ children }: ContainerProps) => {
  return (
    <View className="w-full min-h-[120px] max-w-[500px] bg-white shadow-2xl dark:bg-dark-300 mb-4 rounded-xl content-center justify-center items-center">
      {children}
    </View>
  )
}
