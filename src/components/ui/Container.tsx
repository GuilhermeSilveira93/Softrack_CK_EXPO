import React from 'react'
import { View, StyleSheet } from 'react-native'
type ContainerProps = {
  children: React.ReactNode
}
export const Container = ({ children }: ContainerProps) => {
  return <View style={styles.container}>{children}</View>
}
const styles = StyleSheet.create({
  container: {
    padding: 2,
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})
