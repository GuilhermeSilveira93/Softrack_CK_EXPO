import React from 'react'
import { LocalDevicesProps } from './localDevicesProps'
export type envioArquivoProps = {
  strings: string[]
  setStatus: React.Dispatch<React.SetStateAction<string>>
  devices: LocalDevicesProps
  setTentativasConexoes: React.Dispatch<React.SetStateAction<number>>
  setProgressBar: React.Dispatch<React.SetStateAction<number>>
  atualizaContagemDeEnvio: (valor: boolean) => void
  tentativasConexoes: number
  setEnviarNovamente: React.Dispatch<React.SetStateAction<boolean>>
  setEnviando: React.Dispatch<React.SetStateAction<boolean>>
  attFilaDeEnvio: (
    ID: string,
    name: string,
    nomeArquivo: string,
    retirar: boolean,
  ) => void
}
