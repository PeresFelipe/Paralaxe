/**
 * @file Compras no mercado de personagens não jogáveis.
 * A oferta vem do catálogo; saldo e capacidade vêm da partida. A compra devolve
 * um estado completo com o débito e a entrega, sem depender da interface.
 */
import type { PartidaLocal } from './personagem'
import type { EspacoDeEquipamento } from './equipamento'
import { verificarCapacidadeParaEquipamentoNoInventario, verificarCapacidadeParaPilhaNoInventario } from './armazenamento'

/** Separa produtos empilháveis de equipamentos que precisam de identidade própria. */
export type ProdutoDoMercadoDePnj =
  | {
      tipo: 'item'
      idDaDefinicao: string
      quantidade: number
    }
  | {
      tipo: "equipamento"
      idDaDefinicao: string
      espaco: EspacoDeEquipamento
    }

export interface OfertaDoMercadoDePnj {
  id: string
  nome: string
  preco: number
  produto: ProdutoDoMercadoDePnj
}

function adicionarInventarioItem(
  inventario: PartidaLocal["personagem"]["inventario"],
  idDaDefinicao: string,
  quantidade: number,
) {
  const existente = inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!existente) return [...inventario, { idDaDefinicao, quantidade }]
  return inventario.map((pilha) =>
    pilha.idDaDefinicao === idDaDefinicao
      ? { ...pilha, quantidade: pilha.quantidade + quantidade }
      : pilha,
  )
}

/**
 * Confere preço, saldo e capacidade antes de descontar ouro.
 * Itens somam à pilha; equipamentos recebem um novo ID da sequência da partida.
 */
export function comprarOfertaDoMercadoDePnj(
  partida: PartidaLocal,
  oferta: OfertaDoMercadoDePnj,
  agora: string,
): PartidaLocal {
  if (!Number.isInteger(oferta.preco) || oferta.preco < 0) {
    throw new Error("Preço inválido no Mercado PNJ.")
  }
  if (partida.personagem.ouro < oferta.preco) {
    throw new Error('Moedas insuficientes para essa compra.')
  }

  if (oferta.produto.tipo === 'item') {
    verificarCapacidadeParaPilhaNoInventario(partida, oferta.produto.idDaDefinicao, oferta.produto.quantidade)
    return {
      ...partida,
      atualizadoEm: agora,
      personagem: {
        ...partida.personagem,
        ouro: partida.personagem.ouro - oferta.preco,
        inventario: adicionarInventarioItem(
          partida.personagem.inventario,
          oferta.produto.idDaDefinicao,
          oferta.produto.quantidade,
        ),
      },
    }
  }

  verificarCapacidadeParaEquipamentoNoInventario(partida)
  // A sequência compartilhada evita colisões com equipamentos recebidos da classe, de presentes ou de fabricação.
  const idDaInstancia = `eq-${partida.personagem.proximaSequenciaDeEquipamento}`
  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      ouro: partida.personagem.ouro - oferta.preco,
      itensDeEquipamento: [
        ...partida.personagem.itensDeEquipamento,
        {
          idDaInstancia,
          idDaDefinicao: oferta.produto.idDaDefinicao,
          nivelDeReforco: 0,
        },
      ],
      proximaSequenciaDeEquipamento: partida.personagem.proximaSequenciaDeEquipamento + 1,
    },
  }
}
