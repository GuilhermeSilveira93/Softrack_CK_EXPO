export const validaGravado = async (string: string, gravado: string) => {
  var crcResposta = Number(gravado.substring(9));
  var data = string.substring(string.length - 8).match(/../g);
  var buf = new ArrayBuffer(4);
  var view = new DataView(buf);
  data?.forEach(function (b, i) {
    view.setUint8(i, parseInt(b, 16));
  });
  var num = view.getUint32(0, true);
  return num === crcResposta;
};
