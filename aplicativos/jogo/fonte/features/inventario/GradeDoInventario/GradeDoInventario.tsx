/**
 * @file Grade reutilizada pela bolsa completa e pelos resumos compactos.
 * Converte pilhas e equipamentos guardados em entradas visuais, oferece filtros e
 * inspeção, e encaminha o comando de equipar quando esse callback estiver disponível.
 */
import { useRef, useState } from 'react'
import { obterDefinicaoDeEquipamento } from '@paralaxe/conteudo'
import { obterLimiteDeEspacosDoInventario, obterUsoDeEspacosDoInventario, obterValorPrincipalDoEquipamento, type PartidaLocal } from '@paralaxe/dominio'
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
  const legendaRef = useRef<HTMLDivElement>(null)
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
  const peca = selecionadoItem?.tipo === 'equipamento'
    ? partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === selecionado)
    : undefined
  const definicao = peca && obterDefinicaoDeEquipamento(peca.idDaDefinicao)
  const pecaEmUso = definicao && partida.personagem.itensDeEquipamento.find(
    (item) => item.idDaInstancia === partida.personagem.equipamento[definicao.espaco],
  )
  const definicaoEmUso = pecaEmUso && obterDefinicaoDeEquipamento(pecaEmUso.idDaDefinicao)
  const valor = peca && definicao ? obterValorPrincipalDoEquipamento(definicao, peca.nivelDeReforco) : null
  const valorEmUso = pecaEmUso && definicaoEmUso && definicaoEmUso.estatisticaPrincipal?.tipo === definicao?.estatisticaPrincipal?.tipo
    ? obterValorPrincipalDoEquipamento(definicaoEmUso, pecaEmUso.nivelDeReforco)
    : null
  const atributo = definicao?.estatisticaPrincipal?.tipo === 'ataque' ? 'Poder' : 'Defesa'
  // Espaços vazios completam somente a visão de todos os itens; filtros não devem parecer aumentar a capacidade disponível.
  const vazio = filtro === "todos" ? Math.max(0, (compacto ? 8 : 0) - visivel.length) : 0

  /** Espera a alteração persistida antes de fechar a inspeção e preserva uma mensagem local em caso de falha. */
  async function equipar(id: string) {
    if (!aoEquipar || pendente) return
    definirPendente(true)
    definirErro(null)
    try {
      await aoEquipar(id)
      definirSelecionado(null)
      legendaRef.current?.focus()
    }
    catch (motivo) { definirErro(motivo instanceof Error ? motivo.message : mensagensDeErroDaInterface.equiparItem) }
    finally { definirPendente(false) }
  }

  return <div className={`${estilos.grid} ${compacto ? estilos.compact : ''}`}>
    <div className={estilos.legend} ref={legendaRef} tabIndex={-1}><span>{compacto ? 'Na bolsa' : 'Bolsa do viajante'}</span><strong>{obterUsoDeEspacosDoInventario(partida)} / {obterLimiteDeEspacosDoInventario(partida)} espaços</strong></div>
    {!compacto ? <div className={estilos.filters} aria-label="Filtrar inventário">
      {([["todos", 'Tudo'], ['material', 'Materiais'], ["consumivel", 'Outros itens'], ["equipamento", 'Equipamentos']] as const).map(([id, rotulo]) =>
        <Button key={id} variant="filter" aria-pressed={filtro === id} onClick={() => { definirFiltro(id); definirSelecionado(null) }}>{rotulo}</Button>)}
    </div> : null}
    <div className={compacto ? estilos.spaces : estilos.namedSpaces} aria-label="Itens carregados">
      {visivel.map((item) => <Button key={item.id} variant={compacto ? "inventory" : selecionado === item.id ? "primary" : "secondary"} icon={<IconeDoJogo icone={item.icone} tamanho={32} />}
        aria-label={`${item.nome}, quantidade ${item.quantidade}`} aria-pressed={selecionado === item.id}
        title={`${item.nome} ×${item.quantidade}`} data-compact={compacto ? 'true' : 'false'} onClick={() => { definirSelecionado(item.id); definirErro(null) }}>
        <span>{compacto ? item.quantidade : `${item.nome} ×${item.quantidade}`}</span>
      </Button>)}
      {Array.from({ length: vazio }, (_, indice) => <span className={estilos.emptySlot} key={`vazio-${indice}`} aria-hidden="true" />)}
    </div>
    {!exibido.length ? <p className="atenuado">{filtro === "todos" ? 'Sua bolsa está vazia.' : 'Nenhum item nesta categoria.'}</p> : null}
    {selecionadoItem ? <div className={estilos.inspection} aria-live="polite">
      <strong>{selecionadoItem.nome}</strong>
      {peca && definicao ? (
        <>
          <p>Raridade {peca.raridade ?? 'comum'}{valor === null ? '' : ` · ${atributo} ${valor}`}</p>
          <p>{definicaoEmUso
            ? `Em uso no mesmo espaço: ${definicaoEmUso.nome}${valorEmUso === null ? '' : ` · ${atributo} ${valorEmUso}`}`
            : 'Nenhum equipamento em uso neste espaço.'}</p>
        </>
      ) : <p>{selecionadoItem.detalhe} Quantidade: {selecionadoItem.quantidade}.</p>}
      {selecionadoItem.tipo === "equipamento" && aoEquipar ? <Button variant="primary" size="sm" disabled={pendente} loading={pendente} onClick={() => void equipar(selecionadoItem.id)}>{pendente ? 'Equipando…' : 'Equipar'}</Button> : null}
    </div> : exibido.length > 0 ? <p className={estilos.hint}>{compacto ? 'Selecione um espaço para ver o nome e os detalhes do item.' : 'Selecione um item para inspecionar. Equipamentos em uso ficam na aba Equipamento.'}</p> : null}
    {compacto && itens.length > 8 ? <p className="atenuado">+{itens.length - 8} itens na bolsa completa</p> : null}
    {erro ? <p role="alert" className="informacao-alerta">{erro}</p> : null}
  </div>
}

