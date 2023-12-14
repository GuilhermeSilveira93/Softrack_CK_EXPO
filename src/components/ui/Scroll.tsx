import React from 'react'
import {
  StyleSheet,
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
      className="p-2 flex-1"
    >
      {children}
    </ScrollView>
  )
}
