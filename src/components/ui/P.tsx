import { Text, TextProps } from 'react-native'
import { styled } from 'nativewind'
type MeuParagrafoProps = TextProps & {
  variant: 'normal' | 'button'
}
export const Paragrafo = ({ children, ...props }: MeuParagrafoProps) => {
  switch (props.variant) {
    case 'button':
      return <MeuParagrafoBotoes {...props}>{children}</MeuParagrafoBotoes>
    case 'normal':
      return <MeuParagrafo {...props}>{children}</MeuParagrafo>
    default:
      break
  }
}
const MeuParagrafo = ({ children, ...props }: MeuParagrafoProps) => {
  return (
    <Text className="text-left dark:text-dark-100" {...props}>
      {children}
    </Text>
  )
}
const MeuParagrafoBotoes = ({ children, ...props }: MeuParagrafoProps) => {
  return (
    <Text className="text-white dark:text-white text-center" {...props}>
      {children}
    </Text>
  )
}
const P = styled(Paragrafo)
export { P }
