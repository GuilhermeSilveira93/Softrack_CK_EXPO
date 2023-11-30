import React from "react";
import { Pressable } from "react-native";
import { List, Icon } from "react-native-paper";
import { Container } from "./ui/Container";
import AsyncStorage from "@react-native-async-storage/async-storage";
type DispositivosProps = {
  device: string;
  name: string;
  dispositivosSalvos: {
    ID: string;
    name: string;
  }[];
  attLocalDevices: (novosDispositivos: DispositivosProps['dispositivosSalvos']) => {}
};
const DispositivosEscaneados = ({
  device,
  name,
  dispositivosSalvos,
  attLocalDevices,
}: DispositivosProps) => {
  const existe = dispositivosSalvos.filter(item => item.ID === device)
  const favorito = async () => {
    if (existe.length > 0) {
      const resto = dispositivosSalvos?.filter((item) => item.ID !== device);
      await AsyncStorage.removeItem("listaDispositivos");
      await AsyncStorage.setItem("listaDispositivos", JSON.stringify(resto));
      attLocalDevices(resto);
    } else {
      let dispositivosNovos = [{ ID: device, name }];
      if (dispositivosSalvos) {
        dispositivosNovos = [...dispositivosSalvos, ...dispositivosNovos];
      }
      await AsyncStorage.setItem(
        "listaDispositivos",
        JSON.stringify(dispositivosNovos)
      );
      attLocalDevices(dispositivosNovos);
    }
  };
  return (
    <Container key={device}>
      <List.Item
        style={{ backgroundColor: "rgba(0,170,255,0.5)" }}
        titleStyle={{ color: "#fff" }}
        title={`${name}`}
        descriptionStyle={{ color: "#fff" }}
        description={`${device}`}
        left={(props) => <List.Icon color="#fff" icon="bluetooth" />}
        right={({ color, style }) => (
          <Pressable onPress={() => favorito()}>
            <Icon 
              size={32}
              color="rgb(255,255,0)"
              source={existe.length > 0 ? "star" : "star-outline"}
            />
          </Pressable>
        )}
      />
    </Container>
  );
};
export default DispositivosEscaneados;
