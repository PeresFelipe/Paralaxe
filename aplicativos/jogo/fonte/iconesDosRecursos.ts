/**
 * @file Mapeamento entre identificadores do jogo e os ícones dos pacotes de arte.
 * Os nomes descrevem arquivos visuais; trocar uma associação não muda atributos ou recompensas.
 */
import { ATIVIDADES_DE_PRESTIGIO, RECEITAS_DE_PRESTIGIO, EQUIPAMENTOS_DE_PRESTIGIO } from "@paralaxe/conteudo";
import type { IdDaProfissao } from "@paralaxe/dominio";

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
  | "cajado-verde"
  | "almofariz"
  | "broquel"
  | "cristal-bruto"
  | "minerio"
  | "truta"
  | "viga-madeira";

export const iconeDeAtalhoPorId = {
  inventario: "mochila",
  banco: "bau",
  grupo: "equipe",
} as const;

/** Ícones das ações visuais, sem substituir o rótulo dos botões. */
export const iconeDeAcaoPorId = {
  opcoes: "opcoes",
  aparencia: "aparencia",
  largura: "largura",
  depositar: "depositar",
  retirar: "retirar",
} as const;

type NomeDoIconeCrusenho = (typeof iconeDeAtalhoPorId)[keyof typeof iconeDeAtalhoPorId]
  | (typeof iconeDeAcaoPorId)[keyof typeof iconeDeAcaoPorId];
export type NomeDoIconeDoJogo = NomeDoIconeShikashi | NomeDoIconeCrusenho | "lanca";

const iconesCrusenho: ReadonlySet<NomeDoIconeDoJogo> = new Set([...Object.values(iconeDeAtalhoPorId), ...Object.values(iconeDeAcaoPorId)]);

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

/** Identidade visual dos recursos de Prestígio, gerada dos mesmos catálogos do jogo. */
const iconeDeMaterialPorProfissao: Record<IdDaProfissao, NomeDoIconeShikashi> = {
  mineracao: "cristal-bruto", lenhador: "madeira", pesca: "peixe", herbologia: "erva",
  metalurgia: "ouro-lingote", forja: "espada-longa", culinaria: "pocao-verde",
};

function iconeDaReceitaDePrestigio(receita: (typeof RECEITAS_DE_PRESTIGIO)[number]): NomeDoIconeShikashi {
  if (receita.idDaProfissao !== "culinaria") return iconeDeMaterialPorProfissao[receita.idDaProfissao];
  const nome = receita.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return /\b(racao|refeicao|banquete|mesa|conservacao)\b/i.test(nome) ? "cozido-peixe" : "pocao-verde";
}

/** Associação de definições de itens empilháveis e de missão. */
export const iconeDeItemPorId: Record<string, NomeDoIconeDoJogo> = {
  ...Object.fromEntries(ATIVIDADES_DE_PRESTIGIO.map(atividade => [
    atividade.idDaDefinicaoDoItemProduzido, iconeDeMaterialPorProfissao[atividade.idDaProfissao],
  ])),
  ...Object.fromEntries(RECEITAS_DE_PRESTIGIO.flatMap(receita => receita.saida.tipo === "item" ? [[
    receita.saida.idDaDefinicao, iconeDaReceitaDePrestigio(receita),
  ]] : [])),
  "item.fairtheoir-fragmento": "pedraRunica",
  "item.dun-liath.sucata": "pedra",
  "item.dun-liath.viga": "viga-madeira",
  "item.dun-liath.registro-arquivo": "livro-abrir",
  "item.dun-liath.lacre-comandante": "pedraRunica",
  "material.cloch": "pedra",
  "material.stan": "minerio",
  "material.beith": "madeira",
  "material.breac": "truta",
  "material.seamair": "erva",

  "material.luaidhe": "minerio",
  "material.airgead": "minerio",
  "material.coll": "madeira",
  "material.fuinseog": "madeira",
  "material.trosc": "peixe",
  "material.bradan": "peixe",
  "material.aiteann": "erva",
  "material.raithneach": "erva",
  "material.lingote-luaidhe": "ouro-lingote",
  "material.placa-fundicao-pesada": "ouro-lingote",
  "material.lingote-airgead": "ouro-lingote",
  "material.cruach": "ouro-lingote",
  "item.comida.trosc-defumado": "cozido-peixe",
  "item.consumivel.extrato-aiteann": "pocao-verde",
  "item.comida.bradan-raithneach": "cozido-peixe",
  "material.or": "minerio",
  "material.grianchloch": "cristal-bruto",
  "material.dair": "madeira",
  "material.iur": "madeira",
  "material.tuinnin": "peixe",
  "material.doingean": "peixe",
  "material.saiste": "erva",
  "material.maros": "erva",
  "material.lingote-or": "ouro-lingote",
  "material.metais-nobres": "ouro-lingote",
  "material.grianchloch-refinado": "pedraRunica",
  "item.comida.tuinnin-saiste": "cozido-peixe",
  "item.comida.doingean-maros": "cozido-peixe",
  "item.consumivel.elixir-maros": "pocao-verde",
  "material.lingote-stan": "ouro-lingote",
  "material.copar": "minerio",
  "material.iarann": "minerio",
  "material.fearn": "madeira",
  "material.saileach": "madeira",
  "material.sairdin": "peixe",
  "material.ronnach": "peixe",
  "material.caisearbhan": "erva",
  "material.fraoch": "erva",
  "material.lingote-copar": "ouro-lingote",
  "material.lingote-iarann": "ouro-lingote",
  "material.cre-umha": "ouro-lingote",
  "item.comida.conserva-sairdin": "cozido-peixe",
  "item.consumivel.infusao-caisearbhan": "pocao-verde",
  "item.comida.ensopado-ronnach-fraoch": "cozido-peixe",
  "material.giuis": "madeira",
  "material.scadan": "peixe",
  "material.neantog": "erva",
  "material.tratada-cloch": "ouro-lingote",
  "item.comida.assado-scadan": "cozido-peixe",
  "item.comida.breac-assado": "cozido-peixe",
  "item.consumivel.infusao-seamair": "pocao-verde",
  "item.consumivel.neantog-preparacao": "pocao-verde",
  "item.consumivel.campo-preparacao": "pocao-vermelho",
  "item.consumivel.carmesim-frasco": "frasco-vermelho",
  "item.chave.enferrujada": "chave",
  "item.missao.semNome-pedra": "pedraRunica",
  "item.guarnicao-suprimento-registroDeDados": "livro-abrir",
};

/** Associação de modelos de equipamento, compartilhada por todas as suas instâncias. */
export const iconeDeEquipamentoPorId: Record<string, NomeDoIconeDoJogo> = {
  ...Object.fromEntries(EQUIPAMENTOS_DE_PRESTIGIO.map(equipamento => [equipamento.id, "espada-longa" as const])),
  "arma.viagem-lanca": "lanca",
  "arma.vigia-lanca": "lanca",
  "ferramenta.mineracao.picareta": "picareta",
  "ferramenta.lenhador.machado-corte": "machado",
  "ferramenta.pesca.equipamento-pesca": "pesca-vara",
  "ferramenta.herbologia.kit-herbologia": "almofariz",
  "arma.milicia-espada": "espada-longa",
  "escudo.milicia-escudo": "escudo-madeira",
  "armadura.milicia-peitoral": "armadura-ferro",
  "arma.simples-cajado": "cajado-mago",
  "armadura.simples-vestes": "capa",
  "arma.curto-arco": "arco",

  "armadura.fundicao-pesada-peitoral": "armadura-ferro",
  "arma.fuinseog-arco": "arco",
  "item.equipamento.airgead-anel": "anel",
  "armadura.dair-peitoral-hibrido": "armadura-ferro",
  "arma.iur-arco-grianchloch": "arco",
  "arma.grianchloch-cajado": "cajado-verde",
  "arma.beith-arco": "arco",
  "escudo.fearn-broquel": "broquel",
  "armadura.iarann-couraca": "armadura-ferro",
  "arma.saileach-arco": "arco",
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
  "armadura.stan-bracadeiras-rebitadas": "manopla-metal",
  "item.equipamento.viajante-anel": "anel",
  "armadura.guarnicao-elmo": "elmo-barbuta",
  "armadura.guarnicao-luvas": "manopla-metal",
  "armadura.guarnicao-perneiras": "tunica-verde",
  "armadura.guarnicao-botas": "botas-aco",
  "arma.guarnicao-espada": "espada-gladio",
  "arma.bastiao-maca": "clava",
  "arma.patrulha-arco": "arco",
  "arma.campanha-cajado": "cajado-verde",
  "escudo.ultimo-vigia": "escudo-quadriculado",
  "escudo.vigia-escudo": "escudo-quadriculado",
};

/** Resolve o arquivo público do pacote ao qual pertence o ícone. */
export function obterCaminhoDoIconeDoJogo(icone: NomeDoIconeDoJogo) {
  if (icone === "lanca") return "/arte/icones/kenney/lanca.png";
  if (iconesCrusenho.has(icone)) return `/arte/icones/crusenho/${icone}.png`;
  return `/arte/icones/shikashi/${icone}.png?v=1`;
}

/** Consulta o símbolo de um item; IDs sem associação resultam em undefined. */
export function obterIconeDoItem(idDaDefinicao: string): NomeDoIconeDoJogo | undefined {
  return Object.hasOwn(iconeDeItemPorId, idDaDefinicao) ? iconeDeItemPorId[idDaDefinicao] : undefined;
}

/** Consulta pelo ID da definição, e não pelo ID individual da peça do jogador. */
export function obterIconeDoEquipamento(idDaDefinicao: string): NomeDoIconeDoJogo | undefined {
  return Object.hasOwn(iconeDeEquipamentoPorId, idDaDefinicao) ? iconeDeEquipamentoPorId[idDaDefinicao] : undefined;
}

/** Resolve produtos de mercado, fabricação e outras listas com os mesmos IDs do inventário. */
export function obterIconeDoProduto(produto: { tipo: "item" | "equipamento"; idDaDefinicao: string }) {
  return produto.tipo === "equipamento"
    ? obterIconeDoEquipamento(produto.idDaDefinicao)
    : obterIconeDoItem(produto.idDaDefinicao);
}
