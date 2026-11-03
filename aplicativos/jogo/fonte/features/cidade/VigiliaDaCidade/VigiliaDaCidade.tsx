/**
 * Cidade evolutiva: cena SVG leve, sessões de foco e melhorias.
 * Os botões enviam intenções à aplicação; somente o domínio altera o save.
 */
import { useEffect, useMemo, useState } from 'react'
import { Button, Card, ProgressBar, TextField } from '@/components/ui'
import { DISTRITOS_DA_CIDADE, ESTAGIOS_DA_CIDADE, CENAS_DA_CIDADE } from '@greywake/conteudo'
import {
  calcularBrasasDaVigilia, consultarMelhoria, obterEstagioDaCidade,
  obterTotalDeMelhorias, segundosRestantesDaVigilia, LIMIARES_DOS_ESTAGIOS,
  type IdDoDistrito, type PartidaLocal,
} from '@greywake/dominio'
import estilos from './VigiliaDaCidade.module.css'

export interface AcoesDaVigilia {
  aoIniciarVigilia: (nome: string, duracaoMinutos: number) => Promise<void>
  aoConcluirVigilia: (idDaSessao: string) => Promise<void>
  aoCancelarVigilia: (idDaSessao: string) => Promise<void>
  aoMelhorarDistrito: (id: IdDoDistrito) => Promise<void>
}

interface PropsCena {
  partida: PartidaLocal
  aoSelecionarDistrito?: (id: IdDoDistrito) => void
}

const ICONES_DOS_DISTRITOS: Record<IdDoDistrito, string> = {
  praca: 'cidade-reconstrucao.png',
  taverna: 'icone-taverna.png',
  ferreiro: 'icone-ferreiro.png',
  mercado: 'icone-mercado.png',
  banco: 'icone-banco.png',
  relicario: 'icone-relicario.png',
  codice: 'icone-codice.png',
  muralhas: 'cidade-reconstrucao.png',
}
const caminhoIcone = (nome: string) => `/arte/cidade/interface/${nome}`

const POSICOES: Record<IdDoDistrito, { x: number; y: number; largura: number; altura: number }> = {
  praca: { x: 414, y: 331, largura: 122, altura: 72 },
  taverna: { x: 174, y: 238, largura: 142, altura: 100 },
  ferreiro: { x: 142, y: 366, largura: 120, altura: 92 },
  mercado: { x: 632, y: 337, largura: 138, altura: 80 },
  banco: { x: 290, y: 373, largura: 110, altura: 77 },
  relicario: { x: 787, y: 259, largura: 105, altura: 107 },
  codice: { x: 601, y: 190, largura: 137, altura: 113 },
  muralhas: { x: 398, y: 200, largura: 116, altura: 88 },
}

/** Renderiza apenas a arte do estágio atual; sem arquivos finais, utiliza o SVG próprio. */
export function CenaDaCidade({ partida, aoSelecionarDistrito }: PropsCena) {
  const estagio = obterEstagioDaCidade(partida.vigilia)
  const cena = CENAS_DA_CIDADE.find(item => item.estagio === estagio)
  return (
    <div className={`${estilos.cena} ${estilos[`estagio${estagio}`]}`}>
      {cena?.disponivel ? (
        <picture className={estilos.imagemResponsiva}>
          <source media="(max-width: 720px)" srcSet={`/arte/cidade/mobile/cidade-estagio-${estagio}-mobile.webp`} type="image/webp" />
          <img className={estilos.imagemFinal} src={cena.caminho} alt={`Cidade Livre: ${ESTAGIOS_DA_CIDADE[estagio].nome}`} loading="lazy" decoding="async" />
        </picture>
      ) : (
        <svg className={estilos.ilustracao} viewBox="0 0 960 540" role="img" aria-label={`Vista da Cidade Livre em ${ESTAGIOS_DA_CIDADE[estagio].nome}`}>
          <defs>
            <linearGradient id="gw-ceu-vigilia" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" className={estilos.ceuTopo} />
              <stop offset="1" className={estilos.ceuBase} />
            </linearGradient>
          </defs>
          <rect width="960" height="540" fill="url(#gw-ceu-vigilia)" />
          <path className={estilos.montanhasDistantes} d="M0 268 L96 165 161 224 291 125 392 223 502 136 621 235 735 129 856 230 960 157 V540 H0Z" />
          <path className={estilos.montanhasProximas} d="M0 312 L143 228 238 302 358 225 458 282 594 233 760 290 891 208 960 282 V540 H0Z" />
          <ellipse cx="480" cy="459" rx="550" ry="163" className={estilos.terra} />
          <path className={estilos.estrada} d="M430 540 Q468 461 484 378 Q520 345 960 383 L960 540Z" />
          <path className={estilos.muralha} d="M88 323 L138 254 310 213 437 231 525 201 757 235 868 276 915 335 L911 382 845 333 710 291 519 282 338 296 202 319 106 379Z" />
          {DISTRITOS_DA_CIDADE.map(distrito => {
            const posicao = POSICOES[distrito.id]
            const nivel = partida.vigilia.distritos[distrito.id]
            const paredeY = posicao.y + posicao.altura * 0.32
            const topo = posicao.y - posicao.altura * 0.06
            return (
              <g key={distrito.id} className={nivel ? estilos.restaurado : estilos.ruina}>
                <ellipse cx={posicao.x + posicao.largura / 2} cy={posicao.y + posicao.altura + 5} rx={posicao.largura * 0.7} ry="12" className={estilos.sombra} />
                <rect x={posicao.x} y={paredeY} width={posicao.largura} height={posicao.altura * 0.68} rx="4" className={estilos.parede} />
                <polygon points={`${posicao.x - 12},${paredeY} ${posicao.x + posicao.largura / 2},${topo} ${posicao.x + posicao.largura + 12},${paredeY}`} className={estilos.telhado} />
                <rect x={posicao.x + posicao.largura * 0.42} y={posicao.y + posicao.altura * 0.63} width={posicao.largura * 0.16} height={posicao.altura * 0.37} className={estilos.porta} />
                {nivel >= 1 ? (
                  <>
                    <rect x={posicao.x + posicao.largura * 0.17} y={posicao.y + posicao.altura * 0.52} width="16" height="21" className={estilos.janela} />
                    <rect x={posicao.x + posicao.largura * 0.71} y={posicao.y + posicao.altura * 0.52} width="16" height="21" className={estilos.janela} />
                  </>
                ) : <path d={`M${posicao.x + 12} ${paredeY + 10} l18 16 -8 12`} className={estilos.rachadura} />}
                {nivel >= 2 ? <path d={`M${posicao.x + 10} ${paredeY - 6} h${posicao.largura - 20}`} className={estilos.detalhe} /> : null}
                {nivel >= 3 ? <circle cx={posicao.x + posicao.largura - 5} cy={posicao.y + posicao.altura * 0.7} r="9" className={estilos.lanterna} /> : null}
                {nivel >= 4 ? <path d={`M${posicao.x + posicao.largura * 0.5} ${topo} v-29 l27 9 -27 9Z`} className={estilos.bandeira} /> : null}
              </g>
            )
          })}
          {estagio >= 1 ? <g className={estilos.luzes}><circle cx="393" cy="398" r="7" /><circle cx="552" cy="414" r="7" /></g> : null}
          {estagio >= 2 ? <g className={estilos.luzes}><circle cx="598" cy="478" r="5" /><circle cx="215" cy="472" r="5" /></g> : null}
          {estagio >= 3 ? <path d="M19 395 Q240 460 397 419 M577 405 Q786 431 949 388" className={estilos.caminhosRestaurados} /> : null}
          {estagio >= 4 ? <g className={estilos.luzes}><circle cx="460" cy="481" r="11" /><circle cx="716" cy="458" r="7" /><circle cx="95" cy="410" r="7" /></g> : null}
        </svg>
      )}
      {cena?.camadas.filter(camada => camada.disponivel && partida.vigilia.distritos[camada.id] >= camada.nivelMinimo).map(camada => (
        <img key={camada.id} className={estilos.imagemCamada} src={camada.caminho} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      ))}
      {aoSelecionarDistrito && !cena?.disponivel ? (
        <div className={estilos.hotspots}>
          {DISTRITOS_DA_CIDADE.map(distrito => {
            const posicao = POSICOES[distrito.id]
            return (
              <Button
                key={distrito.id}
                variant="ghost"
                size="sm"
                className={estilos.hotspot}
                title={`Restaurar ${distrito.nome}`}
                aria-label={`Ver melhorias: ${distrito.nome}, nível ${partida.vigilia.distritos[distrito.id]}`}
                style={{ left: `${(posicao.x + posicao.largura / 2) / 960 * 100}%`, top: `${(posicao.y + posicao.altura / 2) / 540 * 100}%` }}
                onClick={() => aoSelecionarDistrito(distrito.id)}
              >
                {partida.vigilia.distritos[distrito.id]}
              </Button>
            )
          })}
        </div>
      ) : null}
      <div className={estilos.legenda} aria-hidden="true"><img className={estilos.emblemaDaCidade} src={caminhoIcone(`emblema-estagio-${estagio}.png`)} alt="" loading="lazy" decoding="async" />{ESTAGIOS_DA_CIDADE[estagio].nome}</div>
    </div>
  )
}

export function ResumoDaCidade({ partida, aoAbrirVigilia, aoAbrirReconstrucao }: {
  partida: PartidaLocal
  aoAbrirVigilia: () => void
  aoAbrirReconstrucao: () => void
}) {
  const estagio = obterEstagioDaCidade(partida.vigilia)
  const total = obterTotalDeMelhorias(partida.vigilia)
  const proximo = LIMIARES_DOS_ESTAGIOS[estagio + 1]
  return (
    <div className={estilos.resumo}>
      <CenaDaCidade partida={partida} aoSelecionarDistrito={() => aoAbrirReconstrucao()} />
      <Card className={estilos.resumoTexto}>
        <p className="secao-chamada"><img className={estilos.iconeDecorativo} src={caminhoIcone("cidade-reconstrucao.png")} alt="" loading="lazy" decoding="async" /> Cidade Livre · Reconstrução</p>
        <h2>{ESTAGIOS_DA_CIDADE[estagio].nome}</h2>
        <p className="atenuado">{ESTAGIOS_DA_CIDADE[estagio].descricao}</p>
        <div className={estilos.metricas}>
          <span><img className={estilos.iconeDecorativo} src={caminhoIcone("vigilia-brasa.png")} alt="" loading="lazy" decoding="async" /><strong>{partida.vigilia.saldoBrasas}</strong> Brasas disponíveis</span>
          <span><strong>{total}</strong> melhorias realizadas</span>
        </div>
        {proximo !== undefined ? <div className={estilos.progressoComArte}><img src={caminhoIcone("cidade-progresso.png")} className={estilos.decoracaoDoProgresso} alt="" loading="lazy" decoding="async" /><ProgressBar label="Progresso da restauração" value={total - LIMIARES_DOS_ESTAGIOS[estagio]} max={proximo - LIMIARES_DOS_ESTAGIOS[estagio]} /></div> : <p role="status">Cidade reerguida — estágio máximo!</p>}
        <div className={estilos.acoes}>
          <Button variant="primary" onClick={aoAbrirVigilia}>Iniciar Vigília</Button>
          <Button variant="secondary" onClick={aoAbrirReconstrucao}>Restaurar distritos</Button>
        </div>
        {partida.vigilia.sessaoAtiva ? <p role="status" className="atenuado">Existe uma sessão de foco aguardando conclusão ou cancelamento.</p> : null}
      </Card>
    </div>
  )
}

function formatarRelogio(segundos: number) {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  return `${h ? `${String(h).padStart(2, '0')}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TelaDaVigilia({ partida, aoVoltar, aoIniciarVigilia, aoConcluirVigilia, aoCancelarVigilia }: {
  partida: PartidaLocal
  aoVoltar: () => void
  aoIniciarVigilia: AcoesDaVigilia['aoIniciarVigilia']
  aoConcluirVigilia: AcoesDaVigilia['aoConcluirVigilia']
  aoCancelarVigilia: AcoesDaVigilia['aoCancelarVigilia']
}) {
  const [nome, definirNome] = useState('Estudar')
  const [duracao, definirDuracao] = useState(25)
  const [personalizada, definirPersonalizada] = useState('30')
  const [agoraMs, definirAgoraMs] = useState(() => Date.now())
  const [pendente, definirPendente] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const ativa = partida.vigilia.sessaoAtiva
  useEffect(() => {
    if (!ativa) return
    let temporizador: number | undefined
    const sincronizar = () => {
      window.clearInterval(temporizador)
      definirAgoraMs(Date.now())
      if (!document.hidden) temporizador = window.setInterval(() => definirAgoraMs(Date.now()), 1000)
    }
    sincronizar()
    document.addEventListener('visibilitychange', sincronizar)
    return () => { window.clearInterval(temporizador); document.removeEventListener('visibilitychange', sincronizar) }
  }, [ativa?.id])
  const restante = ativa ? segundosRestantesDaVigilia(ativa, agoraMs) : 0
  const progresso = ativa ? Math.round(100 * (1 - restante / (ativa.duracaoMinutos * 60))) : 0
  const recompensa = calcularBrasasDaVigilia(ativa?.duracaoMinutos ?? duracao)
  async function executar(acao: () => Promise<void>) {
    if (pendente) return
    definirPendente(true)
    definirErro(null)
    try { await acao() }
    catch (falha) { definirErro(falha instanceof Error ? falha.message : 'Não foi possível concluir a ação.') }
    finally { definirPendente(false) }
  }
  return (
    <section className="funcionalidade-telaDoJogo" aria-label="Vigília da Cidade">
      <header className="telaDoJogo-tituloDaSecao">
        <div><p className="secao-chamada">Cidade · Concentração</p><h1 className="destaque-titulo">Vigília da Cidade</h1><p className="atenuado">Seu tempo de foco ajuda a reconstruir a Cidade Livre.</p></div>
        <Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Cidade</Button>
      </header>
      <div className={estilos.painelDaVigilia}>
        <CenaDaCidade partida={partida} />
        <Card className={estilos.controleDaVigilia}>
          {ativa ? (
            <>
              <p className="secao-chamada"><img className={estilos.iconeDecorativo} src={caminhoIcone("vigilia-cronometro.png")} alt="" loading="lazy" decoding="async" />{restante === 0 ? 'Sessão pronta para confirmar' : 'Concentração em andamento'}</p>
              <h2>{ativa.nome}</h2>
              <output className={estilos.relogio} aria-live="off" aria-label={`${restante} segundos restantes`}>{formatarRelogio(restante)}</output>
              <ProgressBar label="Tempo de concentração" value={progresso} max={100} />
              <p className="atenuado">Recompensa: {calcularBrasasDaVigilia(ativa.duracaoMinutos)} Brasas</p>
              <div className={estilos.acoes}>
                {restante === 0 ? <Button disabled={pendente} onClick={() => void executar(() => aoConcluirVigilia(ativa.id))}>Concluir e receber</Button> : null}
                <Button variant="danger" disabled={pendente} onClick={() => void executar(() => aoCancelarVigilia(ativa.id))}>Cancelar sem recompensa</Button>
              </div>
              <p className="atenuado">Se fechar o jogo, a sessão continuará registrada. Ao voltar, confirme a conclusão para receber as Brasas.</p>
            </>
          ) : (
            <>
              <p className="secao-chamada"><img className={estilos.iconeDecorativo} src={caminhoIcone("vigilia-cronometro.png")} alt="" loading="lazy" decoding="async" /> Assumir vigília</p>
              <TextField label="Nome da sessão" value={nome} maxLength={80} onChange={evento => definirNome(evento.target.value)} />
              <div className={estilos.duracoes} role="group" aria-label="Duração de concentração">
                {[15, 25, 45, 60].map(minutos => (
                  <Button key={minutos} variant={duracao === minutos ? 'primary' : 'secondary'} aria-pressed={duracao === minutos} onClick={() => definirDuracao(minutos)}>{minutos} min</Button>
                ))}
              </div>
              <TextField label="Duração personalizada (10–120 minutos)" type="number" min={10} max={120} value={personalizada} onChange={evento => definirPersonalizada(evento.target.value)} />
              <Button variant="ghost" size="sm" onClick={() => { const valor = Number(personalizada); if (Number.isInteger(valor) && valor >= 10 && valor <= 120) { definirDuracao(valor); definirErro(null) } else definirErro('Digite um número inteiro entre 10 e 120.') }}>Usar duração personalizada</Button>
              <p className="atenuado"><img className={estilos.iconeDecorativo} src={caminhoIcone("vigilia-brasa.png")} alt="" loading="lazy" decoding="async" />{duracao} minutos de foco · {recompensa} Brasas ao concluir</p>
              <Button disabled={pendente} onClick={() => void executar(() => aoIniciarVigilia(nome, duracao))}>Iniciar Vigília</Button>
              <p className="atenuado">O jogo offline não consegue verificar o uso de outros aplicativos. Use esta sessão como compromisso pessoal.</p>
            </>
          )}
          {erro ? <p role="alert" className={estilos.erro}>{erro}</p> : null}
          <p className="atenuado">Sessões concluídas: {partida.vigilia.sessoesConcluidas} · Minutos de foco: {partida.vigilia.minutosDeFoco}</p>
        </Card>
      </div>
      {partida.vigilia.historico.length ? <Card className={estilos.historico}><h2>Últimas sessões</h2><ul>{[...partida.vigilia.historico].reverse().slice(0, 8).map(registro => <li key={registro.id}>{registro.nome}: {registro.duracaoMinutos} min · {registro.resultado} · +{registro.brasasRecebidas} Brasas</li>)}</ul></Card> : null}
    </section>
  )
}

export function PainelDeReconstrucao({ partida, aoVoltar, aoMelhorarDistrito }: {
  partida: PartidaLocal
  aoVoltar: () => void
  aoMelhorarDistrito: AcoesDaVigilia['aoMelhorarDistrito']
}) {
  const [pendente, definirPendente] = useState<IdDoDistrito | null>(null)
  const [erro, definirErro] = useState<string | null>(null)
  const estagio = useMemo(() => obterEstagioDaCidade(partida.vigilia), [partida.vigilia])
  async function melhorar(id: IdDoDistrito) {
    if (pendente) return
    definirPendente(id)
    definirErro(null)
    try { await aoMelhorarDistrito(id) }
    catch (falha) { definirErro(falha instanceof Error ? falha.message : 'Não foi possível restaurar o distrito.') }
    finally { definirPendente(null) }
  }
  return (
    <section className="funcionalidade-telaDoJogo">
      <header className="telaDoJogo-tituloDaSecao">
        <div><p className="secao-chamada">Cidade · Reconstrução</p><h1 className="destaque-titulo">Restaurar a Cidade Livre</h1><p className="atenuado">{ESTAGIOS_DA_CIDADE[estagio].nome} · {partida.vigilia.saldoBrasas} Brasas disponíveis</p></div>
        <Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Cidade</Button>
      </header>
      <CenaDaCidade partida={partida} />
      {erro ? <p role="alert" className={estilos.erro}>{erro}</p> : null}
      <div className={estilos.gradeDistritos}>
        {DISTRITOS_DA_CIDADE.map(distrito => {
          const melhoria = consultarMelhoria(partida.vigilia, distrito)
          return (
            <Card key={distrito.id} className={estilos.cartaoDistrito}>
              <p className="secao-chamada">Nível {melhoria.nivelAtual} / 4</p>
              <h2 className={estilos.tituloDistrito}><img className={estilos.iconeDistrito} src={caminhoIcone(ICONES_DOS_DISTRITOS[distrito.id])} alt="" loading="lazy" decoding="async" />{distrito.nome}</h2>
              <p className="atenuado">{distrito.descricao}</p>
              <Button variant="secondary" disabled={!melhoria.permitido || pendente !== null} onClick={() => void melhorar(distrito.id)}>{melhoria.custo === null ? 'Concluído' : `Restaurar · ${melhoria.custo} Brasas`}</Button>
              {!melhoria.permitido ? <p className="atenuado">{melhoria.motivo}</p> : null}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
