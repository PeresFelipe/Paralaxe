import assert from 'node:assert/strict';
import {
  criarEstadoInicialDaVigilia, iniciarVigilia, concluirVigilia, cancelarVigilia,
  consultarMelhoria, melhorarDistrito, obterEstagioDaCidade, validarEstadoDaVigilia,
  calcularBrasasDaVigilia
} from '../pacotes/dominio/fonte/vigiliaDaCidade.ts';
const base = () => ({ atualizadoEm: '2026-11-03T10:00:00.000Z', vigilia: criarEstadoInicialDaVigilia(), jornada: { meta: null }, personagem: { ouro: 95, inventario: [1] }, ocioso: { atividadeAtiva: { id: 'x' } } });
const t1 = '2026-11-03T10:00:00.000Z';
const t2 = '2026-11-03T10:25:00.000Z';
const tmp = iniciarVigilia(base(), { id: 'test-1', nome: 'Estudo', duracaoMinutos: 25 }, t1);
assert.equal(tmp.vigilia.sessaoAtiva?.nome, 'Estudo');
assert.equal(calcularBrasasDaVigilia(25), 5);
assert.equal(calcularBrasasDaVigilia(60), 12);
assert.throws(() => iniciarVigilia(tmp, { id: 'test-2', nome: 'Duplicada', duracaoMinutos: 25 }, t1));
assert.throws(() => concluirVigilia(tmp, 'test-1', '2026-11-03T10:24:59.000Z'));
const restored = structuredClone(tmp);
assert.equal(restored.vigilia.saldoBrasas, 0);
const finished = concluirVigilia(restored, 'test-1', t2);
assert.equal(finished.vigilia.saldoBrasas, 5);
assert.equal(finished.vigilia.minutosDeFoco, 25);
assert.strictEqual(concluirVigilia(finished, 'test-1', t2), finished);
assert.deepEqual(finished.jornada, tmp.jornada);
assert.deepEqual(finished.ocioso, tmp.ocioso);
const definicao = { id:'taverna', nome:'Taverna', descricao:'Teste', custosPorNivel:[3,8,15,27] };
assert.equal(consultarMelhoria(finished.vigilia, definicao).permitido, true);
const upgraded = melhorarDistrito(finished, definicao, t2);
assert.equal(upgraded.vigilia.saldoBrasas, 2);
assert.equal(upgraded.vigilia.distritos.taverna, 1);
assert.equal(consultarMelhoria(upgraded.vigilia, definicao).permitido, false);
assert.throws(() => melhorarDistrito(upgraded, definicao, t2));
assert.equal(obterEstagioDaCidade(upgraded.vigilia), 0);
const cancelled = cancelarVigilia(iniciarVigilia(upgraded,{id:'test-3',nome:'Leitura',duracaoMinutos:15},t2),'test-3',t2);
assert.equal(cancelled.vigilia.historico.at(-1).brasasRecebidas,0);
assert.equal(cancelled.vigilia.saldoBrasas,2);
validarEstadoDaVigilia(cancelled.vigilia);
assert.throws(() => validarEstadoDaVigilia({ ...cancelled.vigilia, saldoBrasas: -1 }));
console.log('OK: verificações de sessão, recompensa, cancelamento, save e distritos');
