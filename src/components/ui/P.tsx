import { Text } from 'react-native'
type PProps = {
  children: React.ReactNode
}
export const P = ({ children, ...props }: PProps) => {
  return <Text {...props}>{children}</Text>
}
