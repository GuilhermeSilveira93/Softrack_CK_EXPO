import { useFocusEffect } from 'expo-router';
import React, { useState, useEffect } from "react";import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { LocalDevices } from "@/types/localDevices";
import { fetchDevices, deleteDevice } from "../../hooks/dispositivos";
import { DeletarDispositivo } from "../../components/DeletarDispositivo";
import { Link, router } from "expo-router";
export const DispositivosSalvos = () => {
  const [localDevices, setLocalDevices] = useState<LocalDevices[]>();
  const [handleDeviceID, setHandleDeviceID] = useState("");
  const [handleDeviceName, setHandleDeviceName] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  useFocusEffect(() => {
    fetchDevices().then((res) => {
      setLocalDevices(res);
    });
  });
  const handleShowModal = () => {
    setShowModalDelete(!showModalDelete);
  };
  if (!localDevices || localDevices?.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>Não existem dispositivos adicionados.</Text>
        <Link href={"/EscanearDispositivos"} asChild><Text>Voltar</Text></Link>
        <Link href={{pathname:'/EscanearDispositivos'}} asChild>
          <Button title="Escanear Dispositivos"/>
        </Link>
      </View>
    );
  }
  return (
    <>
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
                <ScrollView key={devices.ID} style={styles.maquinas}>
                  <Button
                    title={`${devices.name} - ${devices.ID}`}
                    onPress={() => {
                      setHandleDeviceID(devices.ID);
                      setHandleDeviceName(devices.name)
                      handleShowModal();
                    }}
                  />
                </ScrollView>
              );
            }
            return (
              <View key={devices.ID} style={styles.maquinas}>
                <Button
                  title={`${devices.name} - ${devices.ID}`}
                  onPress={() => {
                    setHandleDeviceID(devices.ID);
                    setHandleDeviceName(devices.name)
                    handleShowModal();
                  }}
                />
              </View>
            );
          })}
          <Text>
            ----------------------------------------------------------------------------
          </Text>
          <Link href={{pathname:'/EscanearDispositivos'}} asChild>
          <Button title="escanear"/>
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
