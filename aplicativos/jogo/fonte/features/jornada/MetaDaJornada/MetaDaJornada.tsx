/**
 * @file Objetivos de fabricação apresentados como diário compacto de Jornada.
 * A seleção é transitória; progresso e persistência continuam nas regras de domínio.
 */
import { useState } from 'react'
import { RECEITAS_INICIAIS_DE_FABRICACAO, ATIVIDADES_OCIOSAS_INICIAIS, obterDefinicaoDeReceitaDeFabricacao } from '@paralaxe/conteudo'
import { obterProgressoDaMetaDaJornada, type PartidaLocal, type IdDaProfissao } from '@paralaxe/dominio'
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

/** O reforço exige uma instância de equipamento e não é uma opção de meta geral. */
const receitas = RECEITAS_INICIAIS_DE_FABRICACAO.filter((receita) => receita.saida.tipo !== 'equipamento-reforco')
const finalidades: Record<string, string> = {
  'receita.forja.giuis-bracadeiras': 'Forje uma peça e compare a proteção com seu equipamento.',
  'receita.metalurgia.tratada-cloch': 'Prepare material usado no Reforço Simples +1 de equipamentos.',
  'receita.culinaria.assado-scadan': 'Prepare uma refeição que recupera Vida e Fôlego em combate.',
  'receita.culinaria.neantog-preparacao': 'Prepare um consumível que recupera Vida em combate.',
}

/** Atalho permanente; apresenta somente a próxima decisão relevante. */
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

/** Mantém seleção, edição e ações separadas; a lista não aparece junto de todos os detalhes da meta. */
export default function MetaDaJornada({ partida, aoEscolherMeta, aoAbrirProfissao, aoAbrirEquipamento }: Propriedades) {
  const [escolhendo, definirEscolhendo] = useState(false)
  const [pendente, definirPendente] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const receita = partida.jornada.meta ? obterDefinicaoDeReceitaDeFabricacao(partida.jornada.meta.idDaDefinicaoDaReceita) : null
  const progresso = receita ? obterProgressoDaMetaDaJornada(partida, receita) : null
  const mostrarLista = !receita || escolhendo

  /** Aguarda a persistência antes de substituir a meta e preserva mensagens de erro. */
  async function escolher(id: string | null) {
    if (pendente) return
    definirPendente(true)
    definirErro(null)
    try {
      await aoEscolherMeta(id)
      definirEscolhendo(false)
    } catch (causa) {
      definirErro(causa instanceof Error ? causa.message : 'Não foi possível salvar sua meta.')
    } finally {
      definirPendente(false)
    }
  }

  return (
    <section className={estilos.meta} aria-label="Meta de fabricação" aria-busy={pendente}>
      {mostrarLista ? (
        <>
          <div className={estilos.introducao}>
            <p className={estilos.sobretitulo}>{receita ? 'Mudar objetivo' : 'Sua próxima conquista'}</p>
            <h3>{receita ? 'Escolha uma nova meta' : 'Escolha sua próxima meta'}</h3>
            <p className={estilos.muted}>A Jornada acompanha os materiais e ajuda você a encontrar a próxima etapa.</p>
            {receita ? <div className={estilos.metaAtual}>
              <span>Meta atual: <strong>{receita.nome}</strong></span>
              <Button variant="ghost" size="sm" disabled={pendente} onClick={() => definirEscolhendo(false)}>Voltar</Button>
            </div> : null}
          </div>
          <div className={estilos.options} role="group" aria-label="Receitas disponíveis">
            {receitas.map((candidato) => {
              const nivelAtual = partida.profissoes[candidato.idDaProfissao].nivel
              const bloqueado = nivelAtual < candidato.nivelExigidoDaProfissao
              return (
                <Button
                  variant="ghost"
                  key={candidato.id}
                  type="button"
                  className={estilos.opcao}
                  aria-pressed={receita?.id === candidato.id}
                  disabled={pendente || bloqueado}
                  onClick={() => void escolher(candidato.id)}
                >
                  <span className={estilos.opcaoNome}>{candidato.nome}</span>
                  <span className={estilos.opcaoDescricao}>{finalidades[candidato.id] ?? 'Prepare uma nova criação para sua jornada.'}</span>
                  <span className={estilos.opcaoRodape}>
                    <span>{rotulosDasProfissoes[candidato.idDaProfissao]} · {candidato.segundosPorAcao}s por fabricação</span>
                    <strong>{bloqueado ? `Requer Nv. ${candidato.nivelExigidoDaProfissao}` : receita?.id === candidato.id ? 'Atual' : 'Escolher →'}</strong>
                  </span>
                </Button>
              )
            })}
          </div>
        </>
      ) : receita && progresso ? (
        <>
          <p className={estilos.sobretitulo}>{progresso.concluido ? 'Conquista registrada' : 'Objetivo em andamento'}</p>
          <div className={estilos.title}>
            <IconeDoJogo icone={receita.saida.tipo === 'equipamento' ? obterIconeDoEquipamento(receita.saida.idDaDefinicao) : receita.saida.tipo === 'item' ? obterIconeDoItem(receita.saida.idDaDefinicao) : 'ferreiro'} tamanho={32} />
            <h3>{receita.nome}</h3>
          </div>
          <p className={estilos.muted}>{finalidades[receita.id]}</p>
          {progresso.concluido ? (
            <div className={estilos.completion}>
              <strong>Fabricação concluída.</strong>
              <p>O feito está registrado na Jornada.</p>
              {receita.saida.tipo === 'equipamento' ? <Button variant="primary" size="sm" onClick={aoAbrirEquipamento}>Ver equipamento</Button> : null}
            </div>
          ) : (
            <>
              <ProgressBar value={progresso.coletado} max={progresso.exigido || 1} label={`Materiais para ${receita.nome}`} />
              <p className={estilos.progressLabel}>{progresso.fabricacao ? 'Fabricação em curso' : progresso.pronto ? 'Materiais reunidos' : `${progresso.coletado} / ${progresso.exigido} materiais reunidos`} · Inventário</p>
              <ul className={estilos.ingredients}>
                {progresso.ingredientes.map((ingrediente) => {
                  const origem = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.idDaDefinicaoDoItemProduzido === ingrediente.idDaDefinicao)
                  // Ingredientes usados na fabricação precisam estar no inventário, não apenas no Banco.
                  const guardadoNoBanco = partida.personagem.banco.inventario.find((pilha) => pilha.idDaDefinicao === ingrediente.idDaDefinicao)?.quantidade ?? 0
                  return (
                    <li key={ingrediente.idDaDefinicao}>
                      <div>
                        <strong>{rotulosDosItens[ingrediente.idDaDefinicao] ?? ingrediente.idDaDefinicao}</strong>
                        <span>{ingrediente.possuido} / {ingrediente.quantidade}{ingrediente.faltante ? ` · faltam ${ingrediente.faltante}` : ' · reunido'}{ingrediente.faltante && guardadoNoBanco ? ` · ${guardadoNoBanco} no Banco` : ''}</span>
                      </div>
                      {ingrediente.faltante && origem ? <Button variant="ghost" size="sm" onClick={() => aoAbrirProfissao(origem.idDaProfissao)}>Ver {rotulosDasProfissoes[origem.idDaProfissao]} →</Button> : null}
                    </li>
                  )
                })}
              </ul>
              <Button variant="primary" size="sm" fullWidth onClick={() => aoAbrirProfissao(receita.idDaProfissao)}>
                {progresso.fabricacao ? 'Ver fabricação em curso' : `Ver produção · ${rotulosDasProfissoes[receita.idDaProfissao]}`}
              </Button>
              <details className={estilos.records}>
                <summary>Comparar equipamento e atributos</summary>
                <ComparacaoDeEquipamento partida={partida} idDaReceita={receita.id} />
              </details>
            </>
          )}
          <div className={estilos.actions}>
            <Button variant="secondary" size="sm" disabled={pendente} onClick={() => definirEscolhendo(true)}>
              {progresso.concluido ? 'Escolher próxima meta' : 'Trocar meta'}
            </Button>
            <Button variant="ghost" size="sm" disabled={pendente} onClick={() => void escolher(null)}>Dispensar meta</Button>
          </div>
        </>
      ) : null}

      {erro ? <p role="alert" className="informacao-alerta">{erro}</p> : null}
      {partida.jornada.idsDasReceitasFabricadas.length ? (
        <details className={estilos.records}>
          <summary>Fabricações registradas ({partida.jornada.idsDasReceitasFabricadas.length})</summary>
          <ul>{partida.jornada.idsDasReceitasFabricadas.map((id) => <li key={id}>{obterDefinicaoDeReceitaDeFabricacao(id)?.nome ?? 'Receita de uma jornada anterior'}</li>)}</ul>
        </details>
      ) : null}
    </section>
  )
}
