import { useState } from 'react'
import { getEquipmentDefinition } from '@greywake/content'
import { BUILD_01_INVENTORY_SLOT_LIMIT, getInventorySlotUsage, type OfflineGameSave } from '@greywake/domain'
import GameIcon from './GameIcon'
import { getEquipmentIcon, getItemIcon } from './assetIcons'
import { itemLabels } from './gameLabels'

type Filter = 'all' | 'material' | 'consumable' | 'equipment'

export default function InventoryBoard({ save, compact = false, onEquip }: {
  save: OfflineGameSave
  compact?: boolean
  onEquip?: (id: string) => Promise<void>
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const equipped = new Set(Object.values(save.character.equipment))
  const items = [
    ...save.character.inventory.map((stack) => ({
      id: stack.definitionId, name: itemLabels[stack.definitionId] ?? stack.definitionId,
      quantity: stack.quantity, icon: getItemIcon(stack.definitionId),
      kind: stack.definitionId.startsWith('material.') ? 'material' : 'consumable',
      detail: stack.definitionId.startsWith('material.') ? 'Recurso para suas atividades e receitas.' : 'Item carregado na bolsa do personagem.',
    })),
    ...save.character.equipmentItems.filter((item) => !equipped.has(item.instanceId)).map((item) => {
      const definition = getEquipmentDefinition(item.definitionId)
      return { id: item.instanceId, name: `${definition?.name ?? item.definitionId} +${item.upgradeLevel}`,
        quantity: 1, icon: getEquipmentIcon(item.definitionId), kind: 'equipment', detail: 'Equipamento disponível para usar.' }
    }),
  ]
  const shown = items.filter((item) => filter === 'all' || item.kind === filter)
  const visible = compact ? shown.slice(0, 8) : shown
  const selectedItem = items.find((item) => item.id === selected)
  const empty = filter === 'all' ? Math.max(0, (compact ? 8 : BUILD_01_INVENTORY_SLOT_LIMIT) - visible.length) : 0

  async function equip(id: string) {
    if (!onEquip || pending) return
    setPending(true)
    setError(null)
    try { await onEquip(id); setSelected(null) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível equipar o item.') }
    finally { setPending(false) }
  }

  return <div className={`inventory-board ${compact ? 'inventory-board--compact' : ''}`}>
    <div className="inventory-caption"><span>{compact ? 'Na bolsa' : 'Bolsa do viajante'}</span><strong>{getInventorySlotUsage(save)} / {BUILD_01_INVENTORY_SLOT_LIMIT}</strong></div>
    {!compact ? <div className="inventory-filters" aria-label="Filtrar inventário">
      {([['all', 'Tudo'], ['material', 'Materiais'], ['consumable', 'Outros itens'], ['equipment', 'Equipamentos']] as const).map(([id, label]) =>
        <button key={id} type="button" aria-pressed={filter === id} onClick={() => { setFilter(id); setSelected(null) }}>{label}</button>)}
    </div> : null}
    <div className="inventory-slots" aria-label="Itens carregados">
      {visible.map((item) => <button key={item.id} className={`inventory-slot ${selected === item.id ? 'inventory-slot--selected' : ''}`}
        type="button" aria-label={`${item.name}, quantidade ${item.quantity}`} aria-pressed={selected === item.id}
        title={`${item.name} ×${item.quantity}`} onClick={() => { setSelected(item.id); setError(null) }}>
        <GameIcon icon={item.icon} size={32} /><span className="slot-quantity">{item.quantity}</span>
      </button>)}
      {Array.from({ length: empty }, (_, index) => <span className="inventory-slot inventory-slot--empty" key={`empty-${index}`} aria-hidden="true" />)}
    </div>
    {!shown.length && filter !== 'all' ? <p className="muted">Nenhum item nesta categoria.</p> : null}
    {selectedItem ? <div className="inventory-inspection" aria-live="polite">
      <strong>{selectedItem.name}</strong><p>{selectedItem.detail} Quantidade: {selectedItem.quantity}.</p>
      {selectedItem.kind === 'equipment' && onEquip ? <button className="primary-button compact" disabled={pending} type="button" onClick={() => void equip(selectedItem.id)}>{pending ? 'Equipando…' : 'Equipar'}</button> : null}
    </div> : !compact ? <p className="inventory-hint">Selecione um item para inspecionar. Equipamentos em uso ficam na aba Equipamento.</p> : null}
    {compact && items.length > 8 ? <p className="muted">+{items.length - 8} itens na bolsa completa</p> : null}
    {error ? <p role="alert" className="fact-warning">{error}</p> : null}
  </div>
}
