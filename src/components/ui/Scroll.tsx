import React from 'react'
import {
  ScrollView,
  StyleProp,
  ViewStyle,
  RefreshControlProps,
} from 'react-native'
type ContainerProps = {
  children: React.ReactNode
  contentContainerStyle?: StyleProp<ViewStyle>
  fadingEdgeLength?: number | undefined
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        string | React.JSXElementConstructor<any>
      >
    | undefined
}
export const Scroll = ({
  children,
  contentContainerStyle,
  fadingEdgeLength,
  refreshControl,
}: ContainerProps) => {
  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      fadingEdgeLength={fadingEdgeLength}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  )
}
