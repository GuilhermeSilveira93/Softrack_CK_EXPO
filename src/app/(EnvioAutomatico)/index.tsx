import React, { useState, useCallback } from "react";import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Pressable, Text, ScrollView, RefreshControl } from "react-native";
import router from "expo-router";
import { DispositivoEnv } from "@/components/envioChecklist/DispositivoEnv";
import { fetchStrings } from "@/hooks/arquivoCK/fetchStrings";
import { FetchListaDeEnvio } from "@/hooks/dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { Container } from "@/components/ui/Container";
import { MaterialIcons } from "@expo/vector-icons";
import { fetchNomeArquivo } from "@/hooks/arquivoCK";
type listaDispositivos = {
  params: {
    dispositivos: string;
    screen?: number;
  };
};
export const EnvioAutomatico = () => {
  const [strings, setStrings] = useState<string[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState<string>("");
  const [filaDeEnvio, setFilaDeEnvio] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [atualizarTudo, setAtualizarTudo] = useState<boolean>(false);
  const [listaDeEnvio, setListaDeEnvio] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        FetchListaDeEnvio().then((res) => {
          setListaDeEnvio(res);
        }),
        fetchStrings().then((res) => setStrings(res)),
        fetchNomeArquivo().then((res: string ) => setNomeArquivo(res)),
      ]);
    }, [atualizarTudo])
  );
  const atualizaFilaDeEnvio = (valor: boolean) => {
    if (valor) {
      setFilaDeEnvio((prev) => prev + 1);
    } else {
      setFilaDeEnvio((prev) => prev - 1);
    }
    console.log("atualizei " + valor);
  };
  const onRefresh = useCallback(() => {
    if (filaDeEnvio === 0) {
      setRefreshing(true);
      setListaDeEnvio([]);
      setAtualizarTudo(!atualizarTudo);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [atualizarTudo, filaDeEnvio]);

  if (listaDeEnvio?.length > 0 && strings?.length > 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: `Enviar Checklist ${filaDeEnvio}`,
            headerRight: () => (
              <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <ScrollView
          contentContainerStyle={{ minHeight: "auto" }}
          fadingEdgeLength={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {listaDeEnvio.map((dispositivo) => {
            console.log('nomeArquivo')
            console.log(nomeArquivo)
            console.log('nomeArquivo')
            return (
              <DispositivoEnv
                devices={dispositivo}
                strings={strings}
                atualizaFilaDeEnvio={atualizaFilaDeEnvio}
                nomeArquivo={nomeArquivo}
                key={dispositivo.ID}
              />
            );
          })}
        </ScrollView>
      </>
    );
  } else {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable onPress={() => setAtualizarTudo(!atualizarTudo)}>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Container>
          <Text>
            Para enviar o checklist, é necessario ter uma lista de dispositivos
            e um arquivo previamente carregado.
          </Text>
          <Text>Navegue para as abas anteriores e faça o processo.</Text>
        </Container>
      </>
    );
  }
};
export default EnvioAutomatico;
