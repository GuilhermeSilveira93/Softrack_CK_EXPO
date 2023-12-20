export type DispositivoEnvProps = {
  devices: {
    name: string
    ID: string
    nomeArquivo: string
  }
  strings: string[]
  contagemDeEnvio: number
  atualizaContagemDeEnvio: (valor: boolean) => void
  attFilaDeEnvio: (
    ID: string,
    name: string,
    nomeArquivo: string,
    retirar: boolean,
  ) => void
  filaDeEnvio: DispositivoEnvProps['devices'][]
  index?: number
  tourKey?: string
}
