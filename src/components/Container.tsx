import { View } from "react-native"
type ContainerProps = {
  children: React.ReactNode
}
export const Container = ({children}:ContainerProps) => {
  return(
    <View>
      {children}
    </View>
  )
}
export default Container