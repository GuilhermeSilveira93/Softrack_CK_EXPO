import React, { useEffect, useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { dispositivosPareados } from "@/hooks/dispositivos";
import { List } from "react-native-paper";
import { Container } from "./ui/Container";
import AsyncStorage from "@react-native-async-storage/async-storage";
type DispositivosProps = {
  ID: string;
  name: string;
  dispositivosSalvos: {
    ID: string;
    name: string;
  }[];
  attLocalDevices: (
    novosDispositivos: DispositivosProps["dispositivosSalvos"]
  ) => {};
};
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  attLocalDevices,
}: DispositivosProps) => {
  const [pareado, setPareado] = useState<boolean>(false);
  const [adicionando, setAdicionando] = useState<boolean>(false);
  const existe = dispositivosSalvos.filter((item) => item.ID === ID);
  useEffect(() => {
    dispositivosPareados(ID).then((res) => setPareado(res));
  });

  const validaPareado = async () => {
    setAdicionando(true)
    if (!pareado) {
      await RNBluetoothClassic.pairDevice(ID)
        .then(async (res) => {
          if (res.bonded) {
            await addDispositivoNaLista();
          } else {
            console.log("não emparelhado");
            setAdicionando(false)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await addDispositivoNaLista();
    }
  };
  const addDispositivoNaLista = async () => {
    if (existe.length > 0) {
      const resto = dispositivosSalvos?.filter((item) => item.ID !== ID);
      await AsyncStorage.removeItem("listaDispositivos");
      await AsyncStorage.setItem("listaDispositivos", JSON.stringify(resto));
      setPareado(true);
      setAdicionando(false)
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
      setPareado(true);
      setAdicionando(false)
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
        //     descriptionStyle={{ color: "#fff" }}
        titleStyle={{ fontWeight: "700" }}
        title={`${name}`}
        description={`${ID}`}
        left={() => <List.Icon icon="bluetooth" />}
        right={() => (
          <Pressable onPress={() => validaPareado()}>
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
