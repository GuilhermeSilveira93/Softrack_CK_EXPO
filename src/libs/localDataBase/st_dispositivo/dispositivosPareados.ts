import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic'
export const dispositivosPareados = async (ID: string) => {
  const existe = await RNBluetoothClassic.getBondedDevices().then((res) => {
    return res.filter((res: BluetoothDevice) => res.id === ID)
  })
  return existe.length > 0
}
