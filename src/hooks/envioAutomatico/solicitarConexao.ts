import {enviar, ler} from './enviarLer';
export const solicitarConexao = async (
  address: string,
  MSG: string = '4944', //ID
) => {
  await enviar(address, MSG);
  const ID = await chipID(address);
  if (!ID) {
    return;
  }
  const calculoSenha = Math.floor((ID / 3) * 2 + 6);
  //534E = SN
  const chave = '534E0000' + calculoSenha.toString(16);
  await enviar(address, chave);
  return await validaResposta(address);
};
const chipID = async (address: string) => {
  let tentativas = 0;
  let ID = null;
  do {
    ID = await ler(address);
    if (ID?.includes('Chip ID:')) {
      return Number(ID.substring(9));
    } else {
      tentativas++;
    }
  } while (tentativas <= 3);
  return null;
};
export const validaResposta = async (address: string) => {
  let tentativas = 0;
  let resposta = null;
  do {
    resposta = await ler(address);
    if (resposta === 'OK' || resposta === 'ER' || resposta === 'apagado') {
      return resposta;
    } else {
      tentativas++;
    }
  } while (tentativas <= 3);
  return null;
};
