/** Catálogo de reconstrução. Custos e textos pertencem ao conteúdo, não ao React. */
import type { DefinicaoDoDistrito, IdDoDistrito } from '@greywake/dominio'

export const ESTAGIOS_DA_CIDADE = [
  { id: 0, nome: 'Cinzas da Fundação', descricao: 'A cidade resiste entre ruínas, névoa e silêncio.' },
  { id: 1, nome: 'Primeiras Chamas', descricao: 'As primeiras lanternas anunciam que a reconstrução começou.' },
  { id: 2, nome: 'Vila Desperta', descricao: 'Oficinas e comércio devolvem movimento às ruas.' },
  { id: 3, nome: 'Bastião da Esperança', descricao: 'Muralhas e praças recebem novos guardiões.' },
  { id: 4, nome: 'Cidade Reerguida', descricao: 'O povoado se ergueu como um novo refúgio.' },
] as const

export const DISTRITOS_DA_CIDADE: readonly DefinicaoDoDistrito[] = [
  { id: 'praca', nome: 'Praça Central', descricao: 'Reacenda o ponto de encontro da comunidade.', custosPorNivel: [3, 7, 14, 25] },
  { id: 'taverna', nome: 'Taverna', descricao: 'Mais luzes, abrigo e histórias ao redor do fogo.', custosPorNivel: [3, 8, 15, 27] },
  { id: 'ferreiro', nome: 'Ferreiro', descricao: 'A oficina volta a ecoar metal e esperança.', custosPorNivel: [4, 9, 17, 30] },
  { id: 'mercado', nome: 'Mercado', descricao: 'Os mercadores ocupam novamente os caminhos.', custosPorNivel: [4, 10, 18, 32] },
  { id: 'banco', nome: 'Armazém', descricao: 'O depósito volta a proteger os bens da cidade.', custosPorNivel: [4, 10, 19, 33] },
  { id: 'relicario', nome: 'Relicário', descricao: 'Os símbolos esquecidos retornam às paredes.', custosPorNivel: [5, 11, 20, 35] },
  { id: 'codice', nome: 'Biblioteca / Códice', descricao: 'Livros e manuscritos reocupam as estantes.', custosPorNivel: [5, 12, 21, 38] },
  { id: 'muralhas', nome: 'Muralhas e Portão', descricao: 'Pedra a pedra, a proteção é restaurada.', custosPorNivel: [6, 13, 23, 40] },
]

export function obterDistritoDaCidade(id: IdDoDistrito): DefinicaoDoDistrito {
  const distrito = DISTRITOS_DA_CIDADE.find(item => item.id === id)
  if (!distrito) throw new Error(`Distrito desconhecido: ${id}`)
  return distrito
}

/** Imagens e camadas só são requisitadas quando estiverem presentes e habilitadas. */
export interface CamadaDaCidade {
  id: IdDoDistrito
  nivelMinimo: number
  caminho: string
  disponivel: boolean
}

export interface CenaDaCidadeDefinida {
  estagio: number
  caminho: string
  disponivel: boolean
  /** PNGs/WebP transparentes, alinhados à mesma cena 16:9. */
  camadas: readonly CamadaDaCidade[]
}

export const CENAS_DA_CIDADE: readonly CenaDaCidadeDefinida[] = [0, 1, 2, 3, 4].map(estagio => ({
  estagio,
  caminho: `/arte/cidade/cidade-estagio-${estagio}.webp`,
  disponivel: true,
  camadas: DISTRITOS_DA_CIDADE.map(distrito => ({
    id: distrito.id,
    nivelMinimo: 1,
    caminho: `/arte/cidade/camadas/${distrito.id}.webp`,
    disponivel: false,
  })),
}))
