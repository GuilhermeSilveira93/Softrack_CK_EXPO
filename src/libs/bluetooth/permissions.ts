import { PermissionsAndroid } from 'react-native';
export const requestAccessFineLocationPermission = async () => {
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Localização necessaria para Bluetooth',
      message:
        'Para executar o aplicativo, a localização é necessaria ',
      buttonNeutral: 'Lembrar depois',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK'
    }
  )
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    {
      title: 'BLUETOOTH_CONNECT necessario',
      message:
        'Para executar o aplicativo, permita o uso do BLUETOOTH_CONNECT ',
      buttonNeutral: 'Lembrar depois',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK'
    }
  )
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    {
      title: 'BLUETOOTH_SCAN necessario',
      message:
        'Para executar o aplicativo, permita o uso do BLUETOOTH_SCAN ',
      buttonNeutral: 'Lembrar depois',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK'
    }
  )
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    {
      title: 'BLUETOOTH_ADVERTISE necessario',
      message:
        'Para executar o aplicativo, permita o uso do BLUETOOTH_ADVERTISE ',
      buttonNeutral: 'Lembrar depois',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK'
    }
  )
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'Permição para ler arquivo do celular',
      message:
        'Para ler e atualizar o checklist',
      buttonNeutral: 'Lembrar depois',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK'
    }
  )
}