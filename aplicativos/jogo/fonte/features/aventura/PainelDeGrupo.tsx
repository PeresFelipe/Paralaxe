import type { PersistirAlteracaoDaPartida } from "@/services/alteracoesDaPartida"
/** @file Grupo, formação e prévia tática não-canônica até a segunda Masmorra. */
import { useState } from 'react'
import {
  obterDefinicaoDeConsumivelDeCombate, obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidadeDeCombate, obterDefinicaoDeInimigo, obterDefinicaoDeParceiro,
} from '@paralaxe/conteudo'
import {
  configurarFormacaoDoGrupo, recrutarMira, simularCombateEmGrupo, ID_DE_MIRA,
  type DefinicaoDeParceiroDeCombate, type PartidaLocal, type ResultadoDeCombateEmGrupo,
} from '@paralaxe/dominio'
import { Button, Card } from '@/components/ui'
import estilos from './PainelDeGrupo.module.css'

interface Propriedades {
  partida: PartidaLocal
  aoPersistir: PersistirAlteracaoDaPartida
  aoVoltar: () => void
}
const catalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
}
/** Combatentes não narrativos usados só para demonstrar Provocação e cura. */
const TREINO: readonly DefinicaoDeParceiroDeCombate[] = [
  { id: 'treino.guardiao', nome: 'Guardião de treinamento', papel: 'guardiao',
    vidaMaxima: 210, defesa: 25, evasao: 95, precisao: 105, poder: 9,
    intervaloDeAcaoEmSegundos: 2.2, chanceDeCritico: 0.03 },
  { id: 'treino.curandeiro', nome: 'Curandeira de treinamento', papel: 'curandeiro',
    vidaMaxima: 100, defesa: 7, evasao: 110, precisao: 100, poder: 12,
    intervaloDeAcaoEmSegundos: 2.6, chanceDeCritico: 0.05 },
]
const NOMES_DOS_MARCOS: Record<PartidaLocal['grupo']['marcoDeMira'], string> = {
  'desconhecida': 'Ainda não encontrada',
  'rastros-na-segunda-masmorra': 'Sinais de uma exploradora',
  'encontro-em-combate': 'Encontro em combate',
  'cooperacao-temporaria': 'Cooperação temporária',
  'divergencia-sobre-monstros': 'Uma divergência registrada',
  'chefe-em-dupla': 'Chefe enfrentado em dupla',
  'reencontro-na-taverna': 'Reencontro na Taverna',
  'recrutavel': 'Recrutamento disponível',
}

export default function PainelDeGrupo({ partida, aoPersistir, aoVoltar }: Propriedades) {
  const [ocupado, definirOcupado] = useState(false)
  const [resultado, definirResultado] = useState<ResultadoDeCombateEmGrupo | null>(null)
  const [mensagem, definirMensagem] = useState<string | null>(null)
  const mira = partida.grupo.parceiros[ID_DE_MIRA]
  const ativos = partida.grupo.idsDosParceirosAtivos
  const disponivel = partida.masmorra.dunLiathFacilConquistado
  const emRisco = Boolean(partida.masmorra.expedicaoAtiva || partida.masmorra.incursaoAutomaticaAtiva)
  const miraConhecida = partida.grupo.marcoDeMira !== 'desconhecida'

  async function alternarMira() {
    if (ocupado || emRisco || !mira?.recrutado) return
    definirOcupado(true)
    try {
      await aoPersistir(atual => {
        const formacao = atual.grupo.idsDosParceirosAtivos
        const novo = formacao.includes(ID_DE_MIRA) ? formacao.filter(id => id !== ID_DE_MIRA) : [...formacao, ID_DE_MIRA]
        return configurarFormacaoDoGrupo(atual, novo, new Date().toISOString())
      }, 'Formação de Grupo atualizada.')
      definirMensagem('Formação salva.')
      definirResultado(null)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível alterar a formação.')
    } finally {
      definirOcupado(false)
    }
  }

  async function tratarRecrutarMira() {
    if (ocupado || emRisco || partida.grupo.marcoDeMira !== 'recrutavel') return
    definirOcupado(true)
    try {
      await aoPersistir(atual => recrutarMira(atual, new Date().toISOString()), 'Mira foi recrutada.')
      definirMensagem('Mira é agora uma parceira recrutada. Escolha incluí-la na formação.')
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível recrutar Mira.')
    } finally {
      definirOcupado(false)
    }
  }

  function ensaiar() {
    if (ocupado || !disponivel || emRisco) return
    try {
      const definidos = ativos.map(id => obterDefinicaoDeParceiro(id))
      const membros = definidos.every((p): p is DefinicaoDeParceiroDeCombate => Boolean(p))
        ? definidos.filter((p): p is DefinicaoDeParceiroDeCombate => Boolean(p))
        : []
      // Sem grupo recrutado, demonstra a mecânica com dois combatentes hipotéticos, sem alterar o save.
      const demonstracao = membros.length === 0
      const selecionados = demonstracao ? TREINO : membros
      const simulado = simularCombateEmGrupo(partida, catalogo, 'inimigo.crubach',
        selecionados, Date.now() >>> 0, 90, demonstracao)
      definirResultado(simulado)
      definirMensagem('Ensaio encerrado. Nenhum XP, item, contrato ou relação foi alterado.')
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível executar o ensaio.')
    }
  }

  return (
    <section className="funcionalidade-telaDoJogo" aria-labelledby="grupo-titulo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Aventura · Grupo</p>
          <h2 id="grupo-titulo" className="destaque-titulo">Formação e Ameaça</h2>
          <p className="atenuado">O personagem lidera até três parceiros. Inimigos tendem a mirar o maior valor de Ameaça.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={aoVoltar}>Voltar à Aventura</Button>
      </div>
      <div className={estilos.grade ?? ""}>
        <Card appearance="framed" className={estilos.painel ?? ""}>
          <p className="secao-chamada">Seu grupo</p>
          <h3>{ativos.length}/3 parceiros</h3>
          <ol className={estilos.formacao} aria-label="Ordem da formação">
            <li><span>Líder</span><strong>{partida.personagem.nome}</strong></li>
            {[0, 1, 2].map(indice => {
              const id = ativos[indice]
              return <li key={indice}><span>Parceiro · posição {indice + 1}</span><strong>{id ? obterDefinicaoDeParceiro(id)?.nome ?? id : 'Espaço livre'}</strong></li>
            })}
          </ol>
          {ativos.length === 0 ? <p className="atenuado">Nenhum parceiro ativo.</p> : null}
          <div className="informacao-linhaDeDados">
            <span>{miraConhecida ? 'Mira' : 'Primeira parceira'}</span>
            <strong>{NOMES_DOS_MARCOS[partida.grupo.marcoDeMira]}</strong>
          </div>
          {miraConhecida ? (
            <p className="atenuado">
              Mira é ex-soldada e arqueira. Olho de Caçadora acrescenta +5 pontos
              percentuais de crítico ao Grupo (parâmetro provisório).
            </p>
          ) : (
            <p className="atenuado">A primeira parceira será apresentada pelos eventos da próxima Masmorra.</p>
          )}
          <div className="informacao-linhaDeDados">
            <span>Vínculo</span>
            <strong>{mira?.vinculo ?? 'desconhecido'}</strong>
          </div>
          {!mira?.recrutado && partida.grupo.marcoDeMira === 'recrutavel' ? (
            <Button size="sm" variant="primary" disabled={ocupado || emRisco}
              onClick={() => void tratarRecrutarMira()}>Recrutar Mira</Button>
          ) : (
            <Button size="sm" variant="secondary" disabled={ocupado || emRisco || !mira?.recrutado}
              onClick={() => void alternarMira()}>
              {!mira?.recrutado ? 'Aguardando segundo cenário' :
                ativos.includes(ID_DE_MIRA) ? 'Retirar Mira do Grupo' : 'Adicionar Mira ao Grupo'}
            </Button>
          )}
          <p className="atenuado">
            A história de Mira começa na segunda Masmorra. Recrutamento e evolução do vínculo
            não podem ser antecipados por esta tela.
          </p>
        </Card>
        <Card className={estilos.painel ?? ''}>
          <p className="secao-chamada">Treinamento opcional</p>
          <h3>Testar foco e Ameaça</h3>
          <p className="atenuado">
            Demonstração sem consequências, contra um Crúbach. Quando não há parceiros recrutados,
            usa personagens de treinamento, sem relação com a história.
          </p>
          <div className="informacao-linhaDeDados"><span>Dano</span><strong>Ameaça direta</strong></div>
          <div className="informacao-linhaDeDados"><span>Cura e suporte</span><strong>Ameaça indireta</strong></div>
          <div className="informacao-linhaDeDados"><span>Provocação</span><strong>Alvo forçado por 3s</strong></div>
          <Button variant="primary" size="sm" disabled={!disponivel || ocupado || emRisco}
            onClick={ensaiar}>
            {disponivel ? 'Executar ensaio tático' : 'Conclua Dún Liath Fácil'}
          </Button>
          {resultado ? (
            <div className={estilos.resultado ?? ""}>
              <p className="secao-chamada">Resultado do ensaio</p>
              <h3>{resultado.desfecho === 'vitoria' ? 'Vitória' :
                resultado.desfecho === 'derrota' ? 'Derrota' : 'Tempo esgotado'}</h3>
              <p className="atenuado">
                {resultado.duracaoEmSegundos}s · Olho de Caçadora: +{Math.round(resultado.bonusOlhoDeCacadora * 100)} p.p.
              </p>
              {resultado.combatentes.map(c => (
                <div className="informacao-linhaDeDados" key={c.id}>
                  <span>{c.nome}</span><strong>{Math.ceil(c.vida)}/{c.vidaMaxima} Vida</strong>
                </div>
              ))}
              <p className="secao-chamada">Mudanças de foco</p>
              <ol className={estilos.log ?? ""}>
                {resultado.registro.filter(e => e.tipo === 'foco' || e.tipo === 'provocacao')
                  .slice(-8).map((entrada, indice) => (
                    <li key={indice}>{entrada.segundo.toFixed(1)}s · {entrada.mensagem}</li>
                  ))}
              </ol>
            </div>
          ) : null}
        </Card>
      </div>
      {mensagem ? <p className="emLinha-mensagem" role="status">{mensagem}</p> : null}
    </section>
  )
}

