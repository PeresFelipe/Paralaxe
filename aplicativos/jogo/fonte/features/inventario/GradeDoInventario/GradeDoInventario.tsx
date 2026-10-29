/**
 * @file Grade reutilizada pela bolsa completa e pelos resumos compactos.
 * Converte pilhas e equipamentos guardados em entradas visuais, oferece filtros e
 * inspeção, e encaminha o comando de equipar quando esse callback estiver disponível.
 */
import { useState } from 'react'
import { obterDefinicaoDeEquipamento } from '@greywake/conteudo'
import { LIMITE_DE_ESPACOS_DO_INVENTARIO_V01, obterUsoDeEspacosDoInventario, type PartidaLocal } from '@greywake/dominio'
import { IconeDoJogo } from '@/components/jogo'
import { obterIconeDoEquipamento, obterIconeDoItem } from '@/iconesDosRecursos'
import { rotulosDosItens } from '@/rotulosDoJogo'
import { Button } from '@/components/ui'
import { mensagensDeErroDaInterface } from '@/rotulosDaInterface'
import estilos from './GradeDoInventario.module.css'

type Filtro = "todos" | 'material' | "consumivel" | "equipamento"

/** Apresenta até oito entradas no modo compacto e todos os espaços da mochila no modo completo. */
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
  // Pilhas usam o ID da definição; equipamentos usam o ID da instância para distinguir cópias com a mesma aparência.
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
  // Espaços vazios completam somente a visão de todos os itens; filtros não devem parecer aumentar a capacidade disponível.
  const vazio = filtro === "todos" ? Math.max(0, (compacto ? 8 : LIMITE_DE_ESPACOS_DO_INVENTARIO_V01) - visivel.length) : 0

  /** Espera a alteração persistida antes de fechar a inspeção e preserva uma mensagem local em caso de falha. */
  async function equipar(id: string) {
    if (!aoEquipar || pendente) return
    definirPendente(true)
    definirErro(null)
    try { await aoEquipar(id); definirSelecionado(null) }
    catch (motivo) { definirErro(motivo instanceof Error ? motivo.message : mensagensDeErroDaInterface.equiparItem) }
    finally { definirPendente(false) }
  }

  return <div className={`${estilos.grid} ${compacto ? estilos.compact : ''}`}>
    <div className={estilos.legend}><span>{compacto ? 'Na bolsa' : 'Bolsa do viajante'}</span><strong>{obterUsoDeEspacosDoInventario(partida)} / {LIMITE_DE_ESPACOS_DO_INVENTARIO_V01}</strong></div>
    {!compacto ? <div className={estilos.filters} aria-label="Filtrar inventário">
      {([["todos", 'Tudo'], ['material', 'Materiais'], ["consumivel", 'Outros itens'], ["equipamento", 'Equipamentos']] as const).map(([id, rotulo]) =>
        <Button key={id} variant="filter" aria-pressed={filtro === id} onClick={() => { definirFiltro(id); definirSelecionado(null) }}>{rotulo}</Button>)}
    </div> : null}
    <div className={estilos.spaces} aria-label="Itens carregados">
      {visivel.map((item) => <Button key={item.id} variant="inventory" icon={<IconeDoJogo icone={item.icone} tamanho={32} />}
        aria-label={`${item.nome}, quantidade ${item.quantidade}`} aria-pressed={selecionado === item.id}
        title={`${item.nome} ×${item.quantidade}`} data-compact={compacto ? 'true' : 'false'} onClick={() => { definirSelecionado(item.id); definirErro(null) }}>
        <span>{item.quantidade}</span>
      </Button>)}
      {Array.from({ length: vazio }, (_, indice) => <span className={estilos.emptySlot} key={`vazio-${indice}`} aria-hidden="true" />)}
    </div>
    {!exibido.length && filtro !== "todos" ? <p className="atenuado">Nenhum item nesta categoria.</p> : null}
    {selecionadoItem ? <div className={estilos.inspection} aria-live="polite">
      <strong>{selecionadoItem.nome}</strong><p>{selecionadoItem.detalhe} Quantidade: {selecionadoItem.quantidade}.</p>
      {selecionadoItem.tipo === "equipamento" && aoEquipar ? <Button variant="primary" size="sm" disabled={pendente} loading={pendente} onClick={() => void equipar(selecionadoItem.id)}>{pendente ? 'Equipando…' : 'Equipar'}</Button> : null}
    </div> : !compacto ? <p className={estilos.hint}>Selecione um item para inspecionar. Equipamentos em uso ficam na aba Equipamento.</p> : null}
    {compacto && itens.length > 8 ? <p className="atenuado">+{itens.length - 8} itens na bolsa completa</p> : null}
    {erro ? <p role="alert" className="informacao-alerta">{erro}</p> : null}
  </div>
}
