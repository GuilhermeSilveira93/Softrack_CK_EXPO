import React from 'react';
import {View, StyleSheet, Button} from 'react-native';
type DispositivosProps = {
  device : string
  name : string
  handleShowAlert : (device:string,name:string) => any
}
const DispositivosEscaneados = ({device, name, handleShowAlert}:DispositivosProps) => {
  return (
    <View key={device} style={{display: 'flex'}}>
      <View style={styles.maquinas}>
        <Button
          title={`${name} - ${device}`}
          onPress={() => {
            handleShowAlert(device, name);
          }}/>

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

export default DispositivosEscaneados;
