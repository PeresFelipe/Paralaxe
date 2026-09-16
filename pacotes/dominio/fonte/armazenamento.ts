import type { PartidaLocal } from './personagem'

export const LIMITE_DE_ESPACOS_DO_INVENTARIO_V01 = 24
export const LIMITE_DE_ESPACOS_DO_BANCO_V01 = 80
export const LIMITE_DE_PILHA_DE_MATERIAIS_V01 = 9_999
export const LIMITE_DE_PILHA_DE_CONSUMIVEIS_V01 = 99

function validarQuantidade(quantidade: number) {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error('A quantidade transferida precisa ser um inteiro positivo.')
  }
}

function equipadoInstanciaIds(partida: PartidaLocal) {
  return new Set(Object.values(partida.personagem.equipamento))
}

export function obterPilhaLimite(idDaDefinicao: string) {
  return idDaDefinicao.startsWith("item.consumivel.") || idDaDefinicao.startsWith("item.comida.")
    ? LIMITE_DE_PILHA_DE_CONSUMIVEIS_V01
    : LIMITE_DE_PILHA_DE_MATERIAIS_V01
}

export function obterUsoDeEspacosDoInventario(partida: PartidaLocal) {
  const equipado = equipadoInstanciaIds(partida)
  const desequipadoEquipamento = partida.personagem.itensDeEquipamento.filter(
    (item) => !equipado.has(item.idDaInstancia),
  ).length
  return partida.personagem.inventario.length + desequipadoEquipamento
}

export function obterUsoDeEspacosDoBanco(partida: PartidaLocal) {
  return partida.personagem.banco.inventario.length + partida.personagem.banco.itensDeEquipamento.length
}

export function obterEspacoParaPilhaNoInventario(partida: PartidaLocal, idDaDefinicao: string) {
  const existente = partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!existente && obterUsoDeEspacosDoInventario(partida) >= LIMITE_DE_ESPACOS_DO_INVENTARIO_V01) return 0
  return Math.max(0, obterPilhaLimite(idDaDefinicao) - (existente?.quantidade ?? 0))
}

export function obterEspacoParaPilhaNoBanco(partida: PartidaLocal, idDaDefinicao: string) {
  const existente = partida.personagem.banco.inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!existente && obterUsoDeEspacosDoBanco(partida) >= LIMITE_DE_ESPACOS_DO_BANCO_V01) return 0
  return Math.max(0, obterPilhaLimite(idDaDefinicao) - (existente?.quantidade ?? 0))
}

export function obterEspacoParaEquipamentoNoInventario(partida: PartidaLocal) {
  return Math.max(0, LIMITE_DE_ESPACOS_DO_INVENTARIO_V01 - obterUsoDeEspacosDoInventario(partida))
}

export function verificarCapacidadeParaPilhaNoInventario(
  partida: PartidaLocal,
  idDaDefinicao: string,
  quantidade: number,
) {
  validarQuantidade(quantidade)
  if (obterEspacoParaPilhaNoInventario(partida, idDaDefinicao) < quantidade) {
    throw new Error('O Inventário não possui capacidade para esse item.')
  }
}

export function verificarCapacidadeParaEquipamentoNoInventario(partida: PartidaLocal, quantidade = 1) {
  validarQuantidade(quantidade)
  if (obterEspacoParaEquipamentoNoInventario(partida) < quantidade) {
    throw new Error("O Inventário está sem espaços livres para equipamento.")
  }
}

export function depositarPilhaDoInventarioNoBanco(
  partida: PartidaLocal,
  idDaDefinicao: string,
  quantidade: number,
  agora: string,
): PartidaLocal {
  validarQuantidade(quantidade)
  const origem = partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!origem || origem.quantidade < quantidade) {
    throw new Error('Quantidade insuficiente no Inventário.')
  }
  if (obterEspacoParaPilhaNoBanco(partida, idDaDefinicao) < quantidade) {
    throw new Error('O Banco não possui capacidade para esse item.')
  }

  const inventario = partida.personagem.inventario
    .map((pilha) =>
      pilha.idDaDefinicao === idDaDefinicao ? { ...pilha, quantidade: pilha.quantidade - quantidade } : pilha,
    )
    .filter((pilha) => pilha.quantidade > 0)
  const existenteBancoPilha = partida.personagem.banco.inventario.find(
    (pilha) => pilha.idDaDefinicao === idDaDefinicao,
  )
  const bancoInventario = existenteBancoPilha
    ? partida.personagem.banco.inventario.map((pilha) =>
        pilha.idDaDefinicao === idDaDefinicao ? { ...pilha, quantidade: pilha.quantidade + quantidade } : pilha,
      )
    : [...partida.personagem.banco.inventario, { idDaDefinicao, quantidade }]

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      inventario,
      banco: { ...partida.personagem.banco, inventario: bancoInventario },
    },
  }
}

export function retirarPilhaDoBancoParaInventario(
  partida: PartidaLocal,
  idDaDefinicao: string,
  quantidade: number,
  agora: string,
): PartidaLocal {
  validarQuantidade(quantidade)
  const origem = partida.personagem.banco.inventario.find((pilha) => pilha.idDaDefinicao === idDaDefinicao)
  if (!origem || origem.quantidade < quantidade) {
    throw new Error('Quantidade insuficiente no Banco.')
  }
  verificarCapacidadeParaPilhaNoInventario(partida, idDaDefinicao, quantidade)

  const bancoInventario = partida.personagem.banco.inventario
    .map((pilha) =>
      pilha.idDaDefinicao === idDaDefinicao ? { ...pilha, quantidade: pilha.quantidade - quantidade } : pilha,
    )
    .filter((pilha) => pilha.quantidade > 0)
  const existenteInventarioPilha = partida.personagem.inventario.find(
    (pilha) => pilha.idDaDefinicao === idDaDefinicao,
  )
  const inventario = existenteInventarioPilha
    ? partida.personagem.inventario.map((pilha) =>
        pilha.idDaDefinicao === idDaDefinicao ? { ...pilha, quantidade: pilha.quantidade + quantidade } : pilha,
      )
    : [...partida.personagem.inventario, { idDaDefinicao, quantidade }]

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      inventario,
      banco: { ...partida.personagem.banco, inventario: bancoInventario },
    },
  }
}

export function depositarEquipamentoNoBanco(
  partida: PartidaLocal,
  idDaInstancia: string,
  agora: string,
): PartidaLocal {
  const instancia = partida.personagem.itensDeEquipamento.find((item) => item.idDaInstancia === idDaInstancia)
  if (!instancia) throw new Error('Equipamento não encontrado no Inventário.')
  if (equipadoInstanciaIds(partida).has(idDaInstancia)) {
    throw new Error('Desequipe o item antes de depositá-lo no Banco.')
  }
  if (obterUsoDeEspacosDoBanco(partida) >= LIMITE_DE_ESPACOS_DO_BANCO_V01) {
    throw new Error("O Banco está sem espaços livres.")
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      itensDeEquipamento: partida.personagem.itensDeEquipamento.filter((item) => item.idDaInstancia !== idDaInstancia),
      banco: {
        ...partida.personagem.banco,
        itensDeEquipamento: [...partida.personagem.banco.itensDeEquipamento, instancia],
      },
    },
  }
}

export function retirarEquipamentoDoBanco(
  partida: PartidaLocal,
  idDaInstancia: string,
  agora: string,
): PartidaLocal {
  const instancia = partida.personagem.banco.itensDeEquipamento.find((item) => item.idDaInstancia === idDaInstancia)
  if (!instancia) throw new Error('Equipamento não encontrado no Banco.')
  verificarCapacidadeParaEquipamentoNoInventario(partida)
  if (partida.personagem.itensDeEquipamento.some((item) => item.idDaInstancia === idDaInstancia)) {
    throw new Error('A instância de equipamento já existe no Inventário.')
  }

  return {
    ...partida,
    atualizadoEm: agora,
    personagem: {
      ...partida.personagem,
      itensDeEquipamento: [...partida.personagem.itensDeEquipamento, instancia],
      banco: {
        ...partida.personagem.banco,
        itensDeEquipamento: partida.personagem.banco.itensDeEquipamento.filter((item) => item.idDaInstancia !== idDaInstancia),
      },
    },
  }
}
