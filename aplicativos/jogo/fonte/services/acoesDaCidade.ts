import { obterProjetoDaCidade, OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ } from '@paralaxe/conteudo'
import { comprarOfertaDoMercadoDePnj, concluirProjeto } from '@paralaxe/dominio'
import type { PortasDasAcoes } from './portasDasAcoes'

export function criarAcoesDaCidade({ persistir, agora }: PortasDasAcoes) {
  return {
    tratarConcluirProjeto: async (id: string) => {
      const projeto = obterProjetoDaCidade(id)
      if (!projeto) throw new Error('Projeto de reconstrução desconhecido.')
      await persistir(atual => concluirProjeto(atual, projeto, agora()), `Construção restaurada: ${projeto.nome}.`)
    },
    tratarComprarOfertaDoMercado: async (id: string) => {
      const oferta = OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ.find(oferta => oferta.id === id)
      if (!oferta) throw new Error('Oferta do Mercado desconhecida.')
      await persistir(atual => comprarOfertaDoMercadoDePnj(atual, oferta, agora()), `${oferta.nome} comprado por ${oferta.preco} moedas.`)
    },
  }
}
