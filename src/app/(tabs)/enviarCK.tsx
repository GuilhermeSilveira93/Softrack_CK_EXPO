import { View, Text } from "react-native";
//index é a rota principal dentro das tabs
export const enviarCK = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 44, fontWeight: "700" }}>Enviar CK</Text>
  </View>
  );
};
export default enviarCK;
