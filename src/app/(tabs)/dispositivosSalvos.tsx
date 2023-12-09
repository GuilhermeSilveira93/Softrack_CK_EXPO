import { Stack, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
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
import Dispositivos from "@/components/dispositivosSalvos/Dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { fetchChecklistEnviado } from "@/hooks/arquivoCK";
export const DispositivosSalvos = () => {
  const [localDevices, setLocalDevices] =
    useState<EscanearDispositivosProps["localDevices"]>();
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true);
  const [bloqueio, setBloqueio] = useState<boolean>(false);
  const [ checklistEnviado, setChecklistEnviado] = useState<EscanearDispositivosProps["localDevices"]>([])
  useFocusEffect(
    useCallback(() => {
      Promise.all([
      fetchDevices().then((res) => {
        setLocalDevices(res);
        setLoadingDevices(false);
      }),
      fetchChecklistEnviado().then(res => setChecklistEnviado(res))
    ])
    }, [])
  );
  const setaBloqueio = () => {
    setBloqueio(prev => !prev)
  }
  const attLocalDevices = async (
    novosDispositivos: EscanearDispositivosProps["localDevices"]
  ) => {
    setLocalDevices(novosDispositivos);
  };
  if (loadingDevices) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#1c73d2" />
      </Container>
    );
  }
  if (!localDevices || localDevices?.length === 0) {
    return (
      <>
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
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        fadingEdgeLength={1}>
        <View>
          {localDevices?.map((devices) => {
            return (
              <Container key={devices.ID}>
                <Dispositivos
                  name={devices.name}
                  ID={devices.ID}
                  dispositivosSalvos={localDevices}
                  key={devices.ID}
                  attLocalDevices={attLocalDevices}
                  setaBloqueio={setaBloqueio}
                  bloqueio={bloqueio}
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
          <Link href={"/(Escaneamento)"} asChild>
            <Button
              icon="magnify-scan"
              mode="contained"
              style={{ backgroundColor: "#1c73d2" }}
            >
              Escanear Dispositivos
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
export default DispositivosSalvos;
