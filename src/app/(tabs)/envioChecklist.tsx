import React, { useState, useCallback } from "react";import { Stack, useFocusEffect, router, useNavigation } from "expo-router";
import { Pressable, Text, ScrollView, RefreshControl } from "react-native";
import { DispositivoEnv } from "@/components/envioChecklist/DispositivoEnv";
import { fetchStrings } from "@/hooks/arquivoCK/fetchStrings";
import { fetchDevices } from "@/hooks/dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { Container } from "@/components/ui/Container";
import { MaterialIcons } from "@expo/vector-icons";
export const EnvioAutomatico = () => {
  const [strings, setStrings] = useState<string[]>([]);
  const [qtdEnvio, setQtdEnvio] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [atualizarTudo, setAtualizarTudo] = useState<boolean>(false);
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);

  const router = useNavigation();
  useFocusEffect(
    useCallback(() => {
      fetchDevices().then((res) => {
        setLocalDevices(res);
      });
      fetchStrings().then((res) => setStrings(res));
      console.log('focus: ' + qtdEnvio);
    }, [atualizarTudo])
  );

  const atualizaQtdEnvio = (valor: boolean) => {
    if (valor) {
      setQtdEnvio(prev => prev + 1);
    } else {
      setQtdEnvio(prev => prev - 1);
    }
    console.log("atualizei " + valor);
  }

  const onRefresh = useCallback(() => {
    console.log('refresh: ' + qtdEnvio);
    if (qtdEnvio === 0) {
      console.log('refresh2: ' + qtdEnvio);
      setRefreshing(true);
      setAtualizarTudo(!atualizarTudo);
      setLocalDevices([]);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [atualizarTudo, qtdEnvio]);

  if (localDevices?.length > 0 && strings?.length > 0) {
    console.log('no if: ' + qtdEnvio);
    return (
      <>
        <Stack.Screen
          options={{
            title: `Enviar Checklist ${qtdEnvio}`,
            /* headerRight: () => (
              <Pressable>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ), */
          }}
        />
        <ScrollView
          contentContainerStyle={{ minHeight: "auto" }}
          fadingEdgeLength={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {localDevices.map((dispositivo) => {
            return (
              <DispositivoEnv
                devices={dispositivo}
                strings={strings}
                atualizaQtdEnvio={atualizaQtdEnvio}
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
            /* headerRight: () => (
              <Pressable>
                {({ pressed }) => (
                  <MaterialIcons
                    name="update"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ), */
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
