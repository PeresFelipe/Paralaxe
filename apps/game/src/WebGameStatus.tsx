import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

type InstallPrompt = Event & {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function WebGameStatus({ canUpdate }: { canUpdate: boolean }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const { offlineReady: [offlineReady], needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisterError: () => setError('O modo offline ainda não está disponível. Você pode continuar jogando com conexão.'),
  })

  useEffect(() => {
    const offerInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPrompt)
    }
    const installed = () => setInstallPrompt(null)
    window.addEventListener('beforeinstallprompt', offerInstall)
    window.addEventListener('appinstalled', installed)
    return () => {
      window.removeEventListener('beforeinstallprompt', offerInstall)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  if (!canUpdate || (!offlineReady && !needRefresh && !installPrompt && !error)) return null

  return <div className="web-game-status">
    <p role="status">{error ?? (needRefresh ? 'Uma nova versão de Greywake está disponível.' : offlineReady ? 'Pronto para jogar offline neste dispositivo.' : 'Greywake pode ser instalado neste dispositivo.')}</p>
    {needRefresh ? <button className="ghost-button" type="button" disabled={updating} onClick={async () => {
      setUpdating(true)
      try { await updateServiceWorker(true) }
      catch { setError('Não foi possível atualizar agora. Tente novamente com conexão.'); setUpdating(false) }
    }}>{updating ? 'Atualizando…' : 'Atualizar jogo'}</button> : null}
    {installPrompt ? <button className="ghost-button" type="button" onClick={async () => {
      try { await installPrompt.prompt() }
      catch { setError('Use o menu do navegador para instalar Greywake.') }
      finally { setInstallPrompt(null) }
    }}>Instalar Greywake</button> : null}
  </div>
}
