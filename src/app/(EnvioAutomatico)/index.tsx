import React, { useState, useCallback } from "react";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Pressable, Text, ScrollView, RefreshControl } from "react-native";
import {
  useGlobalSearchParams,
} from "expo-router";
import { DispositivoEnv } from "@/components/envioChecklist/DispositivoEnv";
import { fetchStrings } from "@/hooks/arquivoCK/fetchStrings";
import { FetchListaDeEnvio, fetchDevices } from "@/hooks/dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { Container } from "@/components/ui/Container";
import { MaterialIcons } from "@expo/vector-icons";
type listaDispositivos = {
  params: {
    dispositivos: string;
    screen?: number
  };
};
export const EnvioAutomatico = () => {
  const listaDispositivos = useGlobalSearchParams()
  console.log(JSON.stringify(listaDispositivos))
  const [strings, setStrings] = useState<string[]>([]);
  const [filaDeEnvio, setFilaDeEnvio] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [atualizarTudo, setAtualizarTudo] = useState<boolean>(false);
  const [listaDeEnvio, setListaDeEnvio] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);
  useFocusEffect(
    useCallback(() => {
      FetchListaDeEnvio().then((res) => {
        setListaDeEnvio(res);
      });
      fetchStrings().then((res) => setStrings(res));
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
      setAtualizarTudo(!atualizarTudo);
      setListaDeEnvio([]);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [atualizarTudo, filaDeEnvio]);

  if (listaDeEnvio?.length > 0 && strings?.length > 0) {
    console.log("no if: " + filaDeEnvio);
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
            return (
              <>
                <DispositivoEnv
                devices={dispositivo}
                strings={strings}
                atualizaFilaDeEnvio={atualizaFilaDeEnvio}
                key={dispositivo.ID}
              />
              </>
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
