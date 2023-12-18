import React from 'react'
import { View } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Content = ({ children }: ContainerProps) => {
  return (
    <View className="w-[99%] min-h-[120px] dark:bg-dark-300 mb-4 rounded-xl flex content-center justify-center items-center gap-1">
      {children}
    </View>
  )
}
