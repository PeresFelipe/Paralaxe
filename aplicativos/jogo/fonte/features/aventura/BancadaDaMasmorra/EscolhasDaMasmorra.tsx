import { useId, useState } from 'react'
import { Button } from '@/components/ui'
import { selectAction, selectCell } from '@/terceiros/hexaBattle/selecaoDeAlvos'
import estilos from './BancadaDaMasmorra.module.css'

export interface EscolhaDaMasmorra {
  id: string
  titulo: string
  detalhe: string
  bloqueio?: string
  confirmar?: string
}

export default function EscolhasDaMasmorra({ titulo, escolhas, ocupado, aoConfirmar }: {
  titulo: string
  escolhas: readonly EscolhaDaMasmorra[]
  ocupado: boolean
  aoConfirmar: (id: string) => Promise<void>
}) {
  const rotulo = useId()
  const [erro, definirErro] = useState(false)
  const [selecionada, definirSelecionada] = useState<string | null>(null)
  const escolha = escolhas.find(item => item.id === selecionada && !item.bloqueio)
  const acao = selectAction({
    targets: () => escolhas.filter(item => !item.bloqueio).map(item => item.id),
    execute: aoConfirmar,
  })

  async function confirmar() {
    if (!escolha || ocupado) return
    definirErro(false)
    try {
      await selectCell(acao, escolha.id)
    } catch {
      definirErro(true)
    }
  }

  return <section className={estilos.caminhos} aria-labelledby={rotulo}>
    <h3 id={rotulo}>{titulo}</h3>
    <div className={`${estilos.opcoes} ${escolhas.length > 1 ? estilos.caminhosRamo : ''}`}>
      {escolhas.map(item => <Button
        key={item.id}
        variant="route"
        aria-pressed={escolha?.id === item.id}
        disabled={ocupado || Boolean(item.bloqueio)}
        onClick={() => { definirErro(false); definirSelecionada(item.id) }}
      >
        <strong>{item.titulo}</strong>
        {escolha?.id === item.id && <small aria-hidden="true">Selecionada</small>}
        <small>{item.bloqueio ?? item.detalhe}</small>
      </Button>)}
    </div>
    <p className="atenuado" role="status">
      {ocupado ? 'Salvando escolha…' : escolha ? `Selecionado: ${escolha.titulo}` : 'Selecione uma opção para continuar.'}
    </p>
    <div className="botao-linhaDeDados">
      <Button
        variant="primary"
        disabled={!escolha || ocupado}
        onClick={() => void confirmar()}
      >
        {escolha?.confirmar ?? 'Confirmar escolha'}
      </Button>
      <Button variant="secondary" disabled={ocupado || !escolha} onClick={() => { definirErro(false); definirSelecionada(null) }}>
        Limpar seleção
      </Button>
    </div>
    {erro && <p role="alert">A escolha não foi salva. Tente novamente.</p>}
  </section>
}
