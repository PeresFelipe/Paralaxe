import { CONTENT_VERSION } from '@greywake/content'
import { BUILD_PHASE, BUILD_SAVE_MODE } from '@greywake/domain'
import { LOCAL_PERSISTENCE_TARGET } from '@greywake/persistence'
import { UI_DIRECTION } from '@greywake/ui'

const foundations = [
  {
    label: 'Domínio',
    value: BUILD_PHASE,
    detail: 'Regras isoladas da interface e da persistência.',
  },
  {
    label: 'Conteúdo',
    value: CONTENT_VERSION,
    detail: 'Catálogo orientado a dados e IDs estáveis.',
  },
  {
    label: 'Persistência',
    value: LOCAL_PERSISTENCE_TARGET,
    detail: 'Save local; implementação real entra no M1.',
  },
  {
    label: 'Interface',
    value: UI_DIRECTION,
    detail: 'Web-first, 2D, UI-heavy e responsiva.',
  },
] as const

function App() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="project-title">
        <p className="eyebrow">Build 0.1 · Fase 1 · {BUILD_SAVE_MODE}</p>
        <h1 id="project-title">Greywake</h1>
        <p className="subtitle">
          Fundação local carregada. O primeiro marco técnico já conecta app,
          domínio, conteúdo, persistência e UI sem qualquer dependência de
          servidor.
        </p>

        <div className="status-row" aria-label="Status da fundação">
          <span className="status-dot" aria-hidden="true" />
          <span>M0 — projeto abre</span>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Camadas da arquitetura">
        {foundations.map((foundation) => (
          <article className="foundation-card" key={foundation.label}>
            <span className="card-label">{foundation.label}</span>
            <strong>{foundation.value}</strong>
            <p>{foundation.detail}</p>
          </article>
        ))}
      </section>

      <footer className="footer-note">
        <span>Próximo marco</span>
        <strong>M1 — criar e carregar personagem</strong>
      </footer>
    </main>
  )
}

export default App
