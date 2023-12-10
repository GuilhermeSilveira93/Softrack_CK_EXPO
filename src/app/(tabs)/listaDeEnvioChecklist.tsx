import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { fetchDevices } from "@/hooks/dispositivos";
import { Link } from "expo-router";
import { Divider, Button } from "react-native-paper";
import { Container } from "@/components/ui/Container";
import Dispositivos from "@/components/listaDeEnvioChecklist/Dispositivos";
import { EscanearDispositivosProps } from "../(Escaneamento)";
import { LocalDevices } from "@/types/localDevices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNomeArquivo } from "@/hooks/arquivoCK";
import { fetchChecklistEnviado } from "@/hooks/localDataBase/st_dispositivo_checklist";
export const listaDeEnvioChecklist = () => {
  const router = useRouter();
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);
  const [listaDeEnvio, setListaDeEnvio] = useState<LocalDevices[]>([]);
  const [nomeArquivo, setNomeArquivo] =useState<string>('')
  const [checklistsEnviados, setChecklistsEnviados] = useState([]);
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchDevices().then(
          (res: EscanearDispositivosProps["localDevices"]) => {
            if (res.length > 0) {
              setLocalDevices(res);
            } else {
              router.push("/(tabs)/");
            }
          }
        ),
        fetchChecklistEnviado().then((res) => setChecklistsEnviados(res)),
        setListaDeEnvio([]),
        fetchNomeArquivo().then((res) => setNomeArquivo(res))
      ]);
    }, [])
  );
  const ListaDeEnvio = useCallback(
    async (ID: string, name: string) => {
      let existe = false;
      listaDeEnvio.forEach((item) => {
        if (item.ID === ID) {
          existe = true;
        }
      });
      if (existe) {
        const dispositivos = listaDeEnvio.filter((item) => item.ID !== ID);
        setListaDeEnvio(dispositivos);
        await AsyncStorage.removeItem("listaDeEnvio");
        await AsyncStorage.setItem(
          "listaDeEnvio",
          JSON.stringify(dispositivos)
        );
      } else {
        const dispositivos = [...listaDeEnvio, { ID, name, nomeArquivo }];
        setListaDeEnvio(dispositivos);
        await AsyncStorage.removeItem("listaDeEnvio");
        await AsyncStorage.setItem(
          "listaDeEnvio",
          JSON.stringify(dispositivos)
        );
      }
    },
    [listaDeEnvio]
  );
  return (
    <>
      <Stack.Screen options={{ title: "Dispositivos para Enviar" }} />
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
                  nomeArquivo={nomeArquivo}
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
});
export default listaDeEnvioChecklist;
