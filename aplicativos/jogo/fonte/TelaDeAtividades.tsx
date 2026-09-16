import { useState } from 'react'
import { RECEITAS_INICIAIS_DE_FABRICACAO, ATIVIDADES_OCIOSAS_INICIAIS } from '@greywake/conteudo'
import { obterXpDeProfissaoParaProximoNivel, type PartidaLocal, type IdDaProfissao } from '@greywake/dominio'
import IndicadorDeProgressoOcioso from './IndicadorDeProgressoOcioso'
import IconeDoJogo from './IconeDoJogo'
import ComparacaoDeEquipamento from './ComparacaoDeEquipamento'
import { obterIconeDoItem, iconeDeProfissaoPorId } from './iconesDosRecursos'
import { coletaProfissoes, rotulosDosItens, producaoProfissoes, rotulosDasProfissoes } from './rotulosDoJogo'

type PropriedadesDeTelaDeAtividades = {
  partida: PartidaLocal
  ultimoResultadoDoTrabalho: string | null
  profissaoSelecionada: IdDaProfissao
  aoSelecionarProfissao: (profissao: IdDaProfissao) => void
  aoIniciarAtividade: (id: string) => Promise<void>
  aoIniciarReceita: (id: string) => Promise<void>
  aoPararTrabalho: () => Promise<void>
  aoTrilhaReceita: (idDaReceita: string) => Promise<void>
}

export default function TelaDeAtividades({ partida, ultimoResultadoDoTrabalho, profissaoSelecionada, aoSelecionarProfissao, aoIniciarAtividade, aoIniciarReceita, aoPararTrabalho, aoTrilhaReceita }: PropriedadesDeTelaDeAtividades) {
  const [pendente, definirPendente] = useState(false)
  const [acaoErro, definirAcaoErro] = useState<string | null>(null)
  const progresso = partida.profissoes[profissaoSelecionada]
  const proximoNivelXp = obterXpDeProfissaoParaProximoNivel(progresso.nivel)
  const atividades = ATIVIDADES_OCIOSAS_INICIAIS.filter((atividade) => atividade.idDaProfissao === profissaoSelecionada)
  const receitas = RECEITAS_INICIAIS_DE_FABRICACAO.filter((receita) => receita.idDaProfissao === profissaoSelecionada && receita.saida.tipo !== "equipamento-reforco")
  const ocioso = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.id === partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade)
  const fabricar = RECEITAS_INICIAIS_DE_FABRICACAO.find((receita) => receita.id === partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita)
  const trabalho = ocioso?.nomeDoResultado ?? fabricar?.nome
  const ativoProfissao = ocioso?.idDaProfissao ?? fabricar?.idDaProfissao
  const animadoArte = profissaoSelecionada === "pesca"
    ? { movimento: '/arte/atividades/pesca.gif?v=3', estatico: '/arte/atividades/pesca-estatico.png?v=2' }
    : profissaoSelecionada === "mineracao"
      ? { movimento: '/arte/atividades/mineracao.gif?v=3', estatico: '/arte/atividades/mineracao-estatico.png?v=2' }
      : profissaoSelecionada === "lenhador"
        ? { movimento: '/arte/atividades/lenhador.gif?v=3', estatico: '/arte/atividades/lenhador-estatico.png?v=2' }
        : profissaoSelecionada === "herbologia"
          ? { movimento: '/arte/atividades/herbologia.gif?v=3', estatico: '/arte/atividades/herbologia-estatico.png?v=2' }
        : profissaoSelecionada === "metalurgia"
          ? { movimento: '/arte/atividades/metalurgia.gif?v=3', estatico: '/arte/atividades/metalurgia-estatico.png?v=2' }
        : profissaoSelecionada === "forja"
          ? { movimento: '/arte/atividades/forja.gif?v=3', estatico: '/arte/atividades/forja-estatico.png?v=2' }
        : profissaoSelecionada === "culinaria"
          ? { movimento: '/arte/atividades/culinaria.gif?v=3', estatico: '/arte/atividades/culinaria-estatico.png?v=2' }
      : null
  const possuido = (id: string) => partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === id)?.quantidade ?? 0

  async function agir(acao: () => Promise<void>) {
    if (pendente) return
    definirPendente(true)
    definirAcaoErro(null)
    try { await acao() }
    catch (erro) { definirAcaoErro(erro instanceof Error ? erro.message : 'Não foi possível concluir a ação. Tente novamente.') }
    finally { definirPendente(false) }
  }

  function escolherProfissao(profissao: IdDaProfissao) {
    definirAcaoErro(null)
    aoSelecionarProfissao(profissao)
  }

  return (
    <section className="funcionalidade-telaDoJogo atividades-telaDoJogo" aria-label="Atividades">
      <div className="telaDoJogo-tituloDaSecao">
        <div><p className="secao-chamada">Ofícios da Cidade Livre</p><h1 className="destaque-titulo"><IconeDoJogo icone={iconeDeProfissaoPorId[profissaoSelecionada]} tamanho={32} />{rotulosDasProfissoes[profissaoSelecionada]}</h1></div>
        <span className={`atividade-estado ${ativoProfissao === profissaoSelecionada ? "atividade-estado--executando" : ''}`}>{ativoProfissao === profissaoSelecionada ? 'EM ATIVIDADE' : 'EM CONSULTA'}</span>
      </div>
      <div className="atividades-disposicao">
        <nav className="atividades-profissao-trilho" aria-label="Escolher habilidade">
          {([['Coleta', coletaProfissoes], ['Produção', producaoProfissoes]] as const).map(([rotulo, profissoes]) => (
            <div className="atividade-profissao-grupo" key={rotulo}>
              <h2 className="secao-titulo-emExecucao">{rotulo}</h2>
              <div className="profissao-cartao-gradeVisual">
                {profissoes.map((profissao) => <button className={`profissao-cartao ${profissaoSelecionada === profissao ? "ativo" : ''}`} type="button" key={profissao} aria-current={profissaoSelecionada === profissao ? 'true' : undefined} onClick={() => escolherProfissao(profissao)}>
                  <span className="profissao-cartaoRotulo"><IconeDoJogo icone={iconeDeProfissaoPorId[profissao]} tamanho={32} /><span>{rotulosDasProfissoes[profissao]}{ativoProfissao === profissao ? <small className="profissao-executando">Em curso</small> : null}</span></span><strong>{partida.profissoes[profissao].nivel}</strong>
                </button>)}
              </div>
            </div>
          ))}
        </nav>
        <label className="movel-profissao-seletor">Habilidade
          <select value={profissaoSelecionada} onChange={(evento) => escolherProfissao(evento.target.value as IdDaProfissao)}>
            {([['Coleta', coletaProfissoes], ['Produção', producaoProfissoes]] as const).map(([rotulo, profissoes]) => <optgroup label={rotulo} key={rotulo}>{profissoes.map((profissao) => <option key={profissao} value={profissao}>{rotulosDasProfissoes[profissao]} · Nv. {partida.profissoes[profissao].nivel}{ativoProfissao === profissao ? ' · Em curso' : ''}</option>)}</optgroup>)}
          </select>
        </label>
        <div className="atividades-areaDeTrabalho" aria-busy={pendente}>
          <div className="atividade-etapa">
            <div className="atividade-cena-envoltorio">
            <div className={`contexto-arte atividade-cena${animadoArte ? " contexto-arte--individual" : ''}`} data-profissao={profissaoSelecionada} aria-hidden="true">
              {animadoArte ? <picture>
                <source media="(prefers-reduced-motion: no-preference)" srcSet={ativoProfissao === profissaoSelecionada ? animadoArte.movimento : animadoArte.estatico} />
                <img src={animadoArte.estatico} alt="" width={480} height={270} decoding="async" />
              </picture> : null}
            </div>
            <p className="atividade-cena-legenda">{atividades[0]?.nome ?? rotulosDasProfissoes[profissaoSelecionada]}</p>
            </div>
            <div className="atividade-atualizado painel">
              {ativoProfissao === profissaoSelecionada ? <IndicadorDeProgressoOcioso partida={partida} /> : <div className="atividade-pronto">
                <p className="secao-chamada">{receitas.length ? 'Na bancada' : 'No campo'}</p>
                <h2>{receitas.length ? 'Tudo começa com os materiais.' : 'O próximo ciclo começa com você.'}</h2>
                <p>{trabalho ? `${trabalho} continua em curso. Iniciar uma nova tarefa substitui a atual.` : 'Escolha abaixo o que deseja coletar ou produzir.'}</p>
                {ativoProfissao ? <button className="material-origem" type="button" onClick={() => escolherProfissao(ativoProfissao)}>Ver atividade em curso →</button> : null}
              </div>}
              <div className="atividade-atualizado-acoes">
                {ativoProfissao === profissaoSelecionada ? <button className="discreto-botao" type="button" disabled={pendente} onClick={() => void agir(aoPararTrabalho)}>Parar atividade</button> : null}
              </div>
            </div>
          </div>
          <div className="profissao-nivel-faixa">
            <strong>{rotulosDasProfissoes[profissaoSelecionada]} · Nv. {progresso.nivel}</strong>
            {proximoNivelXp ? <><progress max={proximoNivelXp} value={progresso.xp} aria-label={`XP de ${rotulosDasProfissoes[profissaoSelecionada]} até o próximo nível`} /><span>{progresso.xp} / {proximoNivelXp} XP</span></> : <span>Nível máximo da versão · {progresso.xp} XP</span>}
            <details><summary>Detalhes</summary><p>Prestígio: {progresso.prestigio}. Trocar a habilidade em consulta mantém a atividade atual.</p></details>
          </div>
          {acaoErro ? <p className="informacao-alerta" role="alert">{acaoErro}</p> : null}
          <div className="atividade-opcoes">
            <div className="atividade-opcoes-tituloDaSecao"><h2>{receitas.length ? 'Receitas conhecidas' : 'Recursos disponíveis'}</h2><span>Rendimento por ciclo</span></div>
            {atividades.map((atividade) => {
              const ativo = ocioso?.id === atividade.id
              const desbloqueado = progresso.nivel >= atividade.nivelExigidoDaProfissao
              return <article className={`atividade-opcao painel ${ativo ? "selecionado-cartao" : ''}`} key={atividade.id}>
                <div className="item-miniatura" aria-hidden="true"><IconeDoJogo icone={obterIconeDoItem(atividade.idDaDefinicaoDoItemProduzido)} tamanho={40} /></div>
                <div className="atividade-opcao-corpo">
                  <div className="atividade-opcao-titulo"><h2>{atividade.nomeDoResultado}</h2><span>Possuído: <strong>{possuido(atividade.idDaDefinicaoDoItemProduzido)}</strong></span></div>
                  <p className="atividade-rendimento">+1 por ciclo · {atividade.segundosPorAcao}s · +{atividade.xpDeProfissaoPorAcao} XP</p>
                  {!desbloqueado ? <p className="informacao-alerta">Requer {rotulosDasProfissoes[profissaoSelecionada]} no nível {atividade.nivelExigidoDaProfissao}.</p> : null}
                  {trabalho && !ativo ? <p className="atividade-substituicao">Ao iniciar, substitui {trabalho}.</p> : null}
                  <button className={ativo ? "discreto-botao" : "principal-botao compacto"} type="button" disabled={pendente || !desbloqueado} onClick={() => void agir(ativo ? aoPararTrabalho : () => aoIniciarAtividade(atividade.id))}>{ativo ? 'Em curso · Parar' : `Coletar ${atividade.nomeDoResultado}`}</button>
                </div>
              </article>
            })}
            {receitas.map((receita) => {
              const ativo = fabricar?.id === receita.id
              const suficiente = receita.ingredientes.every((ingrediente) => possuido(ingrediente.idDaDefinicao) >= ingrediente.quantidade)
              const desbloqueado = progresso.nivel >= receita.nivelExigidoDaProfissao
              return <article className={`atividade-opcao painel ${ativo ? "selecionado-cartao" : ''}`} key={receita.id}>
                <div className="item-miniatura" aria-hidden="true"><IconeDoJogo icone={receita.saida.tipo === 'item' ? obterIconeDoItem(receita.saida.idDaDefinicao) : iconeDeProfissaoPorId[profissaoSelecionada]} tamanho={40} /></div>
                <div className="atividade-opcao-corpo">
                  <h2>{receita.nome}</h2>
                  <p className="atividade-rendimento">{receita.segundosPorAcao}s por ciclo · +{receita.xpDeProfissaoPorAcao} XP</p>
                  <ComparacaoDeEquipamento partida={partida} idDaReceita={receita.id} />
                  <div className="ingrediente-listar">
                    {receita.ingredientes.map((ingrediente) => {
                      const quantidade = possuido(ingrediente.idDaDefinicao)
                      const faltante = Math.max(0, ingrediente.quantidade - quantidade)
                      const origem = ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.idDaDefinicaoDoItemProduzido === ingrediente.idDaDefinicao)
                      const producaoOrigem = RECEITAS_INICIAIS_DE_FABRICACAO.find((candidato) => candidato.saida.tipo === 'item' && candidato.saida.idDaDefinicao === ingrediente.idDaDefinicao)
                      const origemProfissao = origem?.idDaProfissao ?? producaoOrigem?.idDaProfissao
                      return <div key={ingrediente.idDaDefinicao}><span>{rotulosDosItens[ingrediente.idDaDefinicao] ?? ingrediente.idDaDefinicao} <strong>{quantidade} / {ingrediente.quantidade}</strong>{faltante ? <small>Faltam {faltante}</small> : null}</span>{faltante && origemProfissao ? <button className="material-origem" type="button" onClick={() => escolherProfissao(origemProfissao)}>Ver {rotulosDasProfissoes[origemProfissao]} →</button> : null}</div>
                    })}
                  </div>
                  {!desbloqueado ? <p className="informacao-alerta">Requer {rotulosDasProfissoes[profissaoSelecionada]} no nível {receita.nivelExigidoDaProfissao}.</p> : null}
                  {trabalho && !ativo ? <p className="atividade-substituicao">Ao iniciar, substitui {trabalho}.</p> : null}
                  <div className="botao-linhaDeDados"><button className={ativo ? "discreto-botao" : "principal-botao compacto"} type="button" disabled={pendente || (!ativo && (!suficiente || !desbloqueado))} onClick={() => void agir(ativo ? aoPararTrabalho : () => aoIniciarReceita(receita.id))}>{ativo ? 'Em curso · Parar' : suficiente ? 'Iniciar produção' : 'Faltam materiais'}</button>
                    <button className="discreto-botao" type="button" disabled={pendente || !desbloqueado} onClick={() => void agir(() => aoTrilhaReceita(receita.id))}>{partida.jornada.meta?.idDaDefinicaoDaReceita === receita.id ? 'Ver meta na Jornada' : 'Acompanhar na Jornada'}</button></div>
                </div>
              </article>
            })}
            {!atividades.length && !receitas.length ? <div className="painel"><h2>Sem receitas disponíveis</h2><p className="atenuado">As melhorias de equipamentos desta configuração ficam em Personagem → Equipamento.</p></div> : null}
          </div>
          <p className="trabalho-resultado"><span>Última conclusão</span><strong>{ultimoResultadoDoTrabalho ?? 'Os resultados da atividade aparecerão aqui.'}</strong></p>
        </div>
      </div>
    </section>
  )
}
