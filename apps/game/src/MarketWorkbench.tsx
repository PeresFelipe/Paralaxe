import { useState } from 'react'
import { INITIAL_NPC_MARKET_LISTINGS } from '@greywake/content'
import { buyNpcMarketListing, type OfflineGameSave } from '@greywake/domain'

type MarketViewProps = {
  save: OfflineGameSave
  onSaveChange: (save: OfflineGameSave, message?: string) => void | Promise<void>
}

export default function MarketWorkbench({ save, onSaveChange }: MarketViewProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function buy(listingId: string) {
    if (busy) return
    const listing = INITIAL_NPC_MARKET_LISTINGS.find((item) => item.id === listingId)
    if (!listing) return

    setBusy(true)
    try {
      const updated = buyNpcMarketListing(save, listing, new Date().toISOString())
      const text = `${listing.name} comprado por ${listing.price} moedas.`
      await onSaveChange(updated, text)
      setMessage(text)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir a compra.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="feature-view market-view" aria-labelledby="market-title">
      <div className="context-art context-art--compact" aria-hidden="true">
        <span>ARTE 16:9 · MERCADO</span>
      </div>

      <div className="view-heading">
        <div>
          <p className="section-kicker">Cidade · Mercado</p>
          <h2 id="market-title" className="display-title">Comprar</h2>
          <p className="muted">Preços e consequências aparecem antes da compra.</p>
        </div>
        <div className="currency-chip" aria-label={`${save.character.gold} moedas`}>
          <span aria-hidden="true">◇</span>
          <strong>{save.character.gold}</strong>
          <small>moedas</small>
        </div>
      </div>

      {message ? <p className="inline-message" role="status">{message}</p> : null}

      <div className="market-grid">
        {INITIAL_NPC_MARKET_LISTINGS.map((listing) => {
          const canAfford = save.character.gold >= listing.price
          return (
            <article className="item-card" key={listing.id}>
              <div className="item-thumb" aria-hidden="true">{listing.name.slice(0, 1)}</div>
              <div className="item-card__body">
                <p className="section-kicker">Mercado</p>
                <h3>{listing.name}</h3>
                <p className="muted">
                  {listing.product.kind === 'equipment'
                    ? `Equipamento · ${listing.product.slot}`
                    : `${listing.product.quantity} unidade(s)`}
                </p>
                <div className="fact-row"><span>Preço</span><strong>{listing.price} moedas</strong></div>
                {!canAfford ? <p className="fact-warning">Faltam {listing.price - save.character.gold} moedas.</p> : null}
                <button
                  className="primary-button compact"
                  type="button"
                  disabled={busy || !canAfford}
                  onClick={() => void buy(listing.id)}
                >
                  Comprar
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
