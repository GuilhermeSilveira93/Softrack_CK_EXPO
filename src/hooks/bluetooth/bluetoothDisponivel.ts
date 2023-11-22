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
// ainda vendo, pois dividem o mesmo espaço fisico, está uma confusão.

// Maquina GLP
// Solicitar diretamente via e-mail suporte@softrack.com.br

// tela de posição atual jogando pra fora
// acessos de usuários consulta foram corrigidos.

// parametros cliente
// configurações de velocidade atual:
// Velocidade Alta 10km/h
// Tolerancia 10s
// Velocidade Muito Alta 15km/h

// cartão lider
// lider é o número 5, enquanto o administrador é 8.

// api banco de dados
// atualmente não disponibilizamos os dados de forma externa.