// useEnvioAutomatico.js
import { useState, useCallback, useEffect } from 'react'
import { FetchListaDeEnvio } from '@/libs/dispositivos'
import { fetchArquivo } from '@/libs/localDataBase/st_checklist'

export const useEnvioAutomatico = () => {
  const [strings, setStrings] = useState<string[]>([])
  const [contagemDeEnvio, setContagemDeEnvio] = useState<number>(0)
  const [listaDeEnvio, setListaDeEnvio] = useState<
    {
      ID: string
      name: string
      nomeArquivo: string
    }[]
  >([])
  const [filaDeEnvio, setFilaDeEnvio] = useState<
    {
      ID: string
      name: string
      nomeArquivo: string
    }[]
  >([])

  useEffect(
    useCallback(() => {
      Promise.all([
        FetchListaDeEnvio().then((res) => {
          setListaDeEnvio(res)
        }),
        fetchArquivo().then((res) => setStrings(res)),
      ])
    }, []),
    [],
  )

  const attFilaDeEnvio = (
    ID: string,
    name: string,
    nomeArquivo: string,
    retirar: boolean,
  ) => {
    if (!retirar) {
      let existe = false
      if (filaDeEnvio.length > 0) {
        filaDeEnvio.forEach((item) => {
          existe = item.ID === ID || existe
        })
      }
      const fila = [{ ID, name, nomeArquivo }]
      if (!existe) {
        setFilaDeEnvio((prev) => [...prev, ...fila])
      }
    } else {
      setFilaDeEnvio((prev) => prev.filter((item) => item.ID !== ID))
    }
  }

  const atualizaContagemDeEnvio = (valor: boolean) => {
    if (valor) {
      setContagemDeEnvio((prev) => prev + 1)
    } else {
      setContagemDeEnvio((prev) => prev - 1)
    }
  }

  return {
    strings,
    contagemDeEnvio,
    refreshing,
    atualizarTudo,
    listaDeEnvio,
    filaDeEnvio,
    attFilaDeEnvio,
    atualizaContagemDeEnvio,
  }
}
