import { useState, useEffect } from "react";import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import DispositivosEscaneados from "../../components/DispositivosEscaneados";
import AdiconarDispositivo from "../../components/AdicionarDispositivo";
import {
  adicionarDispositivosLocais,
  fetchDevices,
} from "../../hooks/dispositivos";
import { LocalDevices } from "@/types/localDevices";
type DispositivosEscaneadosProps = {
  name: string;
  address: string;
  id: string;
  bonded?: Boolean;
  deviceClass?: string;
  rssi: Number;
  extra: Map<string, Object>;
};
export const EscanearDispositivos = () => {
  const [dispositivosLocais, setDispositivosLocais] = useState<LocalDevices[]>(
    []
  );
  const [dispositivosEscaneados, setDispositivosEscaneados] =
    useState<DispositivosEscaneadosProps[]>();
  const [scanning, setScanning] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [handleDeviceID, setHandleDeviceID] = useState<string>("");
  const [handleDeviceNAME, setHandleDeviceNAME] = useState<string>("");
  useEffect(() => {
    fetchDevices().then((res) => {
      setDispositivosLocais(res);
    });
  }, []);
  const startScan = async () => {
    try {
      setScanning(true);
      console.log("Iniciando escaneamento...");
      const dispositivos = await RNBluetoothClassic.startDiscovery();
      setDispositivosEscaneados(dispositivos);
    } catch (error) {
    } finally {
      setScanning(false);
    }
  };
  const adicionarDispositivo = async () => {
    if (dispositivosLocais?.length > 0) {
      const existe = dispositivosLocais.filter(
        (devices) => devices.ID === handleDeviceID
      );
      if (existe.length > 0) {
        alert("Dispositivo já adicionado");
      } else {
        setDispositivosLocais((prevState) => [
          ...prevState,
          {
            ID: handleDeviceID,
            name: handleDeviceNAME,
            envio: false,
          },
        ]);
      }
    } else {
      setDispositivosLocais([
        { ID: handleDeviceID, name: handleDeviceNAME, envio: false },
      ]);
    }
    adicionarDispositivosLocais(dispositivosLocais);
    setShowModal(false)
  };
  const handleShowAlert = async (device: string, name: string) => {
    setShowModal(!showModal);
    setHandleDeviceID(device);
    setHandleDeviceNAME(name);
  };
  return (
    <View style={styles.container}>
      {dispositivosEscaneados?.length === 0 && (
        <Text>Não foram encontrados Dispositivos</Text>
      )}
      {showModal && (
        <AdiconarDispositivo
          text={`Deseja adicionar o dispositivo ${handleDeviceNAME} - ${handleDeviceID} ?`}
          handleShowAlert={handleShowAlert}
          adicionarDispositivo={adicionarDispositivo}
        />
      )}
      <ScrollView>
        {dispositivosEscaneados?.map((device) => {
          if (device.name.includes("SFTK_BT")) {
          return (
            <DispositivosEscaneados
              handleShowAlert={handleShowAlert}
              name={device.name}
              device={device.id}
              key={device.id}
            />
          );
          }
        })}
      </ScrollView>
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
          {dispositivosEscaneados && (
            <Pressable
              disabled={scanning}
              onPress={() => {
                setDispositivosEscaneados([]);
              }}
              style={styles.botao}>
              <Text style={styles.textWhite}>Limpar Lista</Text>
            </Pressable>
          )}
          {!scanning && (
            <Pressable
              onPress={startScan}
              style={styles.botao}
              disabled={scanning}>
              <Text style={styles.textWhite}>
                {`${
                  dispositivosEscaneados?.length === 0
                    ? "Escanear"
                    : "Escanear Novamente"
                }`}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
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
