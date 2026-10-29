/**
 * @file Avisos de disponibilidade sem conexão, atualização e instalação do aplicativo web.
 * O armazenamento em cache dos arquivos é independente das partidas salvas no IndexedDB.
 */
import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../../../components/ui'
import estilos from './EstadoDoJogoWeb.module.css'

/** Evento específico de navegadores que oferecem instalação; o pedido exige uma ação do usuário. */
type SolicitacaoDeInstalacao = Event & {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Exibe ações do aplicativo web somente quando o componente pai permite atualizar a tela. */
export default function EstadoDoJogoWeb({ podeAtualizar }: { podeAtualizar: boolean }) {
  const [instalarSolicitacao, definirInstalarSolicitacao] = useState<SolicitacaoDeInstalacao | null>(null)
  const [erro, definirErro] = useState<string | null>(null)
  const [atualizando, definirAtualizando] = useState(false)
  const { offlineReady: [ausentePronto], needRefresh: [precisaAtualizarExibicao], updateServiceWorker } = useRegisterSW({
    onRegisterError: () => definirErro("O modo sem conexão ainda não está disponível. Você pode continuar jogando com conexão."),
  })

  useEffect(() => {
    const oferecerInstalar = (evento: Event) => {
      // Adia a oferta automática de instalação para o botão do próprio jogo.
      evento.preventDefault()
      definirInstalarSolicitacao(evento as SolicitacaoDeInstalacao)
    }
    const instalado = () => definirInstalarSolicitacao(null)
    window.addEventListener('beforeinstallprompt', oferecerInstalar)
    window.addEventListener('appinstalled', instalado)
    return () => {
      // Remove os mesmos ouvintes ao desmontar, inclusive nas verificações do StrictMode.
      window.removeEventListener('beforeinstallprompt', oferecerInstalar)
      window.removeEventListener('appinstalled', instalado)
    }
  }, [])

  // A autorização do pai evita oferecer uma recarga no meio de um fluxo sensível.
  if (!podeAtualizar || (!ausentePronto && !precisaAtualizarExibicao && !instalarSolicitacao && !erro)) return null

  return <div className={estilos.status}>
    <p role="status">{erro ?? (precisaAtualizarExibicao ? 'Uma nova versão de Greywake está disponível.' : ausentePronto ? "Pronto para jogar sem conexão neste dispositivo." : 'Greywake pode ser instalado neste dispositivo.')}</p>
    {precisaAtualizarExibicao ? <Button variant="secondary" disabled={atualizando} onClick={async () => {
      definirAtualizando(true)
      try { await updateServiceWorker(true) }
      catch { definirErro('Não foi possível atualizar agora. Tente novamente com conexão.'); definirAtualizando(false) }
    }}>{atualizando ? 'Atualizando…' : 'Atualizar jogo'}</Button> : null}
    {instalarSolicitacao ? <Button variant="secondary" onClick={async () => {
      try { await instalarSolicitacao.prompt() }
      catch { definirErro('Use o menu do navegador para instalar Greywake.') }
      finally { definirInstalarSolicitacao(null) }
    }}>Instalar Greywake</Button> : null}
  </div>
}
