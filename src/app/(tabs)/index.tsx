import { useState, useCallback, Suspense } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { fetchNomeArquivo, fetchArquivo } from "@/libs/localDataBase/st_checklist";
import { carregarArquivo, deleteFile } from "@/libs/arquivoCK";
import { Banner, Avatar } from "react-native-paper";
import { useFocusEffect } from "expo-router";
export default function LocalFile() {
  const [nomeArquivo, setNomeArquivo] = useState<string>("");
  const [linhas, setLinhas] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        fetchNomeArquivo().then((res: string) => setNomeArquivo(res)),
        fetchArquivo().then((res) => setLinhas(res)),
      ]);
    }, [nomeArquivo, linhas])
  );
  return (
    <>
      <Suspense fallback={<ActivityIndicator size="large" color="#1c73d2" />}>
        <Banner
          visible={nomeArquivo?.length > 0}
          actions={[
            {
              label: "Remover arquivo",
              onPress: async () => {
                await deleteFile().then((res) => setNomeArquivo(res));
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
          Arquivo {nomeArquivo} na memória
        </Banner>
      </Suspense>
      <View style={styles.centeredView}>
        <Pressable
          onPress={async () => {
            await carregarArquivo().then((res: string) => setNomeArquivo(res));
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
