import { enviar, ler } from './enviarLer'
export const solicitarConexao = async (
  address: string,
  MSG = '4944', // ID
) => {
  const tipo = 'hex'
  await enviar(address, MSG, tipo)
  const ID = await chipID(address)
  console.log('ID ' + ID)
  if (!ID) {
    return
  }
  const calculoSenha = Math.floor((ID / 3) * 2 + 6)
  const chave = '534E0000' + calculoSenha.toString(16)
  await enviar(address, chave, tipo)
  return await validaResposta(address)
}
const chipID = async (address: string) => {
  let tentativas = 0
  let ID = null
  do {
    console.log(tentativas)
    ID = await ler(address)
    if (ID?.includes('Chip ID:')) {
      return Number(ID.substring(9))
    } else {
      tentativas++
    }
  } while (tentativas <= 3)
  return null
}
export const validaResposta = async (address: string) => {
  let tentativas = 0
  let resposta = null
  do {
    resposta = await ler(address)
    console.log('resposta ' + resposta)
    if (resposta === 'OK' || resposta === 'ER' || resposta === 'apagado') {
      return resposta
    } else {
      tentativas++
    }
  } while (tentativas <= 3)
  return null
}
