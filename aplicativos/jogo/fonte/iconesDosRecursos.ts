/**
 * @file Mapeamento entre identificadores do jogo e os ícones de Shikashi.
 * Os nomes descrevem arquivos visuais; trocar uma associação não muda atributos ou recompensas.
 */
import type { IdDaProfissao } from "@greywake/dominio";

/** Nomes aceitos para os PNGs publicados em publico/arte/icones/shikashi. */
export type NomeDoIconeShikashi =
  | "picareta"
  | "machado"
  | "pesca-vara"
  | "erva"
  | "ouro-lingote"
  | "ferreiro"
  | "caldeirao-fogo"
  | "coracao"
  | "pulmoes"
  | "orbe-azul"
  | "coroa-moeda"
  | "pedra"
  | "madeira"
  | "peixe"
  | "cozido-peixe"
  | "pocao-verde"
  | "pocao-vermelho"
  | "frasco-vermelho"
  | "chave"
  | "pedraRunica"
  | "livro-abrir"
  | "espada-longa"
  | "escudo-madeira"
  | "armadura-ferro"
  | "cajado-mago"
  | "capa"
  | "arco"
  | "armadura-couro"
  | "clava"
  | "adaga"
  | "tunica-verde"
  | "armadura-sobreposta"
  | "manopla-couro"
  | "botas-couro"
  | "anel"
  | "elmo-barbuta"
  | "manopla-metal"
  | "botas-aco"
  | "espada-gladio"
  | "escudo-quadriculado"
  | "cajado-verde";

/** Associação completa das profissões; o tipo exige uma entrada para cada profissão. */
export const iconeDeProfissaoPorId: Record<IdDaProfissao, NomeDoIconeShikashi> = {
  mineracao: "picareta",
  lenhador: "machado",
  pesca: "pesca-vara",
  herbologia: "erva",
  metalurgia: "ouro-lingote",
  forja: "ferreiro",
  culinaria: "caldeirao-fogo",
};

/** Símbolos dos recursos exibidos no resumo do personagem. */
export const iconeDoPainelPorId = {
  vidaMaxima: "coracao",
  manaMaxima: "orbe-azul",
  folegoMaximo: "pulmoes",
  ouro: "coroa-moeda",
} as const satisfies Record<string, NomeDoIconeShikashi>;

/** Associação de definições de itens empilháveis e de missão. */
export const iconeDeItemPorId: Record<string, NomeDoIconeShikashi> = {
  "material.cloch": "pedra",
  "material.giuis": "madeira",
  "material.scadan": "peixe",
  "material.neantog": "erva",
  "material.tratada-cloch": "ouro-lingote",
  "item.comida.assado-scadan": "cozido-peixe",
  "item.consumivel.neantog-preparacao": "pocao-verde",
  "item.consumivel.campo-preparacao": "pocao-vermelho",
  "item.consumivel.carmesim-frasco": "frasco-vermelho",
  "item.chave.enferrujada": "chave",
  "item.missao.semNome-pedra": "pedraRunica",
  "item.guarnicao-suprimento-registroDeDados": "livro-abrir",
};

/** Associação de modelos de equipamento, compartilhada por todas as suas instâncias. */
export const iconeDeEquipamentoPorId: Record<string, NomeDoIconeShikashi> = {
  "arma.milicia-espada": "espada-longa",
  "escudo.milicia-escudo": "escudo-madeira",
  "armadura.milicia-peitoral": "armadura-ferro",
  "arma.simples-cajado": "cajado-mago",
  "armadura.simples-vestes": "capa",
  "arma.curto-arco": "arco",
  "armadura.caca-gibao": "armadura-couro",
  "arma.simples-maca": "clava",
  "catalisador.simples": "orbe-azul",
  "armadura.acolito-vestes": "capa",
  "arma.caca-adaga": "adaga",
  "armadura.leve-traje": "tunica-verde",
  "armadura.viagem-protecao": "armadura-sobreposta",
  "armadura.simples-luvas": "manopla-couro",
  "armadura.simples-botas": "botas-couro",
  "armadura.giuis-bracadeiras": "manopla-couro",
  "item.equipamento.viajante-anel": "anel",
  "armadura.guarnicao-elmo": "elmo-barbuta",
  "armadura.guarnicao-luvas": "manopla-metal",
  "armadura.guarnicao-perneiras": "tunica-verde",
  "armadura.guarnicao-botas": "botas-aco",
  "arma.guarnicao-espada": "espada-gladio",
  "arma.bastiao-maca": "clava",
  "arma.patrulha-arco": "arco",
  "arma.campanha-cajado": "cajado-verde",
  "escudo.vigia-escudo": "escudo-quadriculado",
};

/** Monta a URL pública; o parâmetro v identifica a revisão visual para o navegador. */
export function obterCaminhoDoIconeShikashi(icone: NomeDoIconeShikashi) {
  return `/arte/icones/shikashi/${icone}.png?v=1`;
}

/** Consulta o símbolo de um item; IDs sem associação resultam em undefined. */
export function obterIconeDoItem(idDaDefinicao: string) {
  return iconeDeItemPorId[idDaDefinicao];
}

/** Consulta pelo ID da definição, e não pelo ID individual da peça do jogador. */
export function obterIconeDoEquipamento(idDaDefinicao: string) {
  return iconeDeEquipamentoPorId[idDaDefinicao];
}
