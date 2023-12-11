import RNBluetoothClassic from "react-native-bluetooth-classic";
export type dispositivosPareadosProps = {
  name: string;
  address: string;
  id: string;
  bonded?: Boolean;
  deviceClass?: string;
  rssi: Number;
  extra: Map<string, Object>;
};
export const dispositivosPareados = async (ID:string) => {
  const existe = await RNBluetoothClassic.getBondedDevices().then((res) => {
    return res.filter((res:dispositivosPareadosProps) => res.id === ID);
  });
  return existe.length > 0 ? true : false
};