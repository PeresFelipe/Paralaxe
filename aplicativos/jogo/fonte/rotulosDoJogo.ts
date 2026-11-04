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
  "material.lingote-stan": "Lingote de Stán",
  "material.giuis": "Giúis",
  "material.scadan": "Scadán",
  "material.neantog": "Neantóg",
  "material.tratada-cloch": "Cloch Tratada",
  "item.comida.assado-scadan": "Scadán Assado",
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
