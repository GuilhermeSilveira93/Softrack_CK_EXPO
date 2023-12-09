import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ProgressBar, List } from "react-native-paper";
import {
  solicitarConexao,
  enviar,
  validaResposta,
  ler,
  validaGravado,
} from "@/hooks/envioAutomatico";
import { Container } from "@/components/ui/Container";
import { checklistEnviado } from "@/hooks/arquivoCK";
type DispositivoEnvProps = {
  nomeArquivo: string;
  devices: {
    name: string;
    ID: string;
  };
  strings: string[];
  atualizaFilaDeEnvio: (valor: boolean) => void;
};
export const DispositivoEnv = ({
  devices,
  strings,
  atualizaFilaDeEnvio,
  nomeArquivo,
}: DispositivoEnvProps) => {
  const [progressBar, setProgressBar] = useState<number>(0);
  const [enviarNovamente, setEnviarNovamente] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>("");
  const [tentativasConexoes, setTentativasConexoes] = useState<number>(0);
  useEffect(() => {
    if (tentativasConexoes > 3) {
      setMensagem("Tentativas automaticas excedidas");
      setEnviarNovamente(true);
    } else {
      atualizaFilaDeEnvio(true);
      conectarDispositivo(devices.ID);
    }
  }, [tentativasConexoes]);
  const conectarDispositivo = async (address: string) => {
    setMensagem("Iniciando...");
    setProgressBar(0);
    setEnviarNovamente(false);
    const conectado = await RNBluetoothClassic.isDeviceConnected(address).then(
      (res) => {
        return res;
      }
    );
    if (!conectado) {
      await RNBluetoothClassic.connectToDevice(address)
        .then(async () => {
          await enviosLeituras(address);
        })
        .catch(async (err) => {
          console.log(devices.name + " erro conectarDipositivo " + err);
          atualizaFilaDeEnvio(false);
          setMensagem("Erro ao conectar o dispositivo");
          setTentativasConexoes(tentativasConexoes + 1);
        });
    } else {
      await enviosLeituras(address);
    }
  };
  const enviosLeituras = async (address: string) => {
    const conexao = await solicitarConexao(address);
    if (conexao === "OK") {
      setMensagem("OK");
      await enviar(address, "524D");
      const resposta = await validaResposta(address);
      if (resposta === "apagado") {
        await envioArquivo(address);
      } else {
        console.log(devices.name + " Erro ao limpar o modulo");
        setMensagem("Erro ao limpar o modulo");
        atualizaFilaDeEnvio(false);
        setTentativasConexoes(tentativasConexoes + 1);
      }
    } else {
      console.log(devices.name + " Erro de autenticação com o Módulo");
      setMensagem("Erro de autenticação com o Módulo");
      atualizaFilaDeEnvio(false);
      setTentativasConexoes(tentativasConexoes + 1);
    }
  };
  const envioArquivo = async (address: string) => {
    for (let i = 0; i < strings.length; i++) {
      let enviarLinha = true;
      console.log(devices.name + " Começando linha " + (i + 1));
      let tentativas = 0;
      let nullos = 0;
      const linha = strings[i];
      if (linha.length > 0) {
        do {
          if (enviarLinha) {
            await enviar(address, linha);
            enviarLinha = false;
          }
          const resposta = await ler(address);
          console.log(devices.name + " tentativa " + tentativas);
          if (resposta === null) {
            nullos++;
            console.log(devices.name + " nullos " + nullos);
            if (nullos > 3) {
              enviarLinha = true;
              nullos = 0;
            }
          } else if (resposta === "ER grava") {
            setMensagem(`diferente de gravado, linha: ${i + 1}`);
            enviarLinha = true;
            tentativas++;
          } else {
            const validacaoCRC = await validaGravado(linha, resposta);
            if (validacaoCRC) {
              setProgressBar(i + 1);
              setMensagem(`linha: ${i + 1} gravada`);
              tentativas = 5;
            } else {
              setMensagem("CRC não Bateu");
              enviarLinha = true;
              tentativas++;
            }
          }
        } while (tentativas <= 3);
        if (tentativas === 4) {
          setMensagem(`Não foi possivel enviar a linha: ${i + 1}`);
          atualizaFilaDeEnvio(false);
          setTentativasConexoes(tentativasConexoes + 1);
          break;
        }
      }
    }
    console.log('nomeArquivo')
    console.log(nomeArquivo)
    console.log('nomeArquivo')
    await checklistEnviado(devices.name, address, nomeArquivo)
    setMensagem("Checklist enviado.");
    setProgressBar(strings.length);
    await enviar(address, "43480102030405060708");
    await RNBluetoothClassic.disconnectFromDevice(address);
    atualizaFilaDeEnvio(false);
    setEnviarNovamente(false);
  };
  return (
    <>
      <Container key={devices.ID}>
        <List.Item
          style={{
            backgroundColor: "rgba(0,170,255,0.2)",
            borderRadius: 10,
            minHeight: 80,
          }}
          //     descriptionStyle={{ color: "#fff" }}
          titleStyle={{ fontWeight: "700" }}
          title={`${devices.name}`}
          description={() => (
            <>
              {mensagem?.length > 0 && (
                <Text style={styles.texto}>{mensagem}</Text>
              )}
              {progressBar > 0 && progressBar < strings.length && (
                <ProgressBar
                  progress={(progressBar * 100) / strings.length / 100}
                  color="#5E84E2"
                  style={styles.progress}
                />
              )}
            </>
          )}
          left={() => <List.Icon icon="bluetooth" />}
          right={() => (
            <>
              {enviarNovamente && (
                <Pressable
                  onPress={() => {
                    setTentativasConexoes(0);
                  }}>
                  <FontAwesome name="send-o" color="#5E84E2" size={30} />
                </Pressable>
              )}
              {progressBar === strings.length && (
                <FontAwesome name="check-circle" color="#66aa66" size={30} />
              )}
            </>
          )}
        />
      </Container>
    </>
  );
};
const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  texto: {
    color: "black",
  },
  progress: {
    height: 10,
    width: "100%",
  },
  botao: {
    position: "absolute",
    right: 40,
  },
});
