import { TouchableOpacityProps, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
type MyButtonProps = TouchableOpacityProps & {
  variant: 'normal' | 'delete'
}
export const MyButton = ({ children, ...props }: MyButtonProps) => {
  switch (props.variant) {
    case 'normal':
      return <MyButtonNormal {...props}>{children}</MyButtonNormal>
    case 'delete':
      return <MyButtonDelete {...props}>{children}</MyButtonDelete>
    default:
      break
  }
}
const MyButtonNormal = ({ children, ...props }: MyButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-dark-200 shadow-dark-200 shadow-xl p-3 rounded-md text-center flex-row items-center dark:shadow-dark-100"
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}
const MyButtonDelete = ({ children, ...props }: MyButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-dark-500 shadow-dark-200 shadow-xl p-3 rounded-md text-center flex-row items-center dark:shadow-dark-100"
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}
const Button = styled(MyButton)
export { Button }
