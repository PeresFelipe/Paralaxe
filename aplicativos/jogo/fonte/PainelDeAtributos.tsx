import { useMemo, useState } from "react";
import {
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeEquipamento,
} from "@greywake/conteudo";
import {
  CHAVES_DOS_ATRIBUTOS,
  derivarEstatisticasDeCombateDoJogador,
  type DistribuicaoDeAtributos,
  type ChaveDeAtributo,
  type PartidaLocal,
} from "@greywake/dominio";

const rotulosDosAtributos: Record<ChaveDeAtributo, string> = {
  vitalidade: "Vitalidade",
  mente: "Mente",
  vigor: "Vigor",
  forca: "Força",
  destreza: "Destreza",
  inteligencia: "Inteligência",
  fe: "Fé",
};

const combateCatalogo = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
};

type PropriedadesDePainelDeAtributos = {
  partida: PartidaLocal;
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>;
};

export default function PainelDeAtributos({
  partida,
  aoDistribuirAtributos,
}: PropriedadesDePainelDeAtributos) {
  const [rascunho, definirRascunho] = useState<DistribuicaoDeAtributos>({});
  const [ehSalvando, definirEhSalvando] = useState(false);

  const pendentePontos = CHAVES_DOS_ATRIBUTOS.reduce(
    (total, chave) => total + (rascunho[chave] ?? 0),
    0,
  );
  const faltamPontos = Math.max(
    0,
    partida.personagem.pontosDeAtributoDisponiveis - pendentePontos,
  );

  const atualEstatisticas = useMemo(
    () => derivarEstatisticasDeCombateDoJogador(partida, combateCatalogo),
    [partida],
  );
  const previaEstatisticas = useMemo(() => {
    const atributos = { ...partida.personagem.atributos };
    for (const chave of CHAVES_DOS_ATRIBUTOS) atributos[chave] += rascunho[chave] ?? 0;
    return derivarEstatisticasDeCombateDoJogador(
      { ...partida, personagem: { ...partida.personagem, atributos } },
      combateCatalogo,
    );
  }, [rascunho, partida]);

  function alteracaoAtributo(chave: ChaveDeAtributo, diferenca: number) {
    const atual = rascunho[chave] ?? 0;
    if (diferenca > 0 && faltamPontos <= 0) return;
    const proximo = Math.max(0, atual + diferenca);
    definirRascunho((atualRascunho) => ({ ...atualRascunho, [chave]: proximo }));
  }

  async function confirmar() {
    if (pendentePontos <= 0 || ehSalvando) return;
    definirEhSalvando(true);
    try {
      await aoDistribuirAtributos(rascunho);
      definirRascunho({});
    } finally {
      definirEhSalvando(false);
    }
  }

  function recursoPrevia(chave: ChaveDeAtributo) {
    if (chave === "vitalidade")
      return `Vida máxima ${atualEstatisticas.vidaMaxima} → ${previaEstatisticas.vidaMaxima}`;
    if (chave === "mente")
      return `Mana máxima ${atualEstatisticas.manaMaxima} → ${previaEstatisticas.manaMaxima}`;
    if (chave === "vigor")
      return `Fôlego máxima ${atualEstatisticas.folegoMaximo} → ${previaEstatisticas.folegoMaximo}`;
    return null;
  }

  return (
    <article className="painel dense-painel">
      <div className="painel-tituloDaSecao">
        <div>
          <p className="secao-chamada">Atributos</p>
          <h2>Distribuição</h2>
        </div>
        <span className="situacao-selo">
          {faltamPontos} ponto(s) restante(s)
        </span>
      </div>

      <div className="atributo-listar">
        {CHAVES_DOS_ATRIBUTOS.map((chave) => {
          const baseValor = partida.personagem.atributos[chave];
          const pendente = rascunho[chave] ?? 0;
          const previaValor = baseValor + pendente;
          const previa = recursoPrevia(chave);

          return (
            <div key={chave}>
              <span>
                {rotulosDosAtributos[chave]}
                {previa ? <small>{previa}</small> : null}
              </span>
              <div className="atributo-controls">
                <button
                  className="discreto-botao compacto"
                  type="button"
                  disabled={pendente <= 0 || ehSalvando}
                  onClick={() => alteracaoAtributo(chave, -1)}
                  aria-label={`Remover ponto temporário de ${rotulosDosAtributos[chave]}`}
                >
                  −
                </button>
                <strong>
                  {pendente > 0 ? `${baseValor} → ${previaValor}` : baseValor}
                </strong>
                <button
                  className="discreto-botao compacto"
                  type="button"
                  disabled={faltamPontos <= 0 || ehSalvando}
                  onClick={() => alteracaoAtributo(chave, 1)}
                  aria-label={`Adicionar ponto a ${rotulosDosAtributos[chave]}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pendentePontos > 0 ? (
        <div className="botao-linhaDeDados">
          <button
            className="discreto-botao"
            type="button"
            disabled={ehSalvando}
            onClick={() => definirRascunho({})}
          >
            Desfazer
          </button>
          <button
            className="principal-botao compacto"
            type="button"
            disabled={ehSalvando}
            onClick={() => void confirmar()}
          >
            {ehSalvando
              ? "Salvando…"
              : `Confirmar distribuição · ${pendentePontos}`}
          </button>
        </div>
      ) : null}

      {partida.personagem.pontosDeAtributoDisponiveis === 0 ? (
        <p className="atenuado">Nenhum ponto de atributo disponível no momento.</p>
      ) : null}
    </article>
  );
}
