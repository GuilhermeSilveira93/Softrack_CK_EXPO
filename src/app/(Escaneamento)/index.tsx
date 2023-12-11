import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import {
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { fetchDevices } from "@/hooks/dispositivos";
import Dispositivos from "@/components/Escaneamento/Dispositivos";
import { Scroll } from "@/components/ui/Scroll";
import { Button } from "react-native-paper";
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
    nomeArquivo?:string;
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
  const startScan = useCallback(async () => {
    try {
      setScanning(true);
      console.log("Iniciando escaneamento...");
      await RNBluetoothClassic.startDiscovery()
        .then((res: EscanearDispositivosProps["dispositivos"]) => {
          setDispositivos(
            res.filter((devices) => devices.name.includes("SFTK_BT"))
          )
        })
        .catch((err) => {
          alert(err);
        });
      console.log("Escaneado");
    } catch (error) {
      console.log(error);
    } finally {
      setScanning(false);
    }
  }, [dispositivos]);
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
    );
  }
  if (!scanning && dispositivos.length < 1) {
    return (
      <Container>
        <Button mode="contained-tonal" style={{backgroundColor:"#1c73d2", paddingVertical:5,paddingHorizontal:15}} textColor="#fff" onPress={() => startScan()}>Escanear</Button>
      </Container>
    );
  }
  return (
    <>
      <Scroll>
        <Container>
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
          {dispositivos.length > 0 && (
            <Button disabled={scanning} mode="contained-tonal" style={{backgroundColor:"#1c73d2", paddingVertical:5,paddingHorizontal:15}} textColor="#fff" onPress={() => setDispositivos([])}>Limpar Lista</Button>
          )}
        </Container>
      </Scroll>
    </>
  );
};
const styles = StyleSheet.create({
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
});
export default EscanearDispositivos;
