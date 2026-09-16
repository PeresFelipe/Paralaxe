import { derivarEstatisticasDeCombateDoJogador, obterProgressoDaMetaDaJornada, type PartidaLocal } from '@greywake/dominio'
import { obterDefinicaoDeReceitaDeFabricacao } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'

type PartidaDaHistoria = Pick<PartidaLocal, "combate" | "masmorra">

export function obterAvisoDeFabricacaoDaJornada(antes: PartidaLocal, apos: PartidaLocal): string | null {
  const primeiroId = apos.jornada.idsDasReceitasFabricadas.find((id) => !antes.jornada.idsDasReceitasFabricadas.includes(id))
  const meta = apos.jornada.meta
  const metaConcluido = meta?.concluidoEm && meta.idDaDefinicaoDaReceita === antes.jornada.meta?.idDaDefinicaoDaReceita && !antes.jornada.meta.concluidoEm
  const receita = obterDefinicaoDeReceitaDeFabricacao(primeiroId ?? (metaConcluido ? meta.idDaDefinicaoDaReceita : ''))
  if (!receita) return null
  return primeiroId
    ? `Primeira fabricação registrada: ${receita.nome}.${metaConcluido ? ' Sua meta foi concluída.' : ' Um novo feito na Jornada.'}`
    : `Meta concluída: ${receita.nome}. Escolha seu próximo passo na Jornada.`
}

export function obterComparacaoDeEquipamentoDaFabricacao(partida: PartidaLocal, idDaReceita: string) {
  const receita = obterDefinicaoDeReceitaDeFabricacao(idDaReceita)
  if (!receita || receita.saida.tipo !== "equipamento") return null
  const definicao = obterDefinicaoDeEquipamento(receita.saida.idDaDefinicao)
  if (!definicao) return null
  const equipadoId = partida.personagem.equipamento[definicao.espaco]
  const equipado = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === equipadoId)
  const atualDefinicao = equipado ? obterDefinicaoDeEquipamento(equipado.idDaDefinicao) : null
  const catalogo = { obterDefinicaoDeEquipamento }
  const antes = derivarEstatisticasDeCombateDoJogador(partida, catalogo)
  const previa = {
    ...partida,
    personagem: {
      ...partida.personagem,
      itensDeEquipamento: [...partida.personagem.itensDeEquipamento, { idDaInstancia: "jornada-previa", idDaDefinicao: definicao.id, nivelDeReforco: 0 as const }],
      equipamento: { ...partida.personagem.equipamento, [definicao.espaco]: "jornada-previa" },
    },
  }
  const apos = derivarEstatisticasDeCombateDoJogador(previa, catalogo)
  const campos = [
    ["defesa", 'Defesa'], ["poderDoAtaqueBasico", 'Poder de ataque'],
    ["vidaMaxima", 'Vida máxima'], ["manaMaxima", 'Mana máxima'], ["folegoMaximo", "Fôlego máxima"],
    ["precisao", 'Precisão'], ["chanceDeCritico", 'Chance crítica'],
    ["regeneracaoDeManaPorSegundo", 'Mana por segundo'], ["regeneracaoDeFolegoPorSegundo", "Fôlego por segundo"],
    ["intervaloDeAcaoEmSegundos", 'Segundos por ataque'],
  ] as const
  return {
    nomeAtual: atualDefinicao ? `${atualDefinicao.nome} +${equipado?.nivelDeReforco ?? 0}` : 'Nenhuma peça neste espaço',
    linhas: campos.map(([chave, rotulo]) => ({ chave, rotulo, antes: antes[chave], apos: apos[chave], diferenca: apos[chave] - antes[chave] }))
      .filter((linhaDeDados) => linhaDeDados.diferenca !== 0 || linhaDeDados.chave === "defesa"),
  }
}

export function obterResumoDeRetornoDaJornada(antes: PartidaLocal, apos: PartidaLocal): string | null {
  const meta = apos.jornada.meta
  if (!meta || antes.jornada.meta?.concluidoEm) return null
  const receita = obterDefinicaoDeReceitaDeFabricacao(meta.idDaDefinicaoDaReceita)
  if (!receita) return null
  const anterior = obterProgressoDaMetaDaJornada(antes, receita)
  const progresso = obterProgressoDaMetaDaJornada(apos, receita)
  if (progresso.concluido) return `Meta concluída: ${receita.nome}. Sua fabricação está registrada na Jornada.`
  if (progresso.pronto && !anterior.pronto) return `Materiais reunidos para ${receita.nome}. Sua próxima fabricação está ao alcance.`
  if (progresso.coletado > anterior.coletado) return `Sua meta avançou: ${progresso.coletado} de ${progresso.exigido} materiais para ${receita.nome}.`
  return null
}

export function obterHistoriaDaJornada(partida: PartidaDaHistoria) {
  if (partida.masmorra.expedicaoAtiva) return {
    rotulo: 'Em expedição', titulo: 'Expedição em Dún Liath',
    corpo: "Sua atividade Ocioso permanece pausada até retornar a um contexto seguro.",
  }
  if (partida.masmorra.contratoConcluido) return {
    rotulo: 'Arco concluído', titulo: 'De volta da Fortaleza Cinzenta',
    corpo: 'O contrato de Dún Liath foi cumprido. Brann tem palavras sobre seu retorno. Este arco termina aqui; você pode preparar outro equipamento ou revisitar os encontros conhecidos.',
  }
  if (partida.masmorra.contratoAceito) return {
    rotulo: 'Contrato em andamento', titulo: 'Fortaleza Cinzenta',
    corpo: 'O contrato de Dún Liath está ativo. Revise sua preparação em Aventura e recupere o Registro de Suprimentos para concluir o trabalho.',
  }
  if (partida.combate.loboDerrotado) return {
    rotulo: 'Novo caminho', titulo: 'Depois da Estrada Baixa',
    corpo: 'O Serviço foi concluído. Brann possui o caminho para o contrato da Fortaleza Cinzenta.',
  }
  return {
    rotulo: 'Primeiro passo', titulo: 'Estrada Baixa',
    corpo: 'Há relatos de hostilidade fora da Cidade. O Serviço em Aventura é o próximo teste conhecido de preparação.',
  }
}

export function obterDialogoDeBrann(partida: PartidaDaHistoria) {
  const lembranca = partida.masmorra.dunLiathProtetor === "poupado"
    ? 'Você deixou o Protetor viver. Há decisões que continuam conosco depois que os portões se fecham.'
    : partida.masmorra.dunLiathProtetor === "morto"
      ? 'O Protetor caiu pela sua mão. A fortaleza guardará esse silêncio; você guardará o motivo.'
      : null
  if (partida.masmorra.contratoConcluido) return {
    titulo: 'Você trouxe respostas de Dún Liath.',
    corpo: 'O Registro de Suprimentos chegou, e o contrato está encerrado. Descanse. A cidade ainda tem ofícios a aprender, e a fortaleza continua de pé.',
    lembranca, acao: 'Revisitar Dún Liath',
  }
  if (partida.masmorra.contratoAceito) return {
    titulo: 'O contrato ainda está em suas mãos.',
    corpo: 'Seus passos trouxeram você de volta. Prepare-se no seu ritmo; ainda precisamos recuperar o Registro de Suprimentos em Dún Liath.',
    lembranca, acao: 'Rever preparação de Dún Liath',
  }
  return partida.combate.loboDerrotado ? {
    titulo: 'A estrada confirmou os rumores.',
    corpo: 'Há um contrato na Fortaleza Cinzenta. Conheça os riscos antes de atravessar os portões.',
    lembranca, acao: 'Ver contrato de Dún Liath',
  } : {
    titulo: 'Há trabalho fora dos portões.',
    corpo: 'Prepare-se nos ofícios da cidade. Quando quiser testar seu equipamento, o Serviço — Estrada Baixa espera por você.',
    lembranca, acao: null,
  }
}
