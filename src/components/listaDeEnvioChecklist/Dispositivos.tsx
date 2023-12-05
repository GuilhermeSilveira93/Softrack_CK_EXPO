import React, { useEffect, useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { dispositivosPareados } from "@/hooks/dispositivos";
import { List } from "react-native-paper";
import { Container } from "../ui/Container";
type DispositivosProps = {
  ID: string;
  name: string;
  existe:boolean
  dispositivosSalvos: {
    ID: string;
    name: string;
  }[];
  listaDeEnvio: (ID: string, name: string) => {};
};
const Dispositivos = ({
  ID,
  name,
  dispositivosSalvos,
  listaDeEnvio,
  existe
}: DispositivosProps) => {
  const [pareado, setPareado] = useState<boolean>(false);
  const [adicionando, setAdicionando] = useState<boolean>(false);
  const [pareando, setPareando] = useState<boolean>(false);

  useEffect(() => {
    dispositivosPareados(ID).then((res) => setPareado(res));
  });

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
          <MaterialCommunityIcons
            name={"bluetooth-connect"}
            size={34}
            color={"#1c73d2"}
          />
        )}
        right={() => (
          <Pressable onPress={() => listaDeEnvio(ID, name)}>
              <AntDesign
                name={existe ? "checkcircle" : "checkcircleo"}
                color="rgb(0,150,255)"
                size={32}
              />
          </Pressable>
        )}
      />
    </Container>
  );
};
export default Dispositivos;
