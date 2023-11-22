import RNBluetoothClassic from "react-native-bluetooth-classic";
export const isBluetoothEnable = async () => {
  try {
    const available = await RNBluetoothClassic.isBluetoothAvailable();
    return available
  } catch (err) {
    console.log('request location: ' + err)
    return err
  }
}

// operadores
// glp nao esta la
// tela de posição atual jogando pra fora
// parametros cliente
// cartão lider
// api banco de dados