import { StyleSheet, View, Text } from 'react-native'

import { Link, Stack } from 'expo-router'

export default function TelaNaoEncontrada() {
  return (
    <>
      <Stack.Screen options={{ title: 'Pagina não Encontrada' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Tela não encontrada</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar para Home</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
