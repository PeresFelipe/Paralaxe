/** Conteúdo da Cidade Viva: 32 projetos alcançáveis usando apenas marcos e materiais existentes. */
import type { DefinicaoDeProjetoDaCidade, IdDoDistrito, MarcoDaCidade, MaterialDoProjeto } from '@paralaxe/dominio'

const MARCOS = {
  nivel: (nivel: number): MarcoDaCidade => ({ tipo: 'nivel-personagem', nivel }),
  oficio: (id: 'mineracao' | 'lenhador' | 'pesca' | 'herbologia' | 'metalurgia' | 'forja' | 'culinaria', nivel: number): MarcoDaCidade => ({ tipo: 'profissao', id, nivel }),
  oficioPrestigio: (id: 'mineracao' | 'lenhador' | 'pesca' | 'herbologia' | 'metalurgia' | 'forja' | 'culinaria', nivel: number): MarcoDaCidade => ({ tipo: 'prestigio-profissao', id, nivel }),
  codice: (quantidade: number): MarcoDaCidade => ({ tipo: 'codice', quantidade }),
  desafio: (id: string): MarcoDaCidade => ({ tipo: 'desafio', id }),
  receita: (id: string): MarcoDaCidade => ({ tipo: 'receita', id }),
  material: (id: string): MarcoDaCidade => ({ tipo: 'material-descoberto', id }),
  vitoria: { tipo: 'combate-vitoria' } as const,
  dunLiath: { tipo: 'dun-liath' } as const,
}
const ITENS = {
  cloch: ['material.cloch', 'Cloch'],
  giuis: ['material.giuis', 'Giúis'],
  scadan: ['material.scadan', 'Scadán'],
  neantog: ['material.neantog', 'Neantóg'],
} as const
function material(id: keyof typeof ITENS, quantidade: number): MaterialDoProjeto {
  return { idDaDefinicao: ITENS[id][0], nome: ITENS[id][1], quantidade }
}
interface Etapa { nome: string; descricao: string; conclusao: string; requisitos: readonly MarcoDaCidade[]; materiais: readonly MaterialDoProjeto[]; ouro: number; dependencias?: DefinicaoDeProjetoDaCidade['dependencias'] }
/** Os recursos são locais ao conteúdo 0.1 e não exigem uma nova economia. */
const ETAPAS: Record<IdDoDistrito, readonly [Etapa, Etapa, Etapa, Etapa]> = {
  praca: [
    { nome: 'Reabrir a Praça', descricao: 'Remova os destroços e reacenda o centro da vila.', conclusao: 'O povo voltou a encontrar um lugar para se reunir.', requisitos: [MARCOS.nivel(1)], materiais: [material('giuis', 3), material('cloch', 2)], ouro: 0 },
    { nome: 'Restaurar os Caminhos', descricao: 'Ligue as antigas ruas da Cidade Livre.', conclusao: 'Passos e carroças retornaram aos caminhos recuperados.', requisitos: [MARCOS.oficio('lenhador', 3)], materiais: [material('giuis', 9), material('cloch', 7)], ouro: 10 },
    { nome: 'Monumento dos Viajantes', descricao: 'Erga um marco à memória de quem resistiu.', conclusao: 'O monumento conta histórias sem uma palavra.', requisitos: [MARCOS.desafio('desafio.primeira-vitoria')], materiais: [material('cloch', 18), material('giuis', 14)], ouro: 25 },
    { nome: 'Coração da Cidade', descricao: 'Reúna todos os bairros em uma praça renovada.', conclusao: 'A Cidade Livre recuperou seu coração.', requisitos: [MARCOS.codice(10)], materiais: [material('cloch', 30), material('giuis', 28), material('neantog', 9)], ouro: 40 },
  ],
  taverna: [
    { nome: 'Reabrir o Salão', descricao: 'Devolva calor e abrigo aos viajantes.', conclusao: 'O fogo da Taverna voltou a aquecer os caminhos.', requisitos: [MARCOS.vitoria], materiais: [material('giuis', 5), material('scadan', 2)], ouro: 0 },
    { nome: 'Reforçar as Estruturas', descricao: 'Restabeleça o telhado e os alojamentos.', conclusao: 'Agora há lugar para quem precisa descansar.', requisitos: [MARCOS.oficio('lenhador', 4)], materiais: [material('giuis', 14), material('cloch', 6)], ouro: 10 },
    { nome: 'Ampliar a Hospedaria', descricao: 'Prepare refeições e reabra quartos antigos.', conclusao: 'O cheiro de comida atravessa a praça.', requisitos: [MARCOS.receita('receita.culinaria.assado-scadan')], materiais: [material('giuis', 24), material('scadan', 14)], ouro: 22 },
    { nome: 'Taverna dos Heróis', descricao: 'Faça do salão um ponto de encontro lendário.', conclusao: 'Um novo capítulo das histórias da Cidade Livre foi escrito.', requisitos: [MARCOS.desafio('desafio.contrato-dun-liath')], materiais: [material('giuis', 40), material('scadan', 25)], ouro: 55 },
  ],
  ferreiro: [
    { nome: 'Reacender a Forja', descricao: 'O metal volta a receber forma pelas mãos do artesão.', conclusao: 'O som do metal voltou a ecoar pela Cidade Livre.', requisitos: [MARCOS.receita('receita.metalurgia.tratada-cloch')], materiais: [material('cloch', 5), material('giuis', 3)], ouro: 0 },
    { nome: 'Recuperar as Ferramentas', descricao: 'Reponha tenazes, martelos e madeira de apoio.', conclusao: 'O Ferreiro recuperou suas ferramentas.', requisitos: [MARCOS.oficio('metalurgia', 4)], materiais: [material('cloch', 15), material('giuis', 12)], ouro: 12 },
    { nome: 'Oficina Avançada', descricao: 'Prepare a oficina para trabalhos de maior precisão.', conclusao: 'Uma nova geração de ferramentas tomou forma.', requisitos: [MARCOS.receita('receita.forja.giuis-bracadeiras')], materiais: [material('cloch', 25), material('giuis', 22)], ouro: 30 },
    { nome: 'Forja-Mestra', descricao: 'Consolide a tradição metalúrgica da cidade.', conclusao: 'A Forja-Mestra iluminou a noite de Paralaxe.', requisitos: [MARCOS.oficio('forja', 8)], materiais: [material('cloch', 45), material('giuis', 35)], ouro: 70 },
  ],
  mercado: [
    { nome: 'Reabrir as Barracas', descricao: 'Restabeleça o comércio na praça.', conclusao: 'Mercadores começaram a voltar.', requisitos: [MARCOS.material('material.giuis')], materiais: [material('giuis', 4), material('cloch', 2)], ouro: 0 },
    { nome: 'Organizar a Feira', descricao: 'Crie espaços seguros para as trocas.', conclusao: 'A feira tornou-se parte da vida da cidade.', requisitos: [MARCOS.oficio('mineracao', 3)], materiais: [material('giuis', 10), material('scadan', 6)], ouro: 15 },
    { nome: 'Rotas Comerciais', descricao: 'Recupere as antigas rotas de abastecimento.', conclusao: 'Novas caravanas cortam os caminhos novamente.', requisitos: [MARCOS.oficio('pesca', 6)], materiais: [material('giuis', 20), material('cloch', 16), material('scadan', 9)], ouro: 35 },
    { nome: 'Grande Mercado', descricao: 'Consolide a Cidade Livre como ponto de troca.', conclusao: 'Os pavilhões mercantis voltaram a prosperar.', requisitos: [MARCOS.codice(15)], materiais: [material('giuis', 35), material('cloch', 28), material('scadan', 16)], ouro: 70 },
  ],
  banco: [
    { nome: 'Recuperar o Depósito', descricao: 'Crie espaço para os suprimentos do povoado.', conclusao: 'O depósito voltou a guardar provisões.', requisitos: [MARCOS.material('material.cloch')], materiais: [material('giuis', 4), material('cloch', 3)], ouro: 0 },
    { nome: 'Organizar os Estoques', descricao: 'Organize ferramentas e mercadorias.', conclusao: 'Nada mais fica perdido entre os escombros.', requisitos: [MARCOS.oficio('lenhador', 3)], materiais: [material('giuis', 12), material('cloch', 9)], ouro: 10 },
    { nome: 'Reforçar o Armazém', descricao: 'Reforce as portas e os depósitos.', conclusao: 'As reservas estão mais protegidas.', requisitos: [MARCOS.oficio('mineracao', 5)], materiais: [material('giuis', 24), material('cloch', 23)], ouro: 30 },
    { nome: 'Grande Celeiro', descricao: 'Estabeleça um símbolo de segurança e fartura.', conclusao: 'O armazém tornou-se uma promessa de futuro.', requisitos: [MARCOS.oficio('lenhador', 8)], materiais: [material('giuis', 48), material('cloch', 32), material('neantog', 12)], ouro: 60 },
  ],
  relicario: [
    { nome: 'Recuperar o Altar', descricao: 'Reúna as peças esquecidas do santuário.', conclusao: 'A pedra antiga tornou a receber visitantes.', requisitos: [MARCOS.codice(3)], materiais: [material('cloch', 4), material('neantog', 3)], ouro: 0 },
    { nome: 'Restaurar os Símbolos', descricao: 'Recupere inscrições e relicários antigos.', conclusao: 'As inscrições sobreviventes voltaram à luz.', requisitos: [MARCOS.codice(6)], materiais: [material('cloch', 14), material('neantog', 10)], ouro: 12 },
    { nome: 'Câmara das Relíquias', descricao: 'Proteja os fragmentos do passado.', conclusao: 'Uma nova câmara foi preparada para as descobertas.', requisitos: [MARCOS.desafio('desafio.codice-10')], materiais: [material('cloch', 25), material('neantog', 18)], ouro: 35 },
    { nome: 'Grande Relicário', descricao: 'Consagre a memória da Cidade Livre.', conclusao: 'O relicário se tornou um farol de memória.', requisitos: [MARCOS.dunLiath], materiais: [material('cloch', 42), material('neantog', 26)], ouro: 75 },
  ],
  codice: [
    { nome: 'Reabrir o Arquivo', descricao: 'Salve os registros que restaram da cidade.', conclusao: 'As primeiras páginas voltaram às estantes.', requisitos: [MARCOS.codice(2)], materiais: [material('giuis', 5), material('neantog', 2)], ouro: 0 },
    { nome: 'Recuperar os Manuscritos', descricao: 'Reconstrua o arquivo danificado.', conclusao: 'Manuscritos antes esquecidos puderam ser consultados.', requisitos: [MARCOS.codice(5)], materiais: [material('giuis', 13), material('neantog', 8)], ouro: 12 },
    { nome: 'Restaurar a Biblioteca', descricao: 'Reabra a sala principal de leitura.', conclusao: 'O conhecimento voltou a encontrar abrigo.', requisitos: [MARCOS.codice(10)], materiais: [material('giuis', 22), material('neantog', 16)], ouro: 25 },
    { nome: 'Grande Acervo', descricao: 'Reúna os registros das eras esquecidas.', conclusao: 'A biblioteca voltou a guardar a memória do mundo.', requisitos: [MARCOS.codice(18)], materiais: [material('giuis', 38), material('neantog', 26)], ouro: 70 },
  ],
  muralhas: [
    { nome: 'Primeira Paliçada', descricao: 'Proteja o povoado de ameaças próximas.', conclusao: 'O primeiro limite seguro voltou a ser erguido.', requisitos: [MARCOS.vitoria], materiais: [material('giuis', 6), material('cloch', 4)], ouro: 0 },
    { nome: 'Recuperar os Portões', descricao: 'Reforce os caminhos de entrada.', conclusao: 'Os portões estão novamente sob guarda.', requisitos: [MARCOS.nivel(4)], materiais: [material('giuis', 16), material('cloch', 14)], ouro: 15 },
    { nome: 'Reforçar as Torres', descricao: 'Recupere os antigos pontos de observação.', conclusao: 'As torres voltaram a vigiar os arredores.', requisitos: [MARCOS.desafio('desafio.primeira-vitoria')], materiais: [material('giuis', 28), material('cloch', 25)], ouro: 40 },
    { nome: 'Grandes Muralhas', descricao: 'Complete a defesa permanente do refúgio.', conclusao: 'As muralhas da Cidade Livre voltaram a proteger seu povo.', requisitos: [MARCOS.dunLiath], materiais: [material('giuis', 45), material('cloch', 46)], ouro: 85 },
  ],
}

/** IDs não dependem de textos traduzidos nem de posições na interface. */
export const PROJETOS_DA_CIDADE: readonly DefinicaoDeProjetoDaCidade[] = Object.entries(ETAPAS).flatMap(([id, etapas]) => etapas.map((etapa, indice) => ({
  id: `cidade.${id}.nivel-${indice + 1}`,
  distrito: id as IdDoDistrito,
  nivel: (indice + 1) as 1 | 2 | 3 | 4,
  ...etapa,
})))

export function obterProjetoDaCidade(id: string): DefinicaoDeProjetoDaCidade | null {
  return PROJETOS_DA_CIDADE.find(projeto => projeto.id === id) ?? null
}
