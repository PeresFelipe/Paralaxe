/**
 * @file Escolha, acompanhamento e histórico de metas de fabricação.
 * Consulta ingredientes na mochila, aponta fontes de coleta e apresenta conquistas
 * persistidas. Abrir uma profissão pelo painel não inicia sua atividade automaticamente.
 */
import { useState } from 'react'
import { RECEITAS_INICIAIS_DE_FABRICACAO, ATIVIDADES_OCIOSAS_INICIAIS, obterDefinicaoDeReceitaDeFabricacao } from '@greywake/conteudo'
import { obterProgressoDaMetaDaJornada, type PartidaLocal, type IdDaProfissao } from '@greywake/dominio'
import { ComparacaoDeEquipamento, IconeDoJogo } from '@/components/jogo'
import { obterIconeDoEquipamento, obterIconeDoItem } from '@/iconesDosRecursos'
import { rotulosDosItens, rotulosDasProfissoes } from '@/rotulosDoJogo'
import { Button, ProgressBar } from '@/components/ui'
import estilos from './MetaDaJornada.module.css'

type Propriedades = {
  partida: PartidaLocal
  aoEscolherMeta: (idDaReceita: string | null) => Promise<void>
  aoAbrirProfissao: (profissao: IdDaProfissao) => void
  aoAbrirEquipamento: () => void
}

/** Metas acompanham produtos fabricados; reforço exige uma instância específica e fica fora das opções. */
const receitas = RECEITAS_INICIAIS_DE_FABRICACAO.filter((receita) => receita.saida.tipo !== "equipamento-reforco")
const finalidades: Record<string, string> = {
  "receita.forja.giuis-bracadeiras": 'Forje uma peça e compare a proteção com seu equipamento.',
  "receita.metalurgia.tratada-cloch": 'Prepare material usado no Reforço Simples +1 de equipamentos.',
  "receita.culinaria.assado-scadan": "Prepare uma refeição que recupera Vida e Fôlego em combate.",
  "receita.culinaria.neantog-preparacao": 'Prepare um consumível que recupera Vida em combate.',
}

/** Resume a meta em um botão permanente, distinguindo coleta de materiais, fabricação ativa e conclusão. */
export function ResumoDaMetaDaJornada({ partida, aoAbrir }: { partida: PartidaLocal; aoAbrir: () => void }) {
  const receita = partida.jornada.meta ? obterDefinicaoDeReceitaDeFabricacao(partida.jornada.meta.idDaDefinicaoDaReceita) : null
  const progresso = receita ? obterProgressoDaMetaDaJornada(partida, receita) : null
  return <Button
    variant="journey"
    icon={<IconeDoJogo icone="livro-abrir" tamanho={28} />}
    onClick={aoAbrir}
    aria-haspopup="dialog"
    data-meta-resumo=""
    data-complete={progresso?.concluido ? 'true' : 'false'}
  >
    <span><small>{progresso?.concluido ? 'Meta concluída' : 'Sua próxima conquista'}</small>
      <strong>{receita?.nome ?? 'Escolha uma meta de fabricação'}</strong>
      <span>{progresso ? progresso.concluido ? 'Registrada na Jornada · escolher o próximo passo' : progresso.fabricacao ? 'Na bancada · fabricação em curso' : progresso.pronto ? 'Materiais reunidos · ver produção' : `${progresso.coletado} / ${progresso.exigido} materiais reunidos` : 'Uma receita, um objetivo, no seu ritmo.'}</span>
    </span><span aria-hidden="true">→</span>
  </Button>
}

/** Mostra progresso e opções da meta e conecta os atalhos de produção e equipamento à navegação principal. */
export default function MetaDaJornada({ partida, aoEscolherMeta, aoAbrirProfissao, aoAbrirEquipamento }: Propriedades) {
  const [escolhendo, definirEscolhendo] = useState(false)
  const [pendente, definirPendente] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const receita = partida.jornada.meta ? obterDefinicaoDeReceitaDeFabricacao(partida.jornada.meta.idDaDefinicaoDaReceita) : null
  const progresso = receita ? obterProgressoDaMetaDaJornada(partida, receita) : null
  /** Espera a gravação da escolha ou remoção de meta antes de recolher as opções; não altera o histórico de feitos. */
  async function escolher(id: string | null) {
    if (pendente) return
    definirPendente(true)
    definirErro(null)
    try { await aoEscolherMeta(id); definirEscolhendo(false) }
    catch (causa) { definirErro(causa instanceof Error ? causa.message : 'Não foi possível salvar sua meta.') }
    finally { definirPendente(false) }
  }

  return <section className={`${estilos.meta} jornada-meta`} aria-label="Meta de fabricação" aria-busy={pendente}>
    <p className="secao-chamada">{progresso?.concluido ? 'Conquista registrada' : 'Sua próxima conquista'}</p>
    {receita && progresso ? <>
      <div className={estilos.title}><IconeDoJogo icone={receita.saida.tipo === "equipamento" ? obterIconeDoEquipamento(receita.saida.idDaDefinicao) : receita.saida.tipo === 'item' ? obterIconeDoItem(receita.saida.idDaDefinicao) : "ferreiro"} tamanho={40} /><h3>{receita.nome}</h3></div>
      <p className={`atenuado ${estilos.muted}`}>{finalidades[receita.id]}</p>
      {progresso.concluido ? <div className={estilos.completion}><strong>Fabricação concluída.</strong><p>Seu feito permanece registrado, mesmo depois de usar ou guardar o item.</p>
        {receita.saida.tipo === "equipamento" ? <Button variant="primary" size="sm" onClick={aoAbrirEquipamento}>Ver equipamento</Button> : null}
      </div> : <>
        <ProgressBar value={progresso.coletado} max={progresso.exigido || 1} label={`Materiais para ${receita.nome}`} />
        <p className={estilos.progressLabel}>{progresso.fabricacao ? 'Fabricação em curso' : progresso.pronto ? 'Materiais reunidos' : `${progresso.coletado} / ${progresso.exigido} materiais reunidos`} · Inventário</p>
        <ul className={estilos.ingredients}>{progresso.ingredientes.map((ingrediente) => {
          const origem = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.idDaDefinicaoDoItemProduzido === ingrediente.idDaDefinicao)
          // O estoque do banco é apenas informativo: ingredientes precisam estar no inventário para a fabricação utilizá-los.
          const guardadoNoBanco = partida.personagem.banco.inventario.find((pilha) => pilha.idDaDefinicao === ingrediente.idDaDefinicao)?.quantidade ?? 0
          return <li key={ingrediente.idDaDefinicao}><div><strong>{rotulosDosItens[ingrediente.idDaDefinicao] ?? ingrediente.idDaDefinicao}</strong><span>{ingrediente.possuido} / {ingrediente.quantidade}{ingrediente.faltante ? ` · faltam ${ingrediente.faltante}` : ' · reunido'}{ingrediente.faltante && guardadoNoBanco ? ` · ${guardadoNoBanco} no Banco` : ''}</span></div>
            {ingrediente.faltante && origem ? <Button variant="ghost" size="sm" onClick={() => aoAbrirProfissao(origem.idDaProfissao)}>Ver {rotulosDasProfissoes[origem.idDaProfissao]} →</Button> : null}
          </li>
        })}</ul>
        <ComparacaoDeEquipamento partida={partida} idDaReceita={receita.id} />
        <Button variant="primary" size="sm" fullWidth onClick={() => aoAbrirProfissao(receita.idDaProfissao)}>{progresso.fabricacao ? 'Ver fabricação em curso' : `Ver produção · ${rotulosDasProfissoes[receita.idDaProfissao]}`}</Button>
      </>}
      <div className={estilos.actions}><Button variant="secondary" disabled={pendente} onClick={() => definirEscolhendo(!escolhendo)}>{escolhendo ? 'Fechar opções' : progresso.concluido ? 'Escolher próxima meta' : 'Trocar meta'}</Button><Button variant="ghost" disabled={pendente} onClick={() => void escolher(null)}>Dispensar meta</Button></div>
    </> : <><h3>O que você quer preparar?</h3><p className={`atenuado ${estilos.muted}`}>Escolha uma receita. A Jornada acompanha os materiais enquanto você decide o que fazer.</p></>}
    {(!receita || escolhendo) ? <div className={estilos.options}>{receitas.map((candidato) => <Button variant="recipe" key={candidato.id} disabled={pendente || partida.profissoes[candidato.idDaProfissao].nivel < candidato.nivelExigidoDaProfissao} onClick={() => void escolher(candidato.id)}>
      <strong>{candidato.nome}</strong><span>{finalidades[candidato.id]}</span><small>{rotulosDasProfissoes[candidato.idDaProfissao]} · {candidato.segundosPorAcao}s por fabricação</small>
    </Button>)}</div> : null}
    {erro ? <p role="alert" className="informacao-alerta">{erro}</p> : null}
    {partida.jornada.idsDasReceitasFabricadas.length ? <details className={estilos.records}><summary>Fabricações registradas ({partida.jornada.idsDasReceitasFabricadas.length})</summary><ul>{partida.jornada.idsDasReceitasFabricadas.map((id) => <li key={id}>{obterDefinicaoDeReceitaDeFabricacao(id)?.nome ?? 'Receita de uma jornada anterior'}</li>)}</ul></details> : null}
  </section>
}
