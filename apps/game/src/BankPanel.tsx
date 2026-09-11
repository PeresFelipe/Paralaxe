import { getEquipmentDefinition } from '@greywake/content'
import {
  BUILD_01_BANK_SLOT_LIMIT,
  BUILD_01_INVENTORY_SLOT_LIMIT,
  getBankSlotUsage,
  getInventorySlotUsage,
  type OfflineGameSave,
} from '@greywake/domain'
import GameIcon from './GameIcon'
import { getEquipmentIcon, getItemIcon } from './assetIcons'

type BankPanelProps = {
  save: OfflineGameSave
  onDepositStack: (definitionId: string, quantity: number) => Promise<void>
  onWithdrawStack: (definitionId: string, quantity: number) => Promise<void>
  onDepositEquipment: (instanceId: string) => Promise<void>
  onWithdrawEquipment: (instanceId: string) => Promise<void>
  onBack: () => void
}

const itemLabels: Record<string, string> = {
  'material.cloch': 'Cloch',
  'material.giuis': 'Giúis',
  'material.scadan': 'Scadán',
  'material.neantog': 'Neantóg',
  'material.treated-cloch': 'Cloch Tratada',
  'item.food.roasted-scadan': 'Scadán Assado',
  'item.consumable.neantog-preparation': 'Preparado de Neantóg',
  'item.consumable.field-preparation': 'Preparado de Campo',
  'item.consumable.crimson-flask': 'Frasco Carmesim',
  'item.key.rusted': 'Chave Enferrujada',
  'item.quest.nameless-stone': 'Pedra Sem Nome',
  'item.equipment.traveller-ring': 'Anel do Viajante',
  'item.garrison-supply-register': 'Registro de Suprimentos',
  'item.treaty-fragment': 'Fragmento do Tratado',
  'item.fairtheoir-fragment': 'Fragmento de Fairtheoir',
}

function itemName(definitionId: string) {
  return itemLabels[definitionId] ?? definitionId
}

export default function BankPanel({
  save,
  onDepositStack,
  onWithdrawStack,
  onDepositEquipment,
  onWithdrawEquipment,
  onBack,
}: BankPanelProps) {
  const equippedIds = new Set(Object.values(save.character.equipment))
  const unequippedEquipment = save.character.equipmentItems.filter(
    (item) => !equippedIds.has(item.instanceId),
  )
  const inventoryUsage = getInventorySlotUsage(save)
  const bankUsage = getBankSlotUsage(save)

  return (
    <section className="feature-view">
      <div className="view-heading">
        <div>
          <p className="section-kicker">Cidade · Banco</p>
          <h1 className="display-title">Banco</h1>
          <p className="muted">Armazenamento seguro na Cidade Livre. Depósitos e retiradas não têm custo.</p>
        </div>
        <button className="ghost-button" type="button" onClick={onBack}>Voltar à Cidade</button>
      </div>

      <div className="bank-capacity-grid">
        <article className="panel">
          <span className="section-kicker">Inventário</span>
          <strong>{inventoryUsage} / {BUILD_01_INVENTORY_SLOT_LIMIT} slots</strong>
        </article>
        <article className="panel">
          <span className="section-kicker">Banco</span>
          <strong>{bankUsage} / {BUILD_01_BANK_SLOT_LIMIT} slots</strong>
        </article>
      </div>

      <div className="bank-columns section-gap">
        <article className="panel dense-panel">
          <div className="panel-heading"><div><p className="section-kicker">Inventário</p><h2>Levar para o Banco</h2></div></div>
          <div className="sheet-list">
            {save.character.inventory.map((stack) => (
              <div className="bank-row" key={stack.definitionId}>
                <div><span className="bank-item-label"><GameIcon icon={getItemIcon(stack.definitionId)} size={24} /><strong>{itemName(stack.definitionId)}</strong></span><small>×{stack.quantity}</small></div>
                <div className="button-row">
                  <button className="ghost-button compact" type="button" onClick={() => void onDepositStack(stack.definitionId, 1)}>Depositar 1</button>
                  {stack.quantity > 1 ? <button className="ghost-button compact" type="button" onClick={() => void onDepositStack(stack.definitionId, stack.quantity)}>Tudo</button> : null}
                </div>
              </div>
            ))}
            {unequippedEquipment.map((instance) => {
              const definition = getEquipmentDefinition(instance.definitionId)
              return (
                <div className="bank-row" key={instance.instanceId}>
                  <div><span className="bank-item-label"><GameIcon icon={getEquipmentIcon(instance.definitionId)} size={24} /><strong>{definition?.name ?? instance.definitionId}</strong></span><small>Equipamento · +{instance.upgradeLevel}</small></div>
                  <button className="ghost-button compact" type="button" onClick={() => void onDepositEquipment(instance.instanceId)}>Depositar</button>
                </div>
              )
            })}
            {save.character.inventory.length === 0 && unequippedEquipment.length === 0 ? <p className="muted">Nada disponível para depósito.</p> : null}
          </div>
        </article>

        <article className="panel dense-panel">
          <div className="panel-heading"><div><p className="section-kicker">Banco</p><h2>Retirar</h2></div></div>
          <div className="sheet-list">
            {save.character.bank.inventory.map((stack) => (
              <div className="bank-row" key={stack.definitionId}>
                <div><span className="bank-item-label"><GameIcon icon={getItemIcon(stack.definitionId)} size={24} /><strong>{itemName(stack.definitionId)}</strong></span><small>×{stack.quantity}</small></div>
                <div className="button-row">
                  <button className="ghost-button compact" type="button" onClick={() => void onWithdrawStack(stack.definitionId, 1)}>Retirar 1</button>
                  {stack.quantity > 1 ? <button className="ghost-button compact" type="button" onClick={() => void onWithdrawStack(stack.definitionId, stack.quantity)}>Tudo</button> : null}
                </div>
              </div>
            ))}
            {save.character.bank.equipmentItems.map((instance) => {
              const definition = getEquipmentDefinition(instance.definitionId)
              return (
                <div className="bank-row" key={instance.instanceId}>
                  <div><span className="bank-item-label"><GameIcon icon={getEquipmentIcon(instance.definitionId)} size={24} /><strong>{definition?.name ?? instance.definitionId}</strong></span><small>Equipamento · +{instance.upgradeLevel}</small></div>
                  <button className="ghost-button compact" type="button" onClick={() => void onWithdrawEquipment(instance.instanceId)}>Retirar</button>
                </div>
              )
            })}
            {save.character.bank.inventory.length === 0 && save.character.bank.equipmentItems.length === 0 ? <p className="muted">O Banco está vazio.</p> : null}
          </div>
        </article>
      </div>
    </section>
  )
}
