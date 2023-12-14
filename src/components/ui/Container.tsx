import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Container = ({ children }: ContainerProps) => {
  return (
    <View className="dark:bg-dark-3 light:bg-light-2 p-2 flex-1 content-center justify-center items-center">
      {children}
    </View>
  )
}
