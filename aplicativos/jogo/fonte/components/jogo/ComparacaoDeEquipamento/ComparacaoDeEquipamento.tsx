/**
 * @file Compara os atributos de uma peça fabricada com o equipamento atual.
 * Os valores vêm do catálogo e das regras de conteúdo; esta camada só os formata.
 */
import { obterComparacaoDeEquipamentoDaFabricacao } from "@greywake/conteudo";
import type { PartidaLocal } from "@greywake/dominio";
import estilos from "./ComparacaoDeEquipamento.module.css";

export type PropriedadesDeComparacaoDeEquipamento = {
  partida: PartidaLocal;
  idDaReceita: string;
};

/** Não renderiza para receitas sem equipamento; apresenta as mudanças previstas para peças válidas. */
export default function ComparacaoDeEquipamento({
  partida,
  idDaReceita,
}: PropriedadesDeComparacaoDeEquipamento) {
  const comparacao = obterComparacaoDeEquipamentoDaFabricacao(partida, idDaReceita);
  if (!comparacao) return null;

  const formato = (valor: number, chave: string) =>
    chave === "chanceDeCritico"
      ? `${Number((valor * 100).toFixed(1))}%`
      : Number(valor.toFixed(2)).toLocaleString("pt-BR");

  return (
    <div
      className={`${estilos.comparacao} equipamento-comparacao`}
      aria-label="Comparação com o equipamento atual"
    >
      <p>
        Ao equipar a peça +0, substituindo <strong>{comparacao.nomeAtual}</strong>:
      </p>
      <dl>
        {comparacao.linhas.map((linhaDeDados) => (
          <div key={linhaDeDados.chave}>
            <dt>{linhaDeDados.rotulo}</dt>
            <dd>
              {formato(linhaDeDados.antes, linhaDeDados.chave)} → {" "}
              <strong>{formato(linhaDeDados.apos, linhaDeDados.chave)}</strong>{" "}
              <span>
                ({linhaDeDados.diferenca > 0 ? "+" : ""}
                {formato(linhaDeDados.diferenca, linhaDeDados.chave)})
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
