import React, { useState, useEffect } from "react";import { useFocusEffect } from "expo-router";
import { Container } from "@/components/ui/Container";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { fetchDevices } from "@/hooks/dispositivos";
import Dispositivos from "@/components/Dispositivos";
import { ScrollView } from "react-native-gesture-handler";
export type EscanearDispositivosProps = {
  dispositivos: {
    name: string;
    address: string;
    id: string;
    bonded?: Boolean;
    deviceClass?: string;
    rssi: Number;
    extra: Map<string, Object>;
  }[];
  localDevices: {
    ID: string;
    name: string;
  }[];
  scanning: boolean;
  showModal: boolean;
  handleDeviceID: string;
  handleDeviceNAME: string;
};
export const EscanearDispositivos = () => {
  const [dispositivos, setDispositivos] = useState<
    EscanearDispositivosProps["dispositivos"]
  >([]);
  const [localDevices, setLocalDevices] = useState<
    EscanearDispositivosProps["localDevices"]
  >([]);
  const [scanning, setScanning] =
    useState<EscanearDispositivosProps["scanning"]>(false);


  useEffect(() => {
    fetchDevices().then((res) => setLocalDevices(res));
    startScan();
  }, []);
  const startScan = async () => {
    try {
      setScanning(true);
      console.log("Iniciando escaneamento...");
      await RNBluetoothClassic.startDiscovery()
        .then((res: EscanearDispositivosProps["dispositivos"]) => {
          setDispositivos(
            res.filter((devices) => devices.name.includes("SFTK_BT"))
          );
        })
        .catch((err) => {
          console.log("Erro Scan");
          console.log(err);
        });
      console.log("Escaneado");
    } catch (error) {
      console.log(error);
    } finally {
      setScanning(false);
    }
  };
  const attLocalDevices = async (
    novosDispositivos: EscanearDispositivosProps["localDevices"]
  ) => {
    setLocalDevices(novosDispositivos);
  };
  if (scanning) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#1c73d2" />
      </Container>
    )
  }
  return (
    <ScrollView>
      <>
        {dispositivos?.map((device) => {
          return (
            <Dispositivos
              key={device.id}
              dispositivosSalvos={localDevices}
              name={device.name}
              ID={device.id}
              attLocalDevices={attLocalDevices}
            />
          );
        })}
        <Container>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            {dispositivos?.length > 0 && !scanning && (
              <Pressable
                disabled={scanning}
                onPress={() => {
                  setDispositivos([]);
                }}
                style={styles.botao}>
                <Text style={styles.textWhite}>Limpar Lista</Text>
              </Pressable>
            )}
            {!scanning && (
              <Pressable
                onPress={() => startScan()}
                style={styles.botao}
                disabled={scanning}>
                <Text style={styles.textWhite}>
                  {`${
                    dispositivos.length === 0
                      ? "Escanear"
                      : "Escanear Novamente"
                  }`}
                </Text>
              </Pressable>
            )}
          </View>
        </Container>
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlack: {
    color: "#000",
  },
  textWhite: {
    color: "#fff",
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#1c73d2",
    width: "50%",
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  maquinas: {
    borderWidth: 2,
    borderColor: "#1c73d2",
    flexDirection: "row",
    backgroundColor: "beige",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    width: 250,
    borderRadius: 20,
    color: "#fff",
  },
});
export default EscanearDispositivos;
