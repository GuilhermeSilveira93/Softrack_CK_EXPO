import React from "react"
import { StyleSheet, ScrollView } from "react-native"
type ContainerProps = {
  children: React.ReactNode
}
export const Scroll = ({children}:ContainerProps) =>{
  return (
    <ScrollView style={styles.container}>{children}</ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    padding:2,
    flex: 1,
    backgroundColor: '#fff',
  },
});
