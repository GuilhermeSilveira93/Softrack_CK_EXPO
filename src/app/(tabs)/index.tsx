import { useState, useCallback, Suspense } from "react";import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { carregarArquivo, deleteFile } from "../../hooks/arquivoCK";
import { Banner, Avatar } from "react-native-paper";
import { fetchArquivo } from "../../hooks/arquivoCK";
import { useFocusEffect } from "expo-router";
export default function LocalFile() {
  const [filename, setFileName] = useState<string>("");
  useFocusEffect(
    useCallback(() => {
      fetchArquivo().then((res: string) => setFileName(res));
    }, [filename])
  );
  return (
    <>
      <Suspense fallback={<ActivityIndicator size="large" color="#1c73d2" />}>
        <Banner
          visible={filename?.length > 0}
          actions={[
            {
              label: "Remover arquivo",
              onPress: async () => {
                await deleteFile().then((res) => setFileName(res));
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
      </Suspense>
      <View style={styles.centeredView}>
        <Pressable
          onPress={async () => {
            await carregarArquivo().then((res: any) => setFileName(res));
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
