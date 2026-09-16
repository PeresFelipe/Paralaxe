/**
 * @file Ofertas fixas do mercado PNJ da versão inicial.
 * Cada preço é por compra da oferta inteira. O domínio verifica moedas e espaço
 * antes de materializar o produto no inventário.
 */
import type { OfertaDoMercadoDePnj } from '@greywake/dominio'

/** As ofertas apontam para definições existentes; equipamentos comprados recebem uma nova instância por compra. */
export const OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ = [
  {
    id: "mercado.campo-preparacao",
    nome: 'Preparado de Campo',
    preco: 15,
    produto: {
      tipo: 'item',
      idDaDefinicao: "item.consumivel.campo-preparacao",
      quantidade: 1,
    },
  },
  {
    id: "mercado.simples-luvas",
    nome: 'Luvas Simples',
    preco: 20,
    produto: {
      tipo: "equipamento",
      idDaDefinicao: "armadura.simples-luvas",
      espaco: "luvas",
    },
  },
  {
    id: "mercado.simples-botas",
    nome: 'Botas Simples',
    preco: 20,
    produto: {
      tipo: "equipamento",
      idDaDefinicao: "armadura.simples-botas",
      espaco: "botas",
    },
  },
] as const satisfies readonly OfertaDoMercadoDePnj[]

/** Resolve o ID escolhido na tela sem confiar em preço ou produto enviados pelo componente. */
export function obterOfertaDoMercadoDePnj(ofertaId: string): OfertaDoMercadoDePnj | null {
  return OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.find((oferta) => oferta.id === ofertaId) ?? null
}
