import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
type DispositivoProps = {
  device: string
  name: string
  handleShowAlert: (device:string,name:string) => {}
}
const Dispositivo = ({device, name, handleShowAlert}:DispositivoProps) => {
  return (
    <View key={device} style={{display: 'flex'}}>
      <View style={styles.maquinas}>
        <Icon.Button
          name="bluetooth"
          size={20}
          style={{width: 'auto', minWidth: 300}}
          onPress={() => {
            handleShowAlert(device, name);
          }}>
          <Text style={styles.textWhite}>
            {name} - {device}
          </Text>
        </Icon.Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  maquinas: {
    alignItems: 'center',
    marginBottom: 10,
  },
  textWhite: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Dispositivo;
