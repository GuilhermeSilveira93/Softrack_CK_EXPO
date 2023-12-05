import { Stack, useFocusEffect } from "expo-router";import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { fetchDevices } from "@/hooks/dispositivos";
import { Link } from "expo-router";
import { Divider, Button } from "react-native-paper";
import { Container } from "@/components/ui/Container";
import Dispositivos from "@/components/listaDeEnvioChecklist/Dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { LocalDevices } from "@/types/localDevices";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const listaDeEnvioChecklist = () => {
  const [localDevices, setLocalDevices] =
    useState<EscanearDispositivosProps["localDevices"]>();
  const [listaDeEnvio, setListaDeEnvio] = useState<LocalDevices[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  useFocusEffect(
    useCallback(() => {
      fetchDevices().then((res) => {
        setLocalDevices(res);
        setLoadingDevices(false);
      });
    }, [])
  );
  const ListaDeEnvio = async (ID: string, name: string) => {
    let existe = false;
    listaDeEnvio.forEach((item) => {
      if (item.ID === ID) {
        existe = true;
      }
    });
    if (existe) {
      const dispositivos = listaDeEnvio.filter((item) => item.ID !== ID);
      setListaDeEnvio(dispositivos)
      await AsyncStorage.removeItem("listaDeEnvio");
      await AsyncStorage.setItem("listaDeEnvio", JSON.stringify(dispositivos));
    } else {
      const dispositivos = [...listaDeEnvio, { ID, name }];
      setListaDeEnvio(dispositivos)
      await AsyncStorage.removeItem("listaDeEnvio");
      await AsyncStorage.setItem("listaDeEnvio", JSON.stringify(dispositivos));
    }
  };
  if (!localDevices || localDevices?.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Lista de Envio de Checklist",
          }}
        />
        <Container>
          <Text>Não existem dispositivos adicionados.</Text>
          <Link href={"/(Escaneamento)"} asChild>
            <Button
              icon="magnify-scan"
              mode="contained"
              style={{ backgroundColor: "#1c73d2" }}>
              Escanear Dispositivos
            </Button>
          </Link>
        </Container>
      </>
    );
  }
  return (
    <>
      <Stack.Screen options={{ title: "Lista de Envio de Checklist" }} />
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        fadingEdgeLength={1}>
        <View>
          {localDevices?.map((devices) => {
            let existe = false;
            listaDeEnvio.forEach((dispositivo) => {
              if (dispositivo.ID === devices.ID) {
                existe = true;
              }
            });
            return (
              <Container key={devices.ID}>
                <Dispositivos
                  name={devices.name}
                  ID={devices.ID}
                  dispositivosSalvos={localDevices}
                  key={devices.ID}
                  listaDeEnvio={ListaDeEnvio}
                  existe={existe}
                />
              </Container>
            );
          })}
          <Divider
            style={{
              width: "100%",
              height: 5,
              backgroundColor: "rgb(200,200,200)",
              marginVertical: 10,
            }}
          />
          <Link href={"/(EnvioAutomatico)"} asChild>
            <Button
              icon="magnify-scan"
              mode="contained"
              style={{ backgroundColor: "#1c73d2" }}>
              Enviar para Dispositivos Selecionados
            </Button>
          </Link>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  ScrollView: {
    minHeight: "100%",
  },
  centeredView: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    height: "100%",
  },
  textBlack: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  textWhite: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  maquinas: {
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    minWidth: "87%",
    flex: 1,
    maxHeight: 60,
    justifyContent: "space-between",
  },
});
export default listaDeEnvioChecklist;
