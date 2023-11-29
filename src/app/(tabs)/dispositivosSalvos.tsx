import { Stack, useFocusEffect } from "expo-router";import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { LocalDevices } from "@/types/localDevices";
import { fetchDevices, deleteDevice } from "@/hooks/dispositivos";
import { DeletarDispositivo } from "@/components/DeletarDispositivo";
import { Link } from "expo-router";
import { Container } from "@/components/ui/Container";
export const DispositivosSalvos = () => {
  const [localDevices, setLocalDevices] = useState<LocalDevices[]>();
  const [handleDeviceID, setHandleDeviceID] = useState("");
  const [handleDeviceName, setHandleDeviceName] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  useFocusEffect(useCallback(() => {
      fetchDevices().then((res) => {
        console.log(res)
        setLocalDevices(res);
        console.log(localDevices)
      });
    }, [fetchDevices])
  );
  const handleShowModal = () => {
    setShowModalDelete(!showModalDelete);
  };
  if (!localDevices || localDevices?.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "Dispositivos Salvos" }} />
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
      <Stack.Screen options={{ title: "Dispositivos Locais" }} />
      {showModalDelete && (
        <DeletarDispositivo
          deleteDevice={deleteDevice}
          handleShowModal={handleShowModal}
          ID={handleDeviceID}
          name={handleDeviceName}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        fadingEdgeLength={1}>
        <View style={styles.centeredView}>
          {localDevices?.length > 0 && (
            <Text style={styles.textBlack}>Dispositivos salvos</Text>
          )}
          {localDevices?.map((devices) => {
            if (devices.envio) {
              return (
                <Container key={devices.ID}>
                  <Text>{`${devices.name} - ${devices.ID}`}</Text>
                  {/*                   <Button
                    title=
                    onPress={() => {
                      setHandleDeviceID(devices.ID);
                      setHandleDeviceName(devices.name);
                      handleShowModal();
                    }}
                  /> */}
                </Container>
              );
            }
            return (
              <View key={devices.ID} style={styles.maquinas}>
                {/*                 <Button
                  title={`${devices.name} - ${devices.ID}`}
                  onPress={() => {
                    setHandleDeviceID(devices.ID);
                    setHandleDeviceName(devices.name);
                    handleShowModal();
                  }}
                /> */}
              </View>
            );
          })}
          <Text>
            ----------------------------------------------------------------------------
          </Text>
          <Link href={"/(Escaneamento)"} asChild>
            <Button
              icon="magnify-scan"
              mode="contained"
              style={{ backgroundColor: "#1c73d2" }}>
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
