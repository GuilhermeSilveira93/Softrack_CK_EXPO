import { useState, useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { carregarArquivo, deleteFile } from "../../hooks/arquivoCK";
import { Banner, Avatar } from "react-native-paper";
export default function LocalFile() {
  const [filename, setFileName] = useState("");
  useEffect(() => {
    const localFile = async () => {
      const file: string = await AsyncStorage.getItem("FileName").then(
        (res) => {
          if (res) {
            return res;
          }
          return "";
        }
      );
      setFileName(file);
    };
    localFile();
  }, [filename]);
  return (
    <>
      <Banner
        visible={filename?.length > 0}
        actions={[
          {
            label: "Remover arquivo",
            onPress: async () => {
              await deleteFile().then((res: any) => setFileName(res));
            },
          },
        ]}
        icon={() => (
          <Avatar.Icon
            size={50}
            style={{ backgroundColor: "blue" }}
            icon="file"
          />
        )}>
        Arquivo {filename} na memória
      </Banner>
      <View style={styles.centeredView}>
        <Pressable onPress={
          async () => {
            await carregarArquivo()
            .then((res:any) => setFileName(res))
            }}>
          <Avatar.Icon
            size={80}
            style={{ backgroundColor: "blue" }}
            icon="folder"
          />
        </Pressable>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    width: "100%",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 22,
  },
  textBlack: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  textWhite: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
