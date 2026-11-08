/** Comandos do personagem; pré-condições são avaliadas dentro da mesma fila que salva a alteração. */
import { CLASSES_DE_PERSONAGEM, obterDefinicaoDeEquipamento, obterDefinicaoDeReceitaDeFabricacao } from '@paralaxe/conteudo'
import { desbloquearNoDePrestigioDoPersonagem, distribuirPontosDeAtributo, equiparItem,
  escolherMetaDaJornada, realizarPrestigioDoPersonagem, type DistribuicaoDeAtributos } from '@paralaxe/dominio'
import type { PortasDasAcoes } from './portasDasAcoes'
import { processarTrabalhoAtual } from './partida'

export function criarAcoesDoPersonagem({ persistir, agora, estaEmRisco }: PortasDasAcoes) {
  return {
    tratarEquipar: async (id: string) => {
      await persistir(atual => {
        const instancia = atual.personagem.itensDeEquipamento.find(item => item.idDaInstancia === id)
        const definicao = instancia && obterDefinicaoDeEquipamento(instancia.idDaDefinicao)
        if (!definicao) throw new Error('Equipamento não encontrado.')
        const instante = agora()
        return equiparItem(processarTrabalhoAtual(atual, instante).partida, id, definicao, instante)
      }, 'Equipamento atualizado.')
    },
    tratarDistribuirAtributos: async (distribuicao: DistribuicaoDeAtributos) => {
      await persistir(atual => distribuirPontosDeAtributo(atual, distribuicao, agora()), 'Distribuição de atributos confirmada.')
    },
    tratarDesbloquearPrestigioNo: async (id: string) => {
      await persistir(atual => desbloquearNoDePrestigioDoPersonagem(atual, id, agora()), 'Nó de Prestígio desbloqueado.')
    },
    tratarRealizarPersonagemPrestigio: async () => {
      await persistir(atual => {
        const classe = CLASSES_DE_PERSONAGEM.find(classe => classe.id === atual.personagem.idDaClasse)
        if (!classe) throw new Error('Classe não encontrada no catálogo atual.')
        return realizarPrestigioDoPersonagem(atual, classe.atributos, agora())
      }, 'Prestígio realizado. A nova jornada começa no nível 1.')
    },
    tratarEscolherJornadaMeta: async (id: string | null) => {
      await persistir(atual => {
        if (estaEmRisco()) throw new Error('Escolha sua meta após retornar a um lugar seguro.')
        const receita = id ? obterDefinicaoDeReceitaDeFabricacao(id) : null
        if (id && !receita) throw new Error('Receita não encontrada.')
        const instante = agora()
        return escolherMetaDaJornada(processarTrabalhoAtual(atual, instante).partida, receita, instante)
      })
    },
  }
}
