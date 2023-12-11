import React from "react";
import { Pressable, } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { List } from "react-native-paper";
import { Container } from "@/components/ui/Container";
type DispositivosProps = {
  ID: string;
  name: string;
  existe:boolean
  dispositivosSalvos: {
    ID: string;
    name: string;
  }[];
  listaDeEnvio: (ID: string, name: string) => {};
  nomeArquivo:string
};
const Dispositivos = ({
  ID,
  name,
  listaDeEnvio,
  existe,
}: DispositivosProps) => {
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
