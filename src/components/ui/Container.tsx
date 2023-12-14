import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Container = ({ children }: ContainerProps) => {
  return (
    <View className="light:bg-blue-500 dark:bg-red-500 p-2 flex-1 content-center justify-center items-center">
      {children}
    </View>
  )
}
