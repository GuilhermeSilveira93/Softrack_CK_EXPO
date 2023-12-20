import { NativeMethods, Text, TextComponent } from 'react-native'
import { Constructor } from 'react-native/types/private/Utilities'
type PProps = {
  children: React.ReactNode
  props: Constructor<NativeMethods> & typeof TextComponent
}
export const P = ({ children, ...props }: PProps) => {
  return (
    <Text className="sm:text-sm" {...props}>
      {children}
    </Text>
  )
}
