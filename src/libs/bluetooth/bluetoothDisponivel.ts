import RNBluetoothClassic from 'react-native-bluetooth-classic'
export const isBluetoothEnable = async () => {
  try {
    const available = await RNBluetoothClassic.isBluetoothAvailable()
    return available
  } catch (err) {
    return err
  }
}
