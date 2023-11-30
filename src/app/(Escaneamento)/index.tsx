import React, { useState, useCallback, useEffect } from "react";import { useFocusEffect } from "expo-router";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddDispositivo from "./components/addDispositivoModal";
import DispositivosEscaneados from "@/components/DispositivosEscaneados";
import { requestAccessFineLocationPermission } from "@/hooks/bluetooth";
type EscanearDispositivosProps = {
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
  const [showModal, setShowModal] =
    useState<EscanearDispositivosProps["showModal"]>(false);
  const [handleDeviceID, setHandleDeviceID] =
    useState<EscanearDispositivosProps["handleDeviceID"]>("");
  const [handleDeviceNAME, setHandleDeviceNAME] =
    useState<EscanearDispositivosProps["handleDeviceNAME"]>("");

  useEffect(() => {
    console.log("estou aqui useEffect");
    startScan();
  }, []);
  const startScan = async () => {
    try {
      setScanning(true);
      console.log("Iniciando escaneamento...");
      await RNBluetoothClassic.startDiscovery()
        .then((res) => {
          console.log("res : " + res);
          setDispositivos(res);
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
  const incluirDispositivo = async () => {
    console.log(localDevices);
    if (localDevices.length > 0) {
      setLocalDevices((prevDevices) => [
        ...prevDevices,
        { ID: handleDeviceID, name: handleDeviceNAME },
      ]);
    } else {
      setLocalDevices([{ ID: handleDeviceID, name: handleDeviceNAME }]);
    }
    return;
  };
  const handleShowAlert = async (device: string = "", name: string = "") => {
    setShowModal(!showModal);
    setHandleDeviceID(device);
    setHandleDeviceNAME(name);
  };
  const adicionarDispositivo = async () => {
    try {
      console.log(localDevices);
      if (localDevices?.length > 0) {
        const existe = localDevices.filter(
          (devices) => devices.ID === handleDeviceID
        );
        if (existe.length > 0) {
          alert("Dispositivo já adicionado");
        } else {
          await incluirDispositivo();
          console.log("depois de incluir");
          console.log(localDevices);
          await AsyncStorage.setItem(
            "listaDispositivos",
            JSON.stringify(localDevices)
          );
          alert("adicionado");
          handleShowAlert();
        }
      } else {
        await incluirDispositivo();
        await AsyncStorage.removeItem("listaDispositivos");
        await AsyncStorage.setItem(
          "listaDispositivos",
          JSON.stringify(localDevices)
        );
        alert("primeiro adicionado");
        await handleShowAlert();
      }
    } catch (error) {}
  };
  return (
    <Container>
      <Container>
        {showModal && (
          <AddDispositivo
            header={`Deseja adicionar o dispositivo ${handleDeviceNAME} - ${handleDeviceID} ?`}
            handleShowAlert={handleShowAlert}
            adicionarDispositivo={adicionarDispositivo}
          />
        )}
        {dispositivos?.map((device) => {
           if (device.name.includes("SFTK_BT")) {
          return (
            <DispositivosEscaneados
              handleShowAlert={handleShowAlert}
              key={device.id}
              name={device.name}
              device={device.id}
            />
          );
          }
        })}
        <View
          style={{
            flex: 1,
            position: "absolute",
            zIndex: 999,
            bottom: 0,
            width: "100%",
          }}>
          {scanning && <ActivityIndicator size="large" color="#1c73d2" />}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            {(dispositivos?.length > 0 && !scanning) && (
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
        </View>
      </Container>
    </Container>
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
