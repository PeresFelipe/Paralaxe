import type { IdDaProfissao } from "@greywake/dominio";

export const rotulosDasProfissoes: Record<IdDaProfissao, string> = {
  mineracao: "Mineração",
  lenhador: "Lenhador",
  pesca: "Pesca",
  herbologia: "Herbologia",
  metalurgia: "Metalurgia",
  forja: "Forja",
  culinaria: "Culinária",
};

export const coletaProfissoes: IdDaProfissao[] = [
  "mineracao",
  "lenhador",
  "pesca",
  "herbologia",
];
export const producaoProfissoes: IdDaProfissao[] = [
  "metalurgia",
  "forja",
  "culinaria",
];

export const rotulosDosItens: Record<string, string> = {
  "material.cloch": "Cloch",
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
