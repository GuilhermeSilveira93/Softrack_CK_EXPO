import { fetchDevices } from '../../hooks/dispositivos';
import {useState,useEffect} from 'react'
import { View, Text } from "react-native";
//index é a rota principal dentro das tabs
export const DispositivosSalvos = () => {
  const [localDevices, setLocalDevices] = useState([]);
  const [handleDevice, setHandleDevice] = useState('');
  const [showModalDelete, setShowModalDelete] = useState(false);
  useEffect(()=>{
    fetchDevices()
    .then(res => {setLocalDevices(res)})
  })
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 44, fontWeight: "700" }}>ScanBluetooth</Text>
    </View>
  );
};
export default DispositivosSalvos;
