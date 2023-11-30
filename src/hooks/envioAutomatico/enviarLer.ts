import RNBluetoothClassic from 'react-native-bluetooth-classic';
export const enviar = async (
  address: string,
  msg: string,
  tipo: string = 'hex',
) => {
  return await RNBluetoothClassic.writeToDevice(address, msg, tipo)
    .then(res => {
      return res;
    })
    .catch(err => {
      return null;
    });
};
export const ler = async (address: string) => {
  let data = new Date();
  let segundos = data.getTime();
  let resposta = null;
  do {
    resposta = await RNBluetoothClassic.readFromDevice(address)
      .then(res => {
        if (res) {
          return res.substring(0, res.length - 1);
        } else {
          return null;
        }
      })
      .catch(err => err);
  } while (new Date().getTime() - segundos < 2000 && resposta === null);
  return resposta;
};
