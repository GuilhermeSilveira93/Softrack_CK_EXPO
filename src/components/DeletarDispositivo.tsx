import React from 'react';
import {Modal, StyleSheet, Text, Pressable, View} from 'react-native';
type DeletarDispositivoProps = {
  handleShowModal : () => any
  deleteDevice : (handleDeviceID:string) => {}
  ID : string
  name : string
}
export const DeletarDispositivo = ({handleShowModal, deleteDevice, ID, name}:DeletarDispositivoProps) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          handleShowModal();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{`${name} - ${ID}`}</Text>
            <Pressable style={styles.button} onPress={() => deleteDevice(ID)}>
              <Text style={styles.textStyle}>DELETAR DISPOSITIVO</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleShowModal()}>
              <Text style={styles.textStyle}>FECHAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '70%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingTop: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '130%',
    borderRadius: 25,
    marginTop: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
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

export default DeletarDispositivo;