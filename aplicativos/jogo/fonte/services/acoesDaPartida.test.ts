import { describe, expect, it, vi } from 'vitest'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, ATIVIDADES_OCIOSAS_INICIAIS } from '@paralaxe/conteudo'
import { criarPartidaLocal } from '@paralaxe/dominio'
import { criarFilaDeAlteracoesDaPartida, type AlteracaoDaPartida } from './alteracoesDaPartida'
import { criarAcoesDeOficios } from './acoesDeOficios'
import { criarAcoesDoPersonagem } from './acoesDoPersonagem'
import { criarAcoesDaCidade } from './acoesDaCidade'

const agora = '2026-11-08T00:00:00.000Z'
function ambiente() {
  let atual = criarPartidaLocal({ idDaPartida: 'teste', criadoEm: agora, versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: CLASSES_DE_PERSONAGEM[0]!, presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')! })
  const salvar = vi.fn(async () => {})
  const fila = criarFilaDeAlteracoesDaPartida({ obterAtual: () => atual, salvar, confirmar: nova => { atual = nova } })
  let emRisco = false
  const portas = { persistir: (alterar: AlteracaoDaPartida) => fila.aplicar(alterar), agora: () => agora, estaEmRisco: () => emRisco }
  return { portas, salvar, obter: () => atual, risco: () => { emRisco = true } }
}

describe('comandos extraídos da coordenação React', () => {
  it('propaga falha de gravação sem alterar o estado e permite repetir a mesma ação', async () => {
    const a = ambiente()
    const acao = criarAcoesDeOficios(a.portas)
    const id = ATIVIDADES_OCIOSAS_INICIAIS.find(x => x.idDaProfissao === 'mineracao' && x.nivelExigidoDaProfissao === 1)!.id
    a.salvar.mockRejectedValueOnce(new Error('Disco cheio'))
    await expect(acao.tratarIniciarAtividade(id)).rejects.toThrow('Disco cheio')
    expect(a.obter().ocioso.atividadeAtiva).toBeNull()
    await acao.tratarIniciarAtividade(id)
    expect(a.obter().ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade).toBe(id)
  })
  it('reavalia risco ao executar a fila, inclusive quando o comando já foi solicitado', async () => {
    const a = ambiente()
    const acao = criarAcoesDeOficios(a.portas)
    const pedido = acao.tratarPararTrabalho()
    a.risco()
    await expect(pedido).rejects.toThrow('lugar seguro')
    expect(a.salvar).not.toHaveBeenCalled()
  })
  it('recusa referências ausentes com rejeição observável, sem falso sucesso', async () => {
    const a = ambiente()
    await expect(criarAcoesDoPersonagem(a.portas).tratarEquipar('ausente')).rejects.toThrow('Equipamento não encontrado')
    await expect(criarAcoesDaCidade(a.portas).tratarComprarOfertaDoMercado('ausente')).rejects.toThrow('desconhecida')
    expect(a.salvar).not.toHaveBeenCalled()
  })
})
