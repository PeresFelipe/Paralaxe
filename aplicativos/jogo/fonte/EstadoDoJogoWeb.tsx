import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

type SolicitacaoDeInstalacao = Event & {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function EstadoDoJogoWeb({ podeAtualizar }: { podeAtualizar: boolean }) {
  const [instalarSolicitacao, definirInstalarSolicitacao] = useState<SolicitacaoDeInstalacao | null>(null)
  const [erro, definirErro] = useState<string | null>(null)
  const [atualizando, definirAtualizando] = useState(false)
  const { offlineReady: [ausentePronto], needRefresh: [precisaAtualizarExibicao], updateServiceWorker } = useRegisterSW({
    onRegisterError: () => definirErro("O modo sem conexão ainda não está disponível. Você pode continuar jogando com conexão."),
  })

  useEffect(() => {
    const oferecerInstalar = (evento: Event) => {
      evento.preventDefault()
      definirInstalarSolicitacao(evento as SolicitacaoDeInstalacao)
    }
    const instalado = () => definirInstalarSolicitacao(null)
    window.addEventListener('beforeinstallprompt', oferecerInstalar)
    window.addEventListener('appinstalled', instalado)
    return () => {
      window.removeEventListener('beforeinstallprompt', oferecerInstalar)
      window.removeEventListener('appinstalled', instalado)
    }
  }, [])

  if (!podeAtualizar || (!ausentePronto && !precisaAtualizarExibicao && !instalarSolicitacao && !erro)) return null

  return <div className="web-jogo-situacao">
    <p role="status">{erro ?? (precisaAtualizarExibicao ? 'Uma nova versão de Greywake está disponível.' : ausentePronto ? "Pronto para jogar sem conexão neste dispositivo." : 'Greywake pode ser instalado neste dispositivo.')}</p>
    {precisaAtualizarExibicao ? <button className="discreto-botao" type="button" disabled={atualizando} onClick={async () => {
      definirAtualizando(true)
      try { await updateServiceWorker(true) }
      catch { definirErro('Não foi possível atualizar agora. Tente novamente com conexão.'); definirAtualizando(false) }
    }}>{atualizando ? 'Atualizando…' : 'Atualizar jogo'}</button> : null}
    {instalarSolicitacao ? <button className="discreto-botao" type="button" onClick={async () => {
      try { await instalarSolicitacao.prompt() }
      catch { definirErro('Use o menu do navegador para instalar Greywake.') }
      finally { definirInstalarSolicitacao(null) }
    }}>Instalar Greywake</button> : null}
  </div>
}
