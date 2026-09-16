import { useState } from 'react'
import {
  NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM,
  PONTOS_DE_PRESTIGIO_POR_NIVEL,
  ROTULOS_DOS_RAMOS_DE_PRESTIGIO,
  ROTULOS_DOS_HIBRIDOS_DE_PRESTIGIO,
  NOS_DE_PRESTIGIO,
  RAMOS_PUROS_DE_PRESTIGIO,
  obterProntidaoParaPrestigioDoPersonagem,
  obterDisponibilidadeDoNoDePrestigio,
  type PartidaLocal,
  type DefinicaoDeNoDePrestigio,
  type RamoPuroDePrestigio,
} from '@greywake/dominio'

type PropriedadesDePainelDePrestigio = {
  partida: PartidaLocal
  aoRealizarPrestigio: () => Promise<void>
  aoDesbloquearNo: (noId: string) => Promise<void>
}

const hibridoCaminhos = ["corpo-arcano", "corpo-espirito", "tecnica-arcano", "tecnica-espirito"] as const
const prestigioNivelRotulos = ['I', 'II', 'III'] as const

export default function PainelDePrestigio({ partida, aoRealizarPrestigio, aoDesbloquearNo }: PropriedadesDePainelDePrestigio) {
  const [idDoNoPendente, definirPendenteNoId] = useState<string | null>(null)
  const [confirmandoPrestigio, definirConfirmandoPrestigio] = useState(false)
  const [ehRealizandoPrestigio, definirEhRealizandoPrestigio] = useState(false)
  const prontidao = obterProntidaoParaPrestigioDoPersonagem(partida)
  const prestigio = partida.personagem.prestigio
  const obtidoPontos = prestigio.nivel * PONTOS_DE_PRESTIGIO_POR_NIVEL
  const gastoPontos = Math.max(0, obtidoPontos - prestigio.pontos)
  const possuiAtivoTrabalho = Boolean(partida.ocioso.atividadeAtiva || partida.fabricacao.receitaAtiva)
  const podeRealizarPrestigio = prontidao.pronto && prestigio.nivel < NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM && !possuiAtivoTrabalho
  const proximoPrestigioRotulo = prestigioNivelRotulos[prestigio.nivel] ?? '—'

  const portaoTitulo = !prontidao.pronto
    ? 'Árvore bloqueada'
    : prestigio.nivel >= NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM
      ? 'Prestígio completo'
      : prestigio.nivel > 0
        ? 'Árvore ativa'
        : 'Prestígio I aguardando confirmação'
  const portaoTexto = !prontidao.pronto
    ? "O Prestígio do personagem só abre quando todas as Profissões alcançam Prestígio I."
    : prestigio.nivel >= NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM
      ? "Os três ciclos do personagem foram realizados; os 15 pontos permanecem disponíveis para a versão."
      : possuiAtivoTrabalho
        ? "Interrompa a atividade automática ou a produção antes de reiniciar a jornada do personagem."
        : prestigio.nivel > 0
          ? 'Nós disponíveis respeitam os caminhos e os custos definidos no GDD.'
          : "Todas as Profissões já estão prontas. Confirme o primeiro Prestígio para receber 5 pontos."

  async function desbloquear(noId: string) {
    if (idDoNoPendente) return
    definirPendenteNoId(noId)
    try {
      await aoDesbloquearNo(noId)
    } finally {
      definirPendenteNoId(null)
    }
  }

  async function realizarPrestigio() {
    if (!podeRealizarPrestigio || ehRealizandoPrestigio) return
    definirEhRealizandoPrestigio(true)
    try {
      await aoRealizarPrestigio()
      definirConfirmandoPrestigio(false)
    } finally {
      definirEhRealizandoPrestigio(false)
    }
  }

  return (
    <section className="prestigio-telaDoJogo" aria-labelledby="prestigio-titulo">
      <div className="prestigio-resumo painel">
        <div>
          <p className="secao-chamada">Progressão permanente</p>
          <h2 id="prestigio-titulo">Árvore de Prestígio</h2>
          <p className="atenuado">Escolha uma expressão de configuração. Os pontos permanecem entre os ciclos do personagem.</p>
        </div>
        <div className="prestigio-total" aria-label={`${prestigio.pontos} pontos de Prestígio disponíveis de ${obtidoPontos}`}>
          <strong>{prestigio.pontos}</strong>
          <span>pontos disponíveis</span>
          <small>{gastoPontos} gastos · {obtidoPontos}/15 conquistados</small>
        </div>
      </div>

      <div className={`prestigio-portao painel${prontidao.pronto && prestigio.nivel > 0 ? " prestigio-portao--pronto" : ''}`}>
        <div className="prestigio-portaoPrincipal">
          <p className="secao-chamada">Requisito da árvore</p>
          <h3>{portaoTitulo}</h3>
          <p className="atenuado">{portaoTexto}</p>
        </div>
        <div className="prestigio-portaoAcoes">
          <strong className="prestigio-prontidao">{prontidao.profissoesProntas}/{prontidao.totalDeProfissoes} Profissões em Prestígio I</strong>
          {prontidao.pronto && prestigio.nivel < NIVEL_MAXIMO_DE_PRESTIGIO_DO_PERSONAGEM ? (
            <button
              className="principal-botao compacto"
              type="button"
              disabled={!podeRealizarPrestigio || confirmandoPrestigio || ehRealizandoPrestigio}
              onClick={() => definirConfirmandoPrestigio(true)}
            >
              Preparar Prestígio {proximoPrestigioRotulo}
            </button>
          ) : null}
        </div>
        {confirmandoPrestigio ? (
          <div className="prestigio-confirmacao" role="group" aria-labelledby="prestigio-confirmacao-titulo">
            <p id="prestigio-confirmacao-titulo"><strong>Reinício permanente da jornada.</strong> O nível e os atributos normais voltam ao início; Profissões, equipamentos, inventário e nós já desbloqueados permanecem.</p>
            <div className="botao-linhaDeDados">
              <button className="discreto-botao compacto" type="button" disabled={ehRealizandoPrestigio} onClick={() => definirConfirmandoPrestigio(false)}>Cancelar</button>
              <button className="principal-botao compacto" type="button" disabled={!podeRealizarPrestigio || ehRealizandoPrestigio} onClick={() => void realizarPrestigio()}>{ehRealizandoPrestigio ? 'Aplicando…' : `Confirmar Prestígio ${proximoPrestigioRotulo}`}</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="prestigio-ramo-gradeVisual">
        {RAMOS_PUROS_DE_PRESTIGIO.map((ramo) => (
          <RamoDePrestigio
            key={ramo}
            ramo={ramo}
            partida={partida}
            idDoNoPendente={idDoNoPendente}
            aoDesbloquear={desbloquear}
          />
        ))}
      </div>

      <article className="painel prestigio-hibrido-painel">
        <div className="painel-tituloDaSecao">
          <div>
            <p className="secao-chamada">Caminhos híbridos</p>
            <h3>Combinações</h3>
          </div>
          <span className="situacao-selo">8 nós · 4 caminhos</span>
        </div>
        <div className="prestigio-hibrido-gradeVisual">
          {hibridoCaminhos.map((caminho) => (
            <div className="prestigio-hibrido-caminho" key={caminho}>
              <h4>{ROTULOS_DOS_HIBRIDOS_DE_PRESTIGIO[caminho]}</h4>
              {NOS_DE_PRESTIGIO.filter((no) => no.caminhoHibrido === caminho).map((no) => (
                <NoDePrestigio
                  key={no.id}
                  no={no}
                  partida={partida}
                  idDoNoPendente={idDoNoPendente}
                  aoDesbloquear={desbloquear}
                />
              ))}
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

function RamoDePrestigio({
  ramo,
  partida,
  idDoNoPendente,
  aoDesbloquear,
}: {
  ramo: RamoPuroDePrestigio
  partida: PartidaLocal
  idDoNoPendente: string | null
  aoDesbloquear: (noId: string) => Promise<void>
}) {
  const nos = NOS_DE_PRESTIGIO.filter((no) => no.tipo === "puro" && no.grupo === ramo)

  return (
    <article className={`painel prestigio-ramo prestigio-ramo--${ramo}`}>
      <div className="prestigio-ramo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Ramo puro</p>
          <h3>{ROTULOS_DOS_RAMOS_DE_PRESTIGIO[ramo]}</h3>
        </div>
        <span>{nos.filter((no) => partida.personagem.prestigio.idsDosNosDesbloqueados.includes(no.id)).length}/6</span>
      </div>
      <div className="prestigio-no-listar">
        {nos.map((no) => (
          <NoDePrestigio
            key={no.id}
            no={no}
            partida={partida}
            idDoNoPendente={idDoNoPendente}
            aoDesbloquear={aoDesbloquear}
          />
        ))}
      </div>
    </article>
  )
}

function NoDePrestigio({
  no,
  partida,
  idDoNoPendente,
  aoDesbloquear,
}: {
  no: DefinicaoDeNoDePrestigio
  partida: PartidaLocal
  idDoNoPendente: string | null
  aoDesbloquear: (noId: string) => Promise<void>
}) {
  const disponibilidade = obterDisponibilidadeDoNoDePrestigio(partida, no.id)
  const pendente = idDoNoPendente === no.id
  const situacaoRotulo = disponibilidade.situacao === "desbloqueado"
    ? 'Desbloqueado'
    : disponibilidade.situacao === "disponivel"
      ? `Desbloquear · ${no.custo} pt`
      : disponibilidade.motivo

  return (
    <button
      className={`prestigio-no prestigio-no--${disponibilidade.situacao}`}
      type="button"
      disabled={disponibilidade.situacao !== "disponivel" || Boolean(idDoNoPendente)}
      aria-pressed={disponibilidade.situacao === "desbloqueado"}
      aria-label={`${no.nome}: ${no.descricao}. ${situacaoRotulo}`}
      onClick={() => void aoDesbloquear(no.id)}
    >
      <span className="prestigio-noCamada">{no.camada}</span>
      <span className="prestigio-noTexto">
        <strong>{no.nome}</strong>
        <small>{no.descricao}</small>
      </span>
      <span className="prestigio-noDetalhesAdicionais">{pendente ? 'Salvando…' : situacaoRotulo}</span>
    </button>
  )
}
