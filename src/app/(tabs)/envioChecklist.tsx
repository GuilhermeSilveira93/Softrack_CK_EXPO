import React, { useState, useCallback } from "react";import { useFocusEffect } from "expo-router";
import { Text } from "react-native";
import { DispositivoEnv } from "./components/DispositivoEnv";
import { fetchStrings } from "@/hooks/arquivoCK/fetchStrings";
import { fetchDevices } from "@/hooks/dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { Container } from "@/components/ui/Container";
export const EnvioAutomatico = () => {
  const [strings, setStrings] = useState<string[]>([]);
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);
  useFocusEffect(
    useCallback(() => {
      fetchDevices().then((res) => {
        setLocalDevices(res);
      });
      fetchStrings().then((res) => setStrings(res));
    }, [])
  );
  if (localDevices?.length > 0 && strings?.length > 0) {
    return (
      <>
        {localDevices?.map((dispositivo) => {
          return (
            <DispositivoEnv
              devices={dispositivo}
              strings={strings}
              key={dispositivo.ID}
            />
          );
        })}
      </>
    );
  } else {
    return (
      <Container>
        <Text>
          Para enviar o checklist, é necessario ter uma lista de dispositivos e
          um arquivo previamente carregado.
        </Text>
        <Text>Navegue para as abas anteriores e faça o processo.</Text>
      </Container>
    );
  }
};
export default EnvioAutomatico;
