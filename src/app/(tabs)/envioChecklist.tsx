import React, { useState, useCallback } from "react";
import { Link, Stack, useFocusEffect } from "expo-router";
import { Pressable, Text } from "react-native";
import { DispositivoEnv } from "@/components/tabs/DispositivoEnv";
import { fetchStrings } from "@/hooks/arquivoCK/fetchStrings";
import { fetchDevices } from "@/hooks/dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { Container } from "@/components/ui/Container";
import { FontAwesome } from "@expo/vector-icons";
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
        <Stack.Screen
          options={{
            headerRight: () => (
              <Link href="/envioChecklist" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
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
