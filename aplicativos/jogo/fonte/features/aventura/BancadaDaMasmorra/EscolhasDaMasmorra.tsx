import { useId, useState } from 'react'
import { Button } from '@/components/ui'
import { selectAction, selectCell } from '@/terceiros/hexaBattle/selecaoDeAlvos'
import estilos from './BancadaDaMasmorra.module.css'

export interface EscolhaDaMasmorra {
  id: string
  titulo: string
  detalhe: string
  bloqueio?: string
}

export default function EscolhasDaMasmorra({ titulo, escolhas, ocupado, aoConfirmar }: {
  titulo: string
  escolhas: readonly EscolhaDaMasmorra[]
  ocupado: boolean
  aoConfirmar: (id: string) => Promise<void>
}) {
  const rotulo = useId()
  const [selecionada, definirSelecionada] = useState<string | null>(null)
  const escolha = escolhas.find(item => item.id === selecionada && !item.bloqueio)
  const acao = selectAction({
    targets: () => escolhas.filter(item => !item.bloqueio).map(item => item.id),
    execute: aoConfirmar,
  })

  return <section className={estilos.caminhos} aria-labelledby={rotulo}>
    <h3 id={rotulo}>{titulo}</h3>
    <div className={`${estilos.caminhos} ${escolhas.length > 1 ? estilos.caminhosRamo : ''}`}>
      {escolhas.map(item => <Button
        key={item.id}
        variant="route"
        aria-pressed={escolha?.id === item.id}
        disabled={ocupado || Boolean(item.bloqueio)}
        onClick={() => definirSelecionada(item.id)}
      >
        <strong>{item.titulo}</strong>
        <small>{item.bloqueio ?? item.detalhe}</small>
      </Button>)}
    </div>
    <p className="atenuado" role="status">
      {escolha ? `Selecionado: ${escolha.titulo}` : 'Selecione uma opção para continuar.'}
    </p>
    <div className="botao-linhaDeDados">
      <Button
        variant="primary"
        disabled={!escolha || ocupado}
        onClick={() => { if (escolha && !ocupado) void selectCell(acao, escolha.id) }}
      >
        Confirmar escolha
      </Button>
      {escolha && <Button variant="secondary" disabled={ocupado} onClick={() => definirSelecionada(null)}>
        Limpar seleção
      </Button>}
    </div>
  </section>
}
