import { useState } from 'react'
import { obterDefinicaoDeEquipamento } from '@greywake/conteudo'
import { LIMITE_DE_ESPACOS_DO_INVENTARIO_V01, obterUsoDeEspacosDoInventario, type PartidaLocal } from '@greywake/dominio'
import IconeDoJogo from './IconeDoJogo'
import { obterIconeDoEquipamento, obterIconeDoItem } from './iconesDosRecursos'
import { rotulosDosItens } from './rotulosDoJogo'

type Filtro = "todos" | 'material' | "consumivel" | "equipamento"

export default function GradeDoInventario({ partida, compacto = false, aoEquipar }: {
  partida: PartidaLocal
  compacto?: boolean
  aoEquipar?: (id: string) => Promise<void>
}) {
  const [filtro, definirFiltro] = useState<Filtro>("todos")
  const [selecionado, definirSelecionado] = useState<string | null>(null)
  const [pendente, definirPendente] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const equipado = new Set(Object.values(partida.personagem.equipamento))
  const itens = [
    ...partida.personagem.inventario.map((pilha) => ({
      id: pilha.idDaDefinicao, nome: rotulosDosItens[pilha.idDaDefinicao] ?? pilha.idDaDefinicao,
      quantidade: pilha.quantidade, icone: obterIconeDoItem(pilha.idDaDefinicao),
      tipo: pilha.idDaDefinicao.startsWith('material.') ? 'material' : "consumivel",
      detalhe: pilha.idDaDefinicao.startsWith('material.') ? 'Recurso para suas atividades e receitas.' : 'Item carregado na bolsa do personagem.',
    })),
    ...partida.personagem.itensDeEquipamento.filter((item) => !equipado.has(item.idDaInstancia)).map((item) => {
      const definicao = obterDefinicaoDeEquipamento(item.idDaDefinicao)
      return { id: item.idDaInstancia, nome: `${definicao?.nome ?? item.idDaDefinicao} +${item.nivelDeReforco}`,
        quantidade: 1, icone: obterIconeDoEquipamento(item.idDaDefinicao), tipo: "equipamento", detalhe: 'Equipamento disponível para usar.' }
    }),
  ]
  const exibido = itens.filter((item) => filtro === "todos" || item.tipo === filtro)
  const visivel = compacto ? exibido.slice(0, 8) : exibido
  const selecionadoItem = itens.find((item) => item.id === selecionado)
  const vazio = filtro === "todos" ? Math.max(0, (compacto ? 8 : LIMITE_DE_ESPACOS_DO_INVENTARIO_V01) - visivel.length) : 0

  async function equipar(id: string) {
    if (!aoEquipar || pendente) return
    definirPendente(true)
    definirErro(null)
    try { await aoEquipar(id); definirSelecionado(null) }
    catch (motivo) { definirErro(motivo instanceof Error ? motivo.message : 'Não foi possível equipar o item.') }
    finally { definirPendente(false) }
  }

  return <div className={`inventario-grade ${compacto ? "inventario-grade--compacto" : ''}`}>
    <div className="inventario-legenda"><span>{compacto ? 'Na bolsa' : 'Bolsa do viajante'}</span><strong>{obterUsoDeEspacosDoInventario(partida)} / {LIMITE_DE_ESPACOS_DO_INVENTARIO_V01}</strong></div>
    {!compacto ? <div className="inventario-filtros" aria-label="Filtrar inventário">
      {([["todos", 'Tudo'], ['material', 'Materiais'], ["consumivel", 'Outros itens'], ["equipamento", 'Equipamentos']] as const).map(([id, rotulo]) =>
        <button key={id} type="button" aria-pressed={filtro === id} onClick={() => { definirFiltro(id); definirSelecionado(null) }}>{rotulo}</button>)}
    </div> : null}
    <div className="inventario-espacos" aria-label="Itens carregados">
      {visivel.map((item) => <button key={item.id} className={`inventario-espaco ${selecionado === item.id ? "inventario-espaco--selecionado" : ''}`}
        type="button" aria-label={`${item.nome}, quantidade ${item.quantidade}`} aria-pressed={selecionado === item.id}
        title={`${item.nome} ×${item.quantidade}`} onClick={() => { definirSelecionado(item.id); definirErro(null) }}>
        <IconeDoJogo icone={item.icone} tamanho={32} /><span className="espaco-quantidade">{item.quantidade}</span>
      </button>)}
      {Array.from({ length: vazio }, (_, indice) => <span className="inventario-espaco inventario-espaco--vazio" key={`vazio-${indice}`} aria-hidden="true" />)}
    </div>
    {!exibido.length && filtro !== "todos" ? <p className="atenuado">Nenhum item nesta categoria.</p> : null}
    {selecionadoItem ? <div className="inventario-inspecao" aria-live="polite">
      <strong>{selecionadoItem.nome}</strong><p>{selecionadoItem.detalhe} Quantidade: {selecionadoItem.quantidade}.</p>
      {selecionadoItem.tipo === "equipamento" && aoEquipar ? <button className="principal-botao compacto" disabled={pendente} type="button" onClick={() => void equipar(selecionadoItem.id)}>{pendente ? 'Equipando…' : 'Equipar'}</button> : null}
    </div> : !compacto ? <p className="inventario-dica">Selecione um item para inspecionar. Equipamentos em uso ficam na aba Equipamento.</p> : null}
    {compacto && itens.length > 8 ? <p className="atenuado">+{itens.length - 8} itens na bolsa completa</p> : null}
    {erro ? <p role="alert" className="informacao-alerta">{erro}</p> : null}
  </div>
}
