import { LocalDevicesProps } from './localDevicesProps'

export type enviosLeiturasProps = {
  devices: LocalDevicesProps
  setStatus: React.Dispatch<React.SetStateAction<string>>
  envioArquivo: (address: string) => void
  atualizaContagemDeEnvio: (valor: boolean) => void
  setTentativasConexoes: React.Dispatch<React.SetStateAction<number>>
  setEnviando: React.Dispatch<React.SetStateAction<boolean>>
}
