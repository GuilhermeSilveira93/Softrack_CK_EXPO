import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Content = ({ children }: ContainerProps) => {
  return (
    <View className="max-w-full min-h-[120px] w-[500px] bg-white dark:bg-dark-300 mb-4 rounded-xl content-center justify-center items-center">
      {children}
    </View>
  )
}
