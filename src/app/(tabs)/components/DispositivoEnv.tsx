import React, { useState, useEffect } from "react";import { StyleSheet, Text, Pressable } from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ProgressBar } from "react-native-paper";
import {
  solicitarConexao,
  enviar,
  validaResposta,
  ler,
  validaGravado,
} from "@/hooks/envioAutomatico";
import { Container } from "@/components/ui/Container";
type DispositivoEnvProps = {
  devices: {
    name: string;
    ID: string;
  };
  strings: string[];
};
export const DispositivoEnv = ({ devices, strings }: DispositivoEnvProps) => {
  const [progressBar, setProgressBar] = useState<number>(0);
  const [enviarNovamente, setEnviarNovamente] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string>("");
  const [tentativasEmp, setTentativasEmp] = useState<number>(0);
  const [tentativasConex, setTentativasConex] = useState<number>(0);

  useEffect(() => {
    console.log("To aqui");
    inicioProcesso(devices.ID);
  }, []);

  const TentativasEmp = async (tentativa: number) => {
    setTentativasEmp(tentativa);
  };
  const TentativasConex = async (tentativa: number) => {
    setTentativasConex(tentativa);
  };
  const inicioProcesso = async (address: string) => {
    setProgressBar(0);
    setEnviarNovamente(false);
    await TentativasEmp(0);
    setMensagem("Conectando...");
    let confirm = false;
    while (!confirm && tentativasEmp < 3) {
      console.log("####################################### " + devices.name);
      try {
        const paired = await RNBluetoothClassic.getBondedDevices();
        var pareado = false;
        paired.forEach(async (BondedDevices) => {
          if (BondedDevices.address === address) {
            await conectarDispositivo(address)
              .then((res) => {
                confirm = true;
                pareado = true;
              })
              .catch((err) =>
                console.log(devices.name + " erro de conexão 1.")
              );
            return;
          }
        });
        if (!pareado) {
          await RNBluetoothClassic.pairDevice(address)
            .then((res) => console.log(devices.name + " pareado."))
            .catch((error) => {
              console.log(
                devices.name + " Erro durante o emparelhamento:",
                error
              );
            });
        }
        await TentativasEmp(tentativasEmp + 1);
        console.log(tentativasEmp);
      } catch (err) {
        console.log(err);
      }
    }
    await TentativasEmp(0);
  };
  const conectarDispositivo = async (address: string) => {
    console.log(devices.name + " começando a conectar " + tentativasConex);

    setEnviarNovamente(false);
    const conectado = await RNBluetoothClassic.isDeviceConnected(address).then(
      (res) => {
        return res;
      }
    );
    if (!conectado) {
      await RNBluetoothClassic.connectToDevice(address)
        .then(async () => {
          console.log(devices.name + " Conectado");
          await enviosLeituras(address);
        })
        .catch(async (err) => {
          console.log(devices.name + " erro conectarDipositivo " + err);
          //await TentativasConex(tentativasConex + 1);
          throw new Error(devices.name + " erro conectarDipositivo " + err);
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
        setEnviarNovamente(true);
      }
    } else {
      console.log(devices.name + " Erro de autenticação com o Módulo");
      setMensagem("Erro de autenticação com o Módulo");
      setEnviarNovamente(true);
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
              console.log(devices.name + " CRC : " + validacaoCRC);
              console.log(devices.name + " linha " + (i + 1) + " gravada.");
              setProgressBar(i + 1);
              setMensagem(`linha: ${i + 1} gravada`);
              tentativas = 5;
            } else {
              console.log(devices.name + " CRC não bateu");
              setMensagem("CRC não Bateu");
              enviarLinha = true;
              tentativas++;
            }
          }
        } while (tentativas <= 3);
        if (tentativas === 4) {
          console.log(
            devices.name + " Não foi possivel enviar a linha: " + (i + 1)
          );
          setMensagem(`Não foi possivel enviar a linha: ${i + 1}`);
          setEnviarNovamente(true);
          break;
        }
      }
    }
    setMensagem("Checklist enviado.");
    setProgressBar(strings.length);
    console.log(devices.name + " Linhas enviadas.");
    await enviar(address, "43480102030405060708");
    await RNBluetoothClassic.disconnectFromDevice(address);
    setEnviarNovamente(false);
  };
  return (
    <>
      <Container>
        <Text>{devices.name}</Text>
        {mensagem?.length > 0 && <Text style={styles.texto}>{mensagem}</Text>}
        {progressBar > 0 && (
          <>
            <Text style={styles.texto}>
              {Math.floor((progressBar * 100) / strings.length)}%
            </Text>
            <ProgressBar
              progress={(progressBar * 100) / strings.length / 100}
              color="#5E84E2"
              style={styles.progress}
            />
          </>
        )}
        {enviarNovamente && (
          <Pressable
            style={styles.botao}
            onPress={() => inicioProcesso(devices.ID)}>
            <FontAwesome name="send-o" color="#5E84E2" size={30} />
          </Pressable>
        )}
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
    width: 250,
  },
  botao: {
    position: "absolute",
    right: 40,
  },
});
