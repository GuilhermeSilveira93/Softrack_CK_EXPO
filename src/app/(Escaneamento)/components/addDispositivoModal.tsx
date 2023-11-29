import React from 'react';
import {Modal, StyleSheet, Text, Pressable, View} from 'react-native';
export type AddDispositivoProps = {
  handleShowAlert: ()=>{}
  header:string
  adicionarDispositivo: () => {}
}
const AddDispositivo = ({handleShowAlert, header, adicionarDispositivo}:AddDispositivoProps) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          handleShowAlert();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{header}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                adicionarDispositivo();
              }}>
              <Text style={styles.textStyle}>ADICIONAR NA LISTA</Text>
            </Pressable>
            <Pressable style={styles.fechar} onPress={() => handleShowAlert()}>
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    width: '100%',
    top: '35%',
    alignItems: 'center',
    marginTop: 22,
  },
  fechar: {
    width: 'auto',
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingTop: 55,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '130%',
    borderRadius: 50,
    marginTop: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddDispositivo;
