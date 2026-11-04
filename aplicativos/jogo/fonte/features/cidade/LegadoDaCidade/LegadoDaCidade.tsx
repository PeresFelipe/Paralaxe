/** Cidade Viva: apresentação de projetos, sem temporizadores ou regras de economia no React. */
import { useMemo, useState } from 'react'
import { Button, Card, ProgressBar } from '@/components/ui'
import { DISTRITOS_DA_CIDADE, ESTAGIOS_DA_CIDADE, CENAS_DA_CIDADE, PROJETOS_DA_CIDADE } from '@paralaxe/conteudo'
import { consultarProjeto, estagioDoLegado, totalDeMelhoriasDaCidade, LIMIARES_DOS_ESTAGIOS, type IdDoDistrito, type PartidaLocal, type SituacaoDoProjeto } from '@paralaxe/dominio'
import estilos from './LegadoDaCidade.module.css'

export interface AcoesDoLegado { aoConcluirProjeto: (idDoProjeto: string) => Promise<void> }
const CAMINHO = '/arte/cidade/interface/'
const ICONES: Record<IdDoDistrito, string> = {
  praca: 'cidade-reconstrucao.png', taverna: 'icone-taverna.png', ferreiro: 'icone-ferreiro.png', mercado: 'icone-mercado.png',
  banco: 'icone-banco.png', relicario: 'icone-relicario.png', codice: 'icone-codice.png', muralhas: 'cidade-reconstrucao.png',
}
const ROTULOS: Record<SituacaoDoProjeto, string> = {
  bloqueado: 'Bloqueado', disponivel: 'Faltam materiais', pronto: 'Pronto para restaurar', concluido: 'Concluído',
}
const FILTROS = ['ativos', 'pronto', 'disponivel', 'bloqueado', 'concluido', 'todos'] as const
type Filtro = (typeof FILTROS)[number]

/** Somente a arte do estágio atual. Sem camadas falsas ou recortes desalinhados. */
export function CenaDaCidade({ partida }: { partida: PartidaLocal }) {
  const estagio = estagioDoLegado(partida.legado)
  const cena = CENAS_DA_CIDADE.find(item => item.estagio === estagio)
  const [falha, definirFalha] = useState<string | null>(null)
  const nome = ESTAGIOS_DA_CIDADE[estagio].nome
  const caminho = cena?.caminho ?? ''
  const imagemDisponivel = Boolean(cena?.disponivel && caminho && falha !== caminho)
  return (
    <div className={estilos.cena}>
      {imagemDisponivel ? (
        <picture key={caminho} className={estilos.imagemResponsiva}>
          <source media="(max-width: 720px)" srcSet={`/arte/cidade/mobile/cidade-estagio-${estagio}-mobile.webp`} type="image/webp" />
          <img className={estilos.imagemFinal} src={caminho} alt={`Vista da Cidade Livre em ${nome}`} loading="lazy" decoding="async" onError={() => definirFalha(caminho)} />
        </picture>
      ) : (
        <div className={estilos.reservaVisual} role="img" aria-label={`Cidade Livre: ${nome}. Ilustração temporariamente indisponível.`}>
          <span aria-hidden="true">✧</span><strong>{nome}</strong><small>A cidade continua a crescer com suas conquistas.</small>
        </div>
      )}
      <div className={estilos.legenda}><img src={`${CAMINHO}emblema-estagio-${estagio}.png`} alt="" loading="lazy" decoding="async" /><span>{nome}</span></div>
    </div>
  )
}

function obterVisaoDaCidade(partida: PartidaLocal) {
  const projetos = PROJETOS_DA_CIDADE.map(definicao => ({ definicao, consulta: consultarProjeto(partida, definicao) }))
  const atuais = projetos.filter(item => item.consulta.situacao !== 'concluido' && partida.legado.distritos[item.definicao.distrito] === item.definicao.nivel - 1)
  return { projetos, atuais, prontos: atuais.filter(item => item.consulta.situacao === 'pronto'), desbloqueados: atuais.filter(item => item.consulta.situacao === 'disponivel') }
}

export function ResumoDaCidade({ partida, aoAbrirProjetos }: { partida: PartidaLocal; aoAbrirProjetos: () => void }) {
  const visao = useMemo(() => obterVisaoDaCidade(partida), [partida])
  const estagio = estagioDoLegado(partida.legado)
  const total = totalDeMelhoriasDaCidade(partida.legado)
  const proximo = LIMIARES_DOS_ESTAGIOS[estagio + 1]
  const projetoEmDestaque = visao.prontos[0] ?? visao.desbloqueados[0] ?? visao.atuais[0]
  return (
    <section className={estilos.resumo} aria-label="Legado da Cidade Livre">
      <CenaDaCidade partida={partida} />
      <Card className={estilos.cartaoPrincipal}>
        <div className={estilos.tituloDeSecao}>
          <img src={`${CAMINHO}cidade-reconstrucao.png`} alt="" decoding="async" />
          <div><p className="secao-chamada">CIDADE VIVA · RECONSTRUÇÃO</p><h2>Legado da Cidade Livre</h2></div>
        </div>
        <p className="atenuado">{ESTAGIOS_DA_CIDADE[estagio].descricao} Cada projeto concluído deixa uma marca em seu refúgio.</p>
        <div className={estilos.estatisticas}>
          <div><strong>{total}/32</strong><span>melhorias concluídas</span></div>
          <div><strong>{visao.prontos.length}</strong><span>projetos prontos</span></div>
          <div><strong>{visao.desbloqueados.length}</strong><span>à espera de materiais</span></div>
        </div>
        {proximo !== undefined ? (
          <ProgressBar label={`Progresso para ${ESTAGIOS_DA_CIDADE[estagio + 1]?.nome ?? 'próximo estágio'}`} value={total - LIMIARES_DOS_ESTAGIOS[estagio]} max={proximo - LIMIARES_DOS_ESTAGIOS[estagio]} />
        ) : <p role="status" className={estilos.celebracao}>A Cidade Livre alcançou seu último grande estágio. Ainda é possível terminar seus distritos.</p>}
        {projetoEmDestaque ? (
          <div className={estilos.destaqueProjeto}>
            <img src={`${CAMINHO}${ICONES[projetoEmDestaque.definicao.distrito]}`} alt="" loading="lazy" decoding="async" />
            <div><strong>{projetoEmDestaque.definicao.nome}</strong><span>{ROTULOS[projetoEmDestaque.consulta.situacao]} · {projetoEmDestaque.definicao.descricao}</span></div>
          </div>
        ) : <p className={estilos.celebracao}>Todos os distritos foram restaurados. Seu legado permanece.</p>}
        <Button variant="primary" onClick={aoAbrirProjetos}>Ver projetos de reconstrução</Button>
      </Card>
    </section>
  )
}

export function PainelDeProjetos({ partida, aoVoltar, aoConcluirProjeto }: { partida: PartidaLocal; aoVoltar: () => void } & AcoesDoLegado) {
  const [filtro, definirFiltro] = useState<Filtro>('ativos')
  const [pendente, definirPendente] = useState<string | null>(null)
  const [confirmando, definirConfirmando] = useState<string | null>(null)
  const [erro, definirErro] = useState<string | null>(null)
  const [conquista, definirConquista] = useState<{ titulo: string; texto: string; estagioAntes: number } | null>(null)
  const visao = useMemo(() => obterVisaoDaCidade(partida), [partida])
  const total = totalDeMelhoriasDaCidade(partida.legado)
  const estagio = estagioDoLegado(partida.legado)
  const listados = visao.projetos.filter(({ definicao, consulta }) => {
    if (filtro === 'todos') return true
    if (filtro === 'ativos') return consulta.situacao !== 'concluido' && partida.legado.distritos[definicao.distrito] === definicao.nivel - 1
    return consulta.situacao === filtro
  })
  const contagem: Record<Filtro, number> = {
    ativos: visao.atuais.length, pronto: visao.projetos.filter(item => item.consulta.situacao === 'pronto').length,
    disponivel: visao.projetos.filter(item => item.consulta.situacao === 'disponivel').length,
    bloqueado: visao.projetos.filter(item => item.consulta.situacao === 'bloqueado').length,
    concluido: visao.projetos.filter(item => item.consulta.situacao === 'concluido').length, todos: visao.projetos.length,
  }
  const nomes: Record<Filtro, string> = { ativos: 'Próximos', pronto: 'Prontos', disponivel: 'Faltam materiais', bloqueado: 'Bloqueados', concluido: 'Concluídos', todos: 'Todos' }

  async function construir(id: string, titulo: string, texto: string) {
    if (pendente) return
    definirPendente(id)
    definirErro(null)
    definirConquista(null)
    try {
      await aoConcluirProjeto(id)
      definirConfirmando(null)
      definirConquista({ titulo, texto, estagioAntes: estagio })
    } catch (e) { definirErro(e instanceof Error ? e.message : 'Não foi possível concluir a reconstrução.') }
    finally { definirPendente(null) }
  }
  return (
    <section className="funcionalidade-telaDoJogo" aria-label="Projetos de reconstrução">
      <header className="telaDoJogo-tituloDaSecao">
        <div><p className="secao-chamada">Cidade Livre · Projetos</p><h1 className="destaque-titulo">Legado da Cidade Livre</h1><p className="atenuado">Conquistas abrem caminhos. Você decide o que reconstruir.</p></div>
        <Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Cidade</Button>
      </header>
      <CenaDaCidade partida={partida} />
      <div className={estilos.cabecalhoProjetos}>
        <div><strong>{total} de 32 melhorias</strong><p className="atenuado">{ESTAGIOS_DA_CIDADE[estagio].nome}</p></div>
        <img className={estilos.ornamento} src={`${CAMINHO}cidade-progresso.png`} alt="" loading="lazy" decoding="async" />
      </div>
      {conquista ? <Card className={estilos.celebracao}>
        <p role="status"><strong>{conquista.titulo} restaurado!</strong> {conquista.texto}</p>
        {estagio > conquista.estagioAntes ? <p><strong>Novo estágio: {ESTAGIOS_DA_CIDADE[estagio].nome}.</strong> O panorama da cidade mudou!</p> : null}
        <Button variant="secondary" size="sm" onClick={() => definirConquista(null)}>Continuar explorando projetos</Button>
      </Card> : null}
      {erro ? <p className={estilos.erro} role="alert">{erro}</p> : null}
      {partida.vigilia.sessaoAtiva ? <p className={estilos.legadoAntigo}>Uma sessão da antiga Vigília foi arquivada na migração. O novo sistema não utiliza cronômetros e não concede novas Brasas.</p> : null}
      {partida.legado.creditosDeTransicao > 0 ? <p className={estilos.legadoAntigo}>Você possui {partida.legado.creditosDeTransicao} créditos históricos. Eles podem reduzir parte do ouro de um projeto, mas não substituem conquistas nem materiais.</p> : null}
      <nav className={estilos.filtros} aria-label="Filtrar projetos">
        {FILTROS.map(id => <Button key={id} variant={id === filtro ? 'primary' : 'secondary'} size="sm" aria-pressed={id === filtro} onClick={() => definirFiltro(id)}>{nomes[id]} ({contagem[id]})</Button>)}
      </nav>
      <div className={estilos.grade}>
        {listados.map(({ definicao: projeto, consulta }) => (
          <Card key={projeto.id} className={estilos.projeto}>
            <div className={estilos.topoProjeto}>
              <img src={`${CAMINHO}${ICONES[projeto.distrito]}`} alt="" loading="lazy" decoding="async" />
              <div><p className="secao-chamada">{DISTRITOS_DA_CIDADE.find(d => d.id === projeto.distrito)?.nome} · Nível {projeto.nivel}/4</p><h2>{projeto.nome}</h2></div>
            </div>
            <p className="atenuado">{projeto.descricao}</p>
            <p className={estilos.estado} data-situacao={consulta.situacao}>{ROTULOS[consulta.situacao]}</p>
            {consulta.requisitos.length > 0 ? <ul className={estilos.requisitos} aria-label="Conquistas necessárias">
              {consulta.requisitos.map((r, i) => <li key={`${projeto.id}-${i}`}><span aria-hidden="true">{r.cumprido ? '✓' : '◇'}</span> {r.nome} {r.cumprido ? '(concluído)' : '(pendente)'}</li>)}
            </ul> : null}
            <div className={estilos.materiais} aria-label="Materiais e recursos necessários">
              {consulta.materiais.map(mat => <div key={mat.idDaDefinicao}>
                <span>{mat.nome}</span><strong>{Math.min(mat.possuido, mat.quantidade)}/{mat.quantidade}</strong>
                <div className={estilos.barraMaterial}><div className={estilos.barraMaterialPreenchida} style={{ width: `${Math.min(100, mat.possuido / mat.quantidade * 100)}%` }} /></div>
              </div>)}
              <div className={estilos.linhaOuro}><span>Ouro</span><strong>{consulta.ouroDisponivel}/{consulta.ouroNecessario}</strong></div>
              {consulta.descontoEmOuro > 0 ? <small>Desconto de {consulta.descontoEmOuro} ouro por {consulta.creditosAplicaveis} créditos históricos.</small> : null}
            </div>
            {consulta.situacao === 'pronto' ? (
              confirmando === projeto.id ? <div className={estilos.confirmacao}>
                <p>Confirmar a entrega dos materiais do inventário e banco e o pagamento de {consulta.ouroNecessario} moedas?</p>
                <Button disabled={pendente !== null} variant="primary" onClick={() => void construir(projeto.id, projeto.nome, projeto.conclusao)}>Confirmar restauração</Button>
                <Button disabled={pendente !== null} variant="secondary" onClick={() => definirConfirmando(null)}>Cancelar</Button>
              </div> : <Button disabled={pendente !== null} variant="primary" onClick={() => definirConfirmando(projeto.id)}>Restaurar construção</Button>
            ) : consulta.situacao === 'concluido' ? <p className={estilos.concluido}>✓ Construção concluída</p>
              : <p className="atenuado">{consulta.motivo}</p>}
          </Card>
        ))}
      </div>
      {listados.length === 0 ? <Card className={estilos.estadoVazio}><p>Nenhum projeto neste filtro. Explore outros distritos ou continue sua Jornada.</p></Card> : null}
    </section>
  )
}
