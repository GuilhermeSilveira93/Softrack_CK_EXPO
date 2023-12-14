import {
  solicitarConexao,
  enviar,
  validaResposta,
} from '@/libs/envioAutomatico'
import { useCallback } from 'react'

export const useEnviosLeituras = () => {
  const enviosLeituras = useCallback(
    async (address: string) => {
      setStatus('Conectando...')
      const conexao = await solicitarConexao(address)
      if (conexao === 'OK') {
        console.log('conexão OK')
        await enviar(address, '524D', tipo)
        const resposta = await validaResposta(address)
        if (resposta === 'apagado') {
          console.log('apagado')
          await envioArquivo(address)
        } else {
          console.log(devices.name + ' Erro ao limpar o modulo')
          atualizaContagemDeEnvio(false)
          setTentativasConexoes((prev) => prev + 1)
          setEnviando(false)
        }
      } else {
        console.log(devices.name + ' Erro de autenticação com o Módulo')
        atualizaContagemDeEnvio(false)
        setTentativasConexoes((prev) => prev + 1)
        setEnviando(false)
      }
    },
    [atualizaContagemDeEnvio, devices.name, envioArquivo],
  )
  return {
    enviosLeituras,
  }
}
