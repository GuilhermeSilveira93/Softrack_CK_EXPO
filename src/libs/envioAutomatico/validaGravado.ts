export const validaGravado = async (string: string, gravado: string) => {
  const crcResposta = Number(gravado.substring(9))
  const data = string.substring(string.length - 8).match(/../g)
  const buf = new ArrayBuffer(4)
  const view = new DataView(buf)
  data?.forEach(function (b, i) {
    view.setUint8(i, parseInt(b, 16))
  })
  const num = view.getUint32(0, true)
  return num === crcResposta
}
