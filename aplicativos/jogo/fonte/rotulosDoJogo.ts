/**
 * @file Rótulos e agrupamentos usados na apresentação de profissões e itens.
 * Os IDs continuam sendo as chaves do domínio; estes textos não definem receitas nem recompensas.
 */
import type { IdDaProfissao } from "@paralaxe/dominio";

/** Nomes legíveis com acentuação para todas as profissões. */
export const rotulosDasProfissoes: Record<IdDaProfissao, string> = {
  mineracao: "Mineração",
  lenhador: "Lenhador",
  pesca: "Pesca",
  herbologia: "Herbologia",
  metalurgia: "Metalurgia",
  forja: "Forja",
  culinaria: "Culinária",
};

/** Ordem das profissões de obtenção de matéria-prima na navegação. */
export const coletaProfissoes: IdDaProfissao[] = [
  "mineracao",
  "lenhador",
  "pesca",
  "herbologia",
];
/** Ordem das profissões que transformam ingredientes por meio de receitas. */
export const producaoProfissoes: IdDaProfissao[] = [
  "metalurgia",
  "forja",
  "culinaria",
];

/** Tradução visual dos IDs de itens, incluindo recompensas de missões e masmorra. */
export const rotulosDosItens: Record<string, string> = {
  "material.cloch": "Cloch",
  "material.stan": "Stán",
  "material.beith": "Beith",
  "material.breac": "Breac",
  "material.seamair": "Seamair",

  "material.luaidhe": "Luaidhe",
  "material.airgead": "Airgead",
  "material.coll": "Coll",
  "material.fuinseog": "Fuinseog",
  "material.trosc": "Trosc",
  "material.bradan": "Bradán",
  "material.aiteann": "Aiteann",
  "material.raithneach": "Raithneach",
  "material.lingote-luaidhe": "Lingote de Luaidhe",
  "material.placa-fundicao-pesada": "Placa de Fundição Pesada",
  "material.lingote-airgead": "Lingote de Airgead",
  "material.cruach": "Cruach",  "material.lingote-stan": "Lingote de Stán",
  "material.copar": "Copar",
  "material.iarann": "Iarann",
  "material.fearn": "Fearn",
  "material.saileach": "Saileach",
  "material.sairdin": "Sairdín",
  "material.ronnach": "Ronnach",
  "material.caisearbhan": "Caisearbhán",
  "material.fraoch": "Fraoch",
  "material.lingote-copar": "Lingote de Copar",
  "material.lingote-iarann": "Lingote de Iarann",
  "material.cre-umha": "Cré-Umha",
  "material.giuis": "Giúis",
  "material.scadan": "Scadán",
  "material.neantog": "Neantóg",
  "material.tratada-cloch": "Cloch Tratada",
  "item.comida.assado-scadan": "Scadán Assado",

  "item.comida.trosc-defumado": "Trosc Defumado",
  "item.consumivel.extrato-aiteann": "Extrato de Aiteann",
  "item.comida.bradan-raithneach": "Refeição de Bradán e Raithneach",  "item.comida.breac-assado": "Breac Assado",
  "item.comida.conserva-sairdin": "Sairdín em Conserva",
  "item.consumivel.infusao-caisearbhan": "Infusão de Caisearbhán",
  "item.comida.ensopado-ronnach-fraoch": "Ensopado de Ronnach e Fraoch",
  "item.consumivel.infusao-seamair": "Infusão de Seamair",
  "item.consumivel.neantog-preparacao": "Preparado de Neantóg",
  "item.consumivel.campo-preparacao": "Preparado de Campo",
  "item.consumivel.carmesim-frasco": "Frasco Carmesim",
  "item.chave.enferrujada": "Chave Enferrujada",
  "item.missao.semNome-pedra": "Pedra Sem Nome",
  "item.equipamento.viajante-anel": "Anel do Viajante",
  "item.guarnicao-suprimento-registroDeDados": "Registro de Suprimentos",
  "item.tratado-fragmento": "Fragmento do Tratado",
  "item.fairtheoir-fragmento": "Fragmento de Fairtheoir",
};
