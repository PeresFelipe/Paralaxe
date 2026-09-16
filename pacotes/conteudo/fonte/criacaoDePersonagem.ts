import type { DefinicaoDeClasseDoPersonagem, DefinicaoDePresente } from '@greywake/dominio'

export const CLASSES_DE_PERSONAGEM = [
  {
    id: "guerreiro",
    nome: 'Guerreiro',
    resumo: 'Corpo a corpo, sobrevivência, Força e Vigor.',
    atributos: {
      vitalidade: 7,
      mente: 2,
      vigor: 7,
      forca: 8,
      destreza: 4,
      inteligencia: 2,
      fe: 5,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.milicia-espada",
      maoSecundaria: "escudo.milicia-escudo",
      peitoral: "armadura.milicia-peitoral",
    },
    idDaHabilidadeInicial: "habilidade.forca-golpe",
  },
  {
    id: "mago",
    nome: 'Mago',
    resumo: 'Mana, Inteligência e acesso imediato a dano mágico.',
    atributos: {
      vitalidade: 4,
      mente: 8,
      vigor: 3,
      forca: 2,
      destreza: 3,
      inteligencia: 10,
      fe: 5,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.simples-cajado",
      peitoral: "armadura.simples-vestes",
    },
    idDaHabilidadeInicial: "habilidade.arcano-pulso",
  },
  {
    id: "cacador",
    nome: 'Caçador',
    resumo: 'Destreza, Precisão e combate à distância.',
    atributos: {
      vitalidade: 5,
      mente: 3,
      vigor: 6,
      forca: 4,
      destreza: 10,
      inteligencia: 2,
      fe: 5,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.curto-arco",
      peitoral: "armadura.caca-gibao",
    },
    idDaHabilidadeInicial: "habilidade.preciso-disparo",
  },
  {
    id: "acolito",
    nome: 'Acólito',
    resumo: 'Fé, cura, defesa e suporte.',
    atributos: {
      vitalidade: 5,
      mente: 8,
      vigor: 4,
      forca: 3,
      destreza: 2,
      inteligencia: 3,
      fe: 10,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.simples-maca",
      maoSecundaria: "catalisador.simples",
      peitoral: "armadura.acolito-vestes",
    },
    idDaHabilidadeInicial: "habilidade.restauradora-prece",
  },
  {
    id: "ladino",
    nome: 'Ladino',
    resumo: 'Destreza, crítico e velocidade.',
    atributos: {
      vitalidade: 4,
      mente: 3,
      vigor: 7,
      forca: 3,
      destreza: 11,
      inteligencia: 4,
      fe: 3,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.caca-adaga",
      peitoral: "armadura.leve-traje",
    },
    idDaHabilidadeInicial: "habilidade.oportuno-golpe",
  },
  {
    id: "errante",
    nome: 'Errante',
    resumo: 'Início equilibrado sem atributo atrasado.',
    atributos: {
      vitalidade: 5,
      mente: 5,
      vigor: 5,
      forca: 5,
      destreza: 5,
      inteligencia: 5,
      fe: 5,
    },
    equipamentosIniciais: {
      maoPrincipal: "arma.viagem-lanca",
      peitoral: "armadura.viagem-protecao",
    },
    idDaHabilidadeInicial: "habilidade.abertura",
  },
] as const satisfies readonly DefinicaoDeClasseDoPersonagem[]

export const PRESENTES_INICIAIS = [
  {
    id: "enferrujada-chave",
    nome: 'Chave Enferrujada',
    resumo: 'Exploração e acesso antecipado a um segredo opcional.',
    concessoes: [{ tipo: 'item', idDaDefinicao: "item.chave.enferrujada", quantidade: 1 }],
  },
  {
    id: "moeda-bolsaDeMoedas",
    nome: 'Bolsa de Moedas',
    resumo: 'Começa com 60 moedas adicionais.',
    concessoes: [{ tipo: "ouro", quantidadeTotal: 60 }],
  },
  {
    id: "carmesim-frasco",
    nome: 'Frasco Carmesim',
    resumo: 'Consumível raro de emergência para recuperar Vida.',
    concessoes: [{ tipo: 'item', idDaDefinicao: "item.consumivel.carmesim-frasco", quantidade: 1 }],
  },
  {
    id: "viajante-anel",
    nome: 'Anel do Viajante',
    resumo: 'Pequeno bônus versátil enquanto estiver equipado.',
    concessoes: [{ tipo: "equipamento", idDaDefinicao: "item.equipamento.viajante-anel", espacoParaEquipar: "anel1" }],
  },
  {
    id: "semNome-pedra",
    nome: 'Pedra Sem Nome',
    resumo: 'Objeto ligado a lore, diálogo e conteúdo secreto.',
    concessoes: [{ tipo: 'item', idDaDefinicao: "item.missao.semNome-pedra", quantidade: 1 }],
  },
  {
    id: "sobrevivencia-estojo",
    nome: 'Kit de Sobrevivência',
    resumo: '2× Preparado de Campo e 2× Scadán Assado.',
    concessoes: [
      { tipo: 'item', idDaDefinicao: "item.consumivel.campo-preparacao", quantidade: 2 },
      { tipo: 'item', idDaDefinicao: "item.comida.assado-scadan", quantidade: 2 },
    ],
  },
  {
    id: "nenhum",
    nome: 'Nenhum Presente',
    resumo: 'Nenhuma vantagem e nenhuma compensação escondida.',
    concessoes: [],
  },
] as const satisfies readonly DefinicaoDePresente[]
