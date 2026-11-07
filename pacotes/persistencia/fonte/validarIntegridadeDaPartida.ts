/** Validação de integridade depois da migração, sem consultar catálogos nem alterar o formato salvo. */
import { CHAVES_DOS_ATRIBUTOS, ESPACOS_DE_EQUIPAMENTO } from '@paralaxe/dominio'

function falhar(caminho: string): never { throw new Error(`Partida inválida: ${caminho}.`) }
function registro(valor: unknown, caminho: string): Record<string, unknown> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) falhar(caminho)
  return valor as Record<string, unknown>
}
function lista(valor: unknown, caminho: string): unknown[] {
  if (!Array.isArray(valor)) falhar(caminho)
  return valor
}
function texto(valor: unknown, caminho: string) {
  if (typeof valor !== 'string' || !valor.trim()) falhar(caminho)
}
function natural(valor: unknown, caminho: string, minimo = 0) {
  if (typeof valor !== 'number' || !Number.isSafeInteger(valor) || valor < minimo) falhar(caminho)
}
function data(valor: unknown, caminho: string) {
  if (typeof valor !== 'string' || !Number.isFinite(Date.parse(valor))) falhar(caminho)
}
function ids(valor: unknown, caminho: string) {
  const valores = lista(valor, caminho)
  valores.forEach(id => texto(id, caminho))
  if (new Set(valores).size !== valores.length) falhar(`${caminho}: IDs repetidos`)
}
function pilhas(valor: unknown, caminho: string) {
  const vistos = new Set<unknown>()
  for (const item of lista(valor, caminho)) {
    const pilha = registro(item, caminho)
    texto(pilha.idDaDefinicao, caminho)
    natural(pilha.quantidade, caminho, 1)
    if (vistos.has(pilha.idDaDefinicao)) falhar(`${caminho}: pilha repetida`)
    vistos.add(pilha.idDaDefinicao)
  }
}
function equipamentos(valor: unknown, caminho: string, vistos: Set<unknown>) {
  for (const item of lista(valor, caminho)) {
    const equipamento = registro(item, caminho)
    texto(equipamento.idDaInstancia, caminho)
    texto(equipamento.idDaDefinicao, caminho)
    natural(equipamento.nivelDeReforco, caminho)
    if (vistos.has(equipamento.idDaInstancia)) falhar(`${caminho}: instância repetida`)
    vistos.add(equipamento.idDaInstancia)
    if (equipamento.idsDosAfixos !== undefined) ids(equipamento.idsDosAfixos, caminho)
  }
}
/** Recusa números não persistíveis e referências cíclicas, inclusive em campos opcionais. */
function numerosFinitos(valor: unknown, caminho: string, ancestrais = new Set<object>()) {
  if (typeof valor === 'number' && !Number.isFinite(valor)) falhar(caminho)
  if (!valor || typeof valor !== 'object') return
  if (ancestrais.has(valor)) falhar(`${caminho}: referência circular`)
  ancestrais.add(valor)
  for (const [chave, filho] of Object.entries(valor)) numerosFinitos(filho, `${caminho}.${chave}`, ancestrais)
  ancestrais.delete(valor)
}
export function validarIntegridadeDaPartida(valor: unknown): void {
  const partida = registro(valor, 'raiz')
  numerosFinitos(partida, 'raiz')
  texto(partida.idDaPartida, 'idDaPartida')
  texto(partida.versaoDoConteudo, 'versaoDoConteudo')
  if (partida.modoDaPartida !== 'LOCAL') falhar('modoDaPartida')
  data(partida.criadoEm, 'criadoEm'); data(partida.atualizadoEm, 'atualizadoEm')
  if (typeof partida.segundosDeJogo !== 'number' || partida.segundosDeJogo < 0) falhar('segundosDeJogo')
  const personagem = registro(partida.personagem, 'personagem')
  texto(personagem.nome, 'personagem.nome')
  if (!['guerreiro', 'mago', 'cacador', 'acolito', 'ladino', 'errante'].includes(String(personagem.idDaClasse))) falhar('personagem.idDaClasse')
  if (!['enferrujada-chave', 'moeda-bolsaDeMoedas', 'carmesim-frasco', 'viajante-anel', 'semNome-pedra', 'sobrevivencia-estojo', 'nenhum'].includes(String(personagem.idDoPresente))) falhar('personagem.idDoPresente')
  for (const campo of ['xp', 'ouro', 'pontosDeAtributoDisponiveis']) natural(personagem[campo], `personagem.${campo}`)
  natural(personagem.nivel, 'personagem.nivel', 1)
  natural(personagem.proximaSequenciaDeEquipamento, 'personagem.proximaSequenciaDeEquipamento', 1)
  texto(personagem.idDaLocalizacaoAtual, 'personagem.idDaLocalizacaoAtual')
  const atributos = registro(personagem.atributos, 'personagem.atributos')
  for (const chave of CHAVES_DOS_ATRIBUTOS) natural(atributos[chave], `atributos.${chave}`)
  pilhas(personagem.inventario, 'inventario')
  const instancias = new Set<unknown>()
  equipamentos(personagem.itensDeEquipamento, 'itensDeEquipamento', instancias)
  const equipado = registro(personagem.equipamento, 'equipamento')
  const espacosValidos = new Set<string>(ESPACOS_DE_EQUIPAMENTO)
  for (const chave of Object.keys(equipado)) if (!espacosValidos.has(chave)) falhar(`equipamento.${chave}`)
  for (const id of Object.values(equipado)) if (id !== null && !instancias.has(id)) falhar('equipamento: instância ausente da mochila')
  const banco = registro(personagem.banco, 'banco')
  pilhas(banco.inventario, 'banco.inventario')
  equipamentos(banco.itensDeEquipamento, 'banco.itensDeEquipamento', instancias)
  ids(personagem.idsDasHabilidadesConhecidas, 'habilidades')
  const espacos = lista(personagem.espacosDeHabilidadesAtivas, 'espacosDeHabilidadesAtivas')
  if (espacos.length !== 4 || espacos.some(id => id !== null && !lista(personagem.idsDasHabilidadesConhecidas, 'habilidades').includes(id))) falhar('espacosDeHabilidadesAtivas')
  const prestigio = registro(personagem.prestigio, 'prestigio')
  natural(prestigio.nivel, 'prestigio.nivel'); natural(prestigio.pontos, 'prestigio.pontos')
  ids(prestigio.idsDosNosDesbloqueados, 'prestigio.idsDosNosDesbloqueados')
  const profissoes = registro(partida.profissoes, 'profissoes')
  for (const id of ['mineracao', 'lenhador', 'pesca', 'herbologia', 'metalurgia', 'forja', 'culinaria']) {
    const oficio = registro(profissoes[id], `profissoes.${id}`)
    natural(oficio.nivel, `profissoes.${id}.nivel`, 1); natural(oficio.xp, `profissoes.${id}.xp`); natural(oficio.prestigio, `profissoes.${id}.prestigio`)
  }
  for (const [campo, slots, definicao] of [
    ['ocioso', ['atividadeAtiva', 'atividadeSecundaria', 'atividadeTerciaria'], 'idDaDefinicaoDaAtividade'],
    ['fabricacao', ['receitaAtiva', 'receitaSecundaria', 'receitaTerciaria'], 'idDaDefinicaoDaReceita'],
  ] as const) {
    const trabalho = registro(partida[campo], campo)
    if (!['equilibrado', 'principal', 'secundaria', 'terciaria'].includes(String(trabalho.prioridade))) falhar(`${campo}.prioridade`)
    if (!(slots[0] in trabalho)) falhar(`${campo}.${slots[0]}`)
    for (const slot of slots) if (trabalho[slot] != null) {
      const ativo = registro(trabalho[slot], `${campo}.${slot}`)
      texto(ativo[definicao], `${campo}.${slot}.${definicao}`)
      data(ativo.iniciadoEm, `${campo}.${slot}.iniciadoEm`)
      data(ativo.processadoPorUltimoEm, `${campo}.${slot}.processadoPorUltimoEm`)
      if (typeof ativo.segundosRestantes !== 'number' || ativo.segundosRestantes < 0) falhar(`${campo}.${slot}.segundosRestantes`)
    }
  }
  const combate = registro(partida.combate, 'combate')
  const preferencias = registro(combate.preferencias, 'combate.preferencias')
  const consumiveis = lista(preferencias.espacosDeConsumiveis, 'consumiveis')
  for (const slot of consumiveis) {
    const espaco = registro(slot, 'consumivel')
    if (espaco.idDaDefinicao !== null) texto(espaco.idDaDefinicao, 'consumivel.idDaDefinicao')
    if (espaco.recursoDeUsoAutomatico !== null && !['vida', 'mana', 'folego'].includes(String(espaco.recursoDeUsoAutomatico))) falhar('consumivel.recurso')
    const limiar = espaco.porcentagemDoLimiarDeUsoAutomatico
    if (limiar !== null && (typeof limiar !== 'number' || limiar < 0 || limiar > 100)) falhar('consumivel.limiar')
  }
  if (consumiveis.length !== 2) falhar('consumiveis')
  if (typeof combate.loboDerrotado !== 'boolean') falhar('combate.loboDerrotado')
  const masmorra = registro(partida.masmorra, 'masmorra')
  for (const chave of ['dunLiathFacilConquistado', 'contratoAceito', 'contratoConcluido', 'guardaInstintivaDesbloqueada']) if (typeof masmorra[chave] !== 'boolean') falhar(`masmorra.${chave}`)
  if (masmorra.expedicaoAtiva !== null) {
    const expedicao = registro(masmorra.expedicaoAtiva, 'expedicao')
    texto(expedicao.idDaDefinicaoDaMasmorra, 'expedicao.idDaDefinicaoDaMasmorra')
    texto(expedicao.idDaSalaAtual, 'expedicao.idDaSalaAtual')
    ids(expedicao.idsDasSalasVisitadas, 'expedicao.idsDasSalasVisitadas')
    ids(expedicao.idsDasSalasResolvidas, 'expedicao.idsDasSalasResolvidas')
    pilhas(expedicao.bolsaDaExpedicao, 'expedicao.bolsaDaExpedicao')
    lista(expedicao.equipamentosDaExpedicao, 'expedicao.equipamentosDaExpedicao')
    registro(expedicao.ramificacoesEscolhidas, 'expedicao.ramificacoesEscolhidas')
    const recursos = registro(expedicao.recursos, 'expedicao.recursos')
    for (const chave of ['vida', 'vidaMaxima', 'mana', 'manaMaxima', 'folego', 'folegoMaximo']) if (typeof recursos[chave] !== 'number' || recursos[chave] < 0) falhar(`expedicao.recursos.${chave}`)
    data(expedicao.iniciadoEm, 'expedicao.iniciadoEm'); data(expedicao.atualizadoEm, 'expedicao.atualizadoEm')
  }
  if (masmorra.incursaoAutomaticaAtiva != null) {
    const incursao = registro(masmorra.incursaoAutomaticaAtiva, 'incursao')
    data(incursao.iniciadaEm, 'incursao.iniciadaEm'); data(incursao.terminaEm, 'incursao.terminaEm')
    pilhas(incursao.recompensaPossivel, 'incursao.recompensaPossivel')
  }
  const grupo = registro(partida.grupo, 'grupo')
  ids(grupo.idsDosParceirosAtivos, 'grupo.idsDosParceirosAtivos'); registro(grupo.parceiros, 'grupo.parceiros')
  const jornada = registro(partida.jornada, 'jornada')
  ids(jornada.idsDasReceitasFabricadas, 'jornada.idsDasReceitasFabricadas')
  ids(registro(partida.codice, 'codice').idsDescobertos, 'codice.idsDescobertos')
  ids(registro(partida.desafios, 'desafios').idsConcluidos, 'desafios.idsConcluidos')
}
