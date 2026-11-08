import { useMemo, useState } from 'react'
import type { RepositorioDePartidasLocais } from '@paralaxe/interface'
import Aplicativo from '@/Aplicativo'
import { criarPreferenciaDeAcesso, CHAVE_DO_USUARIO_LEMBRADO } from '@/services/acessoLocal'
import TelaDeAcesso from './TelaDeAcesso/TelaDeAcesso'

/** Portão de conveniência local. Não autoriza dados e não cria contas online. */
export default function EntradaDoJogo({ repositorioDePartidas }: { repositorioDePartidas: RepositorioDePartidasLocais }) {
  const preferencia = useMemo(() => criarPreferenciaDeAcesso({
    ler: () => window.localStorage.getItem(CHAVE_DO_USUARIO_LEMBRADO),
    gravar: valor => window.localStorage.setItem(CHAVE_DO_USUARIO_LEMBRADO, valor),
    remover: () => window.localStorage.removeItem(CHAVE_DO_USUARIO_LEMBRADO),
  }), [])
  const [identificador, definirIdentificador] = useState<string | null>(null)
  const [aviso, definirAviso] = useState<string | null>(null)
  if (identificador !== null) return <>
    {aviso ? <p role="status" className="emLinha-mensagem">{aviso}</p> : null}
    <Aplicativo repositorioDePartidas={repositorioDePartidas} aoSairDoAcesso={() => { definirIdentificador(null); definirAviso(null) }} />
  </>
  return <TelaDeAcesso preferencias={preferencia.ler()} aoEsquecerUsuario={preferencia.esquecer}
    aoEntrarLocalmente={(nome, lembrar) => {
      if (!preferencia.salvar(nome, lembrar)) definirAviso('Seu navegador não permitiu salvar a preferência. Você pode continuar jogando normalmente.')
      definirIdentificador(nome)
    }} />
}
