import React, { useEffect, useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { dispositivosPareados } from "@/hooks/dispositivos";
import { List } from "react-native-paper";
import { Container } from "../ui/Container";
import AsyncStorage from "@react-native-async-storage/async-storage";
type DispositivosProps = {
  ID: string;
  name: string;
  dispositivosSalvos: {
    ID: string;
    name: string;
  }[];
  setaBloqueio?: () => void;
  bloqueio?: boolean;
  attLocalDevices: (
    novosDispositivos: DispositivosProps["dispositivosSalvos"]
  ) => {};
};
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  attLocalDevices,
  setaBloqueio,
  bloqueio,
}: DispositivosProps) => {
  const [pareado, setPareado] = useState<boolean>(false);
  const [adicionando, setAdicionando] = useState<boolean>(false);
  const [pareando, setPareando] = useState<boolean>(false);
  const existe = dispositivosSalvos.filter((item) => item.ID === ID);

  useEffect(() => {
    dispositivosPareados(ID).then((res) => setPareado(res));
  });

  const parear = async () => {
    if (setaBloqueio) {
      setaBloqueio()  
    }
    setPareando(true);
    await RNBluetoothClassic.pairDevice(ID)
      .then(async (res) => {
        if (res.bonded) {
          setPareado(true);
          setPareando(false);
        } else {
          alert(
            "Só é possivel adicionar na lista, se o dispositivo estiver pareado."
          );
          setPareando(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setPareando(false);
    });
    setPareando(false);
    if (setaBloqueio) {
      setaBloqueio()  
    }
  };
  const addDispositivoNaLista = async () => {
    setAdicionando(true);
    if (existe.length > 0) {
      const resto = dispositivosSalvos?.filter((item) => item.ID !== ID);
      await AsyncStorage.removeItem("listaDispositivos");
      await AsyncStorage.setItem("listaDispositivos", JSON.stringify(resto));
      setAdicionando(false);
      attLocalDevices(resto);
    } else {
      let dispositivosNovos = [{ ID, name }];
      if (dispositivosSalvos) {
        dispositivosNovos = [...dispositivosSalvos, ...dispositivosNovos];
      }
      await AsyncStorage.setItem(
        "listaDispositivos",
        JSON.stringify(dispositivosNovos)
      );
      setAdicionando(false);
      attLocalDevices(dispositivosNovos);
    }
  };
  return (
    <Container key={ID}>
      <List.Item
        style={{
          backgroundColor: "rgba(0,170,255,0.2)",
          borderRadius: 10,
        }}
        titleStyle={{ fontWeight: "700" }}
        title={`${name}`}
        description={`${ID}`}
        left={() => (
          <Pressable
          disabled={bloqueio}
            onPress={
              !pareado
                ? () => {
                    parear();
                  }
                : () => {}
            }>
            {pareando ? (
              <ActivityIndicator size="large" color="#1c73d2" />
            ) : (
              <MaterialCommunityIcons
                name={!pareado ? "bluetooth-off" : "bluetooth-connect"}
                size={34}
                color={!pareado ? "#aaa" : "#1c73d2"}
              />
            )}
          </Pressable>
        )}
        right={() => (
          <Pressable onPress={() => addDispositivoNaLista()}>
            {adicionando ? (
              <ActivityIndicator size="large" color="#1c73d2" />
            ) : (
              <AntDesign
                name={existe.length > 0 ? "checkcircle" : "checkcircleo"}
                color="rgb(0,150,255)"
                size={32}
              />
            )}
          </Pressable>
        )}
      />
    </Container>
  );
};
export default Dispositivos;
