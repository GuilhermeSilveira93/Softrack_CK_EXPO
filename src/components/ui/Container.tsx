import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Container = ({ children }: ContainerProps) => {
  return (
    <View className="dark:bg-dark-400 p-2 flex-1 w-screen items-center justify-center">
      {children}
    </View>
  )
}
