import RNBluetoothClassic from 'react-native-bluetooth-classic';
type parearDispositivoProps = {
  ID: string;
  name: string;
};
export const parearDispositivo = async (
  dispositivos: parearDispositivoProps[],
) => {
  for (const dispositivo of dispositivos) {
    let tentativasEmp = 0;
    let confirm = false;
    while (!confirm && tentativasEmp < 3) {
      try {
        await RNBluetoothClassic.pairDevice(dispositivo.ID).then(
          async resposta => {
            if (resposta.bonded) {
              confirm = true;
              return true;
            }
            tentativasEmp++;
          },
        );
      } catch (error) {
        return false;
      }
    }
  }
};
