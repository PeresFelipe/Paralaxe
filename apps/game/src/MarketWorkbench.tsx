import { useEffect, useMemo, useState } from 'react'
import { INITIAL_NPC_MARKET_LISTINGS } from '@greywake/content'
import { buyNpcMarketListing, type OfflineGameSave } from '@greywake/domain'
import { createIndexedDbSaveRepository } from '@greywake/persistence'

const saveRepository = createIndexedDbSaveRepository()

export default function MarketWorkbench() {
  const [saves, setSaves] = useState<OfflineGameSave[]>([])
  const [selectedSaveId, setSelectedSaveId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const selectedSave = useMemo(
    () => saves.find((save) => save.saveId === selectedSaveId) ?? null,
    [saves, selectedSaveId],
  )

  useEffect(() => {
    void saveRepository.list().then((stored) => {
      setSaves(stored)
      setSelectedSaveId((current) => current || stored[0]?.saveId || '')
    })
  }, [])

  async function buy(listingId: string) {
    if (!selectedSave || busy) return
    const listing = INITIAL_NPC_MARKET_LISTINGS.find((item) => item.id === listingId)
    if (!listing) return

    setBusy(true)
    try {
      const latest = await saveRepository.get(selectedSave.saveId)
      if (!latest) throw new Error('Save não encontrado.')
      const updated = buyNpcMarketListing(latest, listing, new Date().toISOString())
      await saveRepository.put(updated)
      setSaves((current) => current.map((save) => (save.saveId === updated.saveId ? updated : save)))
      setMessage(`${listing.name} comprado por ${listing.price} moedas.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir a compra.')
    } finally {
      setBusy(false)
    }
  }

  if (saves.length === 0) return null

  return (
    <section className="combat-workbench" aria-labelledby="market-title">
      <div className="combat-workbench__header">
        <div>
          <p className="section-kicker">M6 · Cidade Livre</p>
          <h2 id="market-title">Mercado NPC</h2>
          <p className="muted">Itens básicos com preço fixo · compra local persistente</p>
        </div>

        <label className="combat-save-select">
          <span>Personagem</span>
          <select value={selectedSaveId} disabled={busy} onChange={(event) => { setSelectedSaveId(event.target.value); setMessage(null) }}>
            {saves.map((save) => (
              <option key={save.saveId} value={save.saveId}>
                {save.character.name} · {save.character.gold} moedas
              </option>
            ))}
          </select>
        </label>
      </div>

      {message ? <p className="inline-message">{message}</p> : null}

      {selectedSave ? (
        <div className="choice-grid">
          {INITIAL_NPC_MARKET_LISTINGS.map((listing) => (
            <article className="panel" key={listing.id}>
              <p className="section-kicker">Mercado</p>
              <h3>{listing.name}</h3>
              <p className="muted">
                {listing.product.kind === 'equipment'
                  ? `Equipamento · ${listing.product.slot}`
                  : `${listing.product.quantity} unidade(s)`}
              </p>
              <div className="combat-stat-row"><span>Preço</span><strong>{listing.price} moedas</strong></div>
              <button
                className="primary-button compact"
                type="button"
                disabled={busy || selectedSave.character.gold < listing.price}
                onClick={() => void buy(listing.id)}
              >
                Comprar
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
