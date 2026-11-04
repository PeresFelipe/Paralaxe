/**
 * @file Testes de transformação de ingredientes, parada por falta de material e reforço.
 * Os horários fixos permitem processar ciclos completos sem esperar tempo real;
 * a receita de teste é independente dos números de balanceamento do catálogo publicado.
 */
import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import { processarProgressoDeFabricacao, iniciarReceitaDeFabricacao, type DefinicaoDeReceitaDeFabricacao } from './fabricacao'
import { obterValorPrincipalDoEquipamento, type DefinicaoDeEquipamento } from './equipamento'

const classeDefinicao: DefinicaoDeClasseDoPersonagem = {
  id: "errante",
  nome: 'Errante',
  resumo: 'Equilibrado.',
  atributos: {
    vitalidade: 5,
    mente: 5,
    vigor: 5,
    forca: 5,
    destreza: 5,
    inteligencia: 5,
    fe: 5,
  },
  equipamentosIniciais: { maoPrincipal: "arma.viagem-lanca" },
  idDaHabilidadeInicial: "habilidade.abertura",
}

const presenteDefinicao: DefinicaoDePresente = {
  id: "nenhum",
  nome: 'Nenhum Presente',
  resumo: 'Sem vantagem.',
  concessoes: [],
}

const tratadaClochReceita: DefinicaoDeReceitaDeFabricacao = {
  id: "receita.metalurgia.tratada-cloch",
  idDaProfissao: "metalurgia",
  nome: 'Cloch Tratada',
  nivelExigidoDaProfissao: 1,
  segundosPorAcao: 6,
  xpDeProfissaoPorAcao: 12,
  ingredientes: [{ idDaDefinicao: 'material.cloch', quantidade: 3 }],
  saida: { tipo: 'item', idDaDefinicao: "material.tratada-cloch", nome: 'Cloch Tratada', quantidade: 1 },
}

const reforcoReceita: DefinicaoDeReceitaDeFabricacao = {
  id: "receita.forja.simples-reforco-1",
  idDaProfissao: "forja",
  nome: 'Reforço Simples +1',
  nivelExigidoDaProfissao: 1,
  segundosPorAcao: 15,
  xpDeProfissaoPorAcao: 30,
  ingredientes: [{ idDaDefinicao: "material.tratada-cloch", quantidade: 2 }],
  saida: { tipo: "equipamento-reforco", nome: 'Reforço Simples +1' },
}

/** Cria um estado novo com identidade e horário fixos, isolando as alterações de cada caso. */
function criarPartida() {
  return criarPartidaLocal({
    idDaPartida: "partida-fabricacao",
    criadoEm: '2026-09-09T12:00:00.000Z',
    versaoDoConteudo: '0.1.0-dev',
    nomeDoPersonagem: 'Ailith',
    classeDoPersonagem: classeDefinicao,
    presente: presenteDefinicao,
  })
}

describe("fabricação", () => {
  it("consome ingredientes e produz um resultado determinístico", () => {
    const base = criarPartida()
    const comMateriais = {
      ...base,
      personagem: {
        ...base.personagem,
        inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 6 }],
      },
    }

    const iniciado = iniciarReceitaDeFabricacao(comMateriais, tratadaClochReceita, '2026-09-09T12:00:00.000Z')
    const resultado = processarProgressoDeFabricacao(iniciado, tratadaClochReceita, '2026-09-09T12:00:12.000Z')

    expect(resultado.acoesConcluidas).toBe(2)
    expect(resultado.itensProduzidos).toBe(2)
    expect(resultado.partida.personagem.inventario).toContainEqual({ idDaDefinicao: "material.tratada-cloch", quantidade: 2 })
    expect(resultado.partida.personagem.inventario).not.toContainEqual({ idDaDefinicao: 'material.cloch', quantidade: 6 })
    expect(resultado.partida.profissoes.metalurgia.xp).toBe(24)
  })

  it("interrompe a produção quando acabam os materiais", () => {
    const base = criarPartida()
    const comMateriais = {
      ...base,
      personagem: {
        ...base.personagem,
        inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 3 }],
      },
    }

    const iniciado = iniciarReceitaDeFabricacao(comMateriais, tratadaClochReceita, '2026-09-09T12:00:00.000Z')
    const resultado = processarProgressoDeFabricacao(iniciado, tratadaClochReceita, '2026-09-09T12:00:12.000Z')

    expect(resultado.acoesConcluidas).toBe(1)
    expect(resultado.interrompidoPorMateriais).toBe(true)
    expect(resultado.partida.fabricacao.receitaAtiva).toBeNull()
  })

  it("reforça uma instância específica de equipamento de +0 para +1", () => {
    const base = criarPartida()
    // O reforço precisa apontar para uma instância: outras peças do mesmo modelo não devem mudar.
    const alvoId = base.personagem.equipamento.maoPrincipal
    if (!alvoId) throw new Error('Equipamento inicial ausente no teste.')

    const comMateriais = {
      ...base,
      personagem: {
        ...base.personagem,
        inventario: [{ idDaDefinicao: "material.tratada-cloch", quantidade: 2 }],
      },
    }

    const iniciado = iniciarReceitaDeFabricacao(comMateriais, reforcoReceita, '2026-09-09T12:00:00.000Z', alvoId)
    const resultado = processarProgressoDeFabricacao(iniciado, reforcoReceita, '2026-09-09T12:00:15.000Z')

    expect(resultado.equipamentosReforcados).toBe(1)
    expect(resultado.partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === alvoId)?.nivelDeReforco).toBe(1)
    expect(resultado.partida.fabricacao.receitaAtiva).toBeNull()
  })


  it('exige componente especial de chefe para +2 e preserva afixos e raridade', () => {
    const base = criarPartida()
    const alvoId = base.personagem.equipamento.maoPrincipal
    if (!alvoId) throw new Error('Equipamento inicial ausente.')
    const receitaEspecial: DefinicaoDeReceitaDeFabricacao = {
      id: 'receita.forja.reforco-dun-liath-2', idDaProfissao: 'forja',
      nome: 'Reforço de Dún Liath +2', nivelExigidoDaProfissao: 1,
      segundosPorAcao: 45, xpDeProfissaoPorAcao: 90,
      ingredientes: [
        { idDaDefinicao: 'item.fairtheoir-fragmento', quantidade: 1 },
        { idDaDefinicao: 'material.lingote-iarann', quantidade: 2 },
      ],
      saida: { tipo: 'equipamento-reforco', nome: 'Reforço +2', nivelDeReforcoAlvo: 2 },
    }
    const comItens = {
      ...base, personagem: {
        ...base.personagem,
        inventario: [{ idDaDefinicao: 'item.fairtheoir-fragmento', quantidade: 1 }, { idDaDefinicao: 'material.lingote-iarann', quantidade: 2 }],
        itensDeEquipamento: base.personagem.itensDeEquipamento.map(i => i.idDaInstancia === alvoId
          ? { ...i, nivelDeReforco: 1 as const, raridade: 'raro' as const, idsDosAfixos: ['afixo.vigor-1'] } : i),
      },
    }
    expect(() => iniciarReceitaDeFabricacao(base, receitaEspecial, '2026-09-09T12:00:00.000Z', alvoId)).toThrow('Materiais insuficientes')
    const semNivel = { ...comItens, personagem: { ...comItens.personagem,
      itensDeEquipamento: comItens.personagem.itensDeEquipamento.map(i => i.idDaInstancia === alvoId
        ? { ...i, nivelDeReforco: 0 as const } : i) } }
    expect(() => iniciarReceitaDeFabricacao(semNivel, receitaEspecial, '2026-09-09T12:00:00.000Z', alvoId)).toThrow('exige equipamento +1')
    const pronto = iniciarReceitaDeFabricacao(comItens, receitaEspecial, '2026-09-09T12:00:00.000Z', alvoId)
    const resultado = processarProgressoDeFabricacao(pronto, receitaEspecial, '2026-09-09T12:00:45.000Z')
    const reforcado = resultado.partida.personagem.itensDeEquipamento.find(i => i.idDaInstancia === alvoId)
    expect(reforcado).toEqual({ idDaInstancia: alvoId, idDaDefinicao: reforcado?.idDaDefinicao,
      nivelDeReforco: 2, raridade: 'raro', idsDosAfixos: ['afixo.vigor-1'] })
    expect(resultado.equipamentosReforcados).toBe(1)
    expect(resultado.partida.fabricacao.receitaAtiva).toBeNull()
    expect(resultado.partida.personagem.inventario).toEqual([])
    expect(() => iniciarReceitaDeFabricacao(resultado.partida, receitaEspecial, '2026-09-09T12:01:00.000Z', alvoId)).toThrow()
    const lanca: DefinicaoDeEquipamento = { id: 'arma.teste', nome: 'Teste', espaco: 'maoPrincipal',
      estatisticaPrincipal: { tipo: 'ataque', valor: 13 } }
    expect(obterValorPrincipalDoEquipamento(lanca, 2)).toBe(17)
  })

  it("aplica a regra provisória de +15% à estatística principal com arredondamento para cima", () => {
    const lanca: DefinicaoDeEquipamento = {
      id: "arma.viagem-lanca",
      nome: 'Lança de Viagem',
      espaco: "maoPrincipal",
      estatisticaPrincipal: { tipo: "ataque", valor: 13 },
    }

    expect(obterValorPrincipalDoEquipamento(lanca, 0)).toBe(13)
    expect(obterValorPrincipalDoEquipamento(lanca, 1)).toBe(15)
  })
})
