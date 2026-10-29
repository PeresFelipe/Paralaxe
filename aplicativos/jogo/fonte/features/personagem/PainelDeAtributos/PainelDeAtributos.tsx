/**
 * @file Distribuição de pontos com rascunho e prévia das consequências.
 * Os botões alteram somente o rascunho local; confirmar envia a distribuição ao domínio
 * e à persistência. A prévia reutiliza as fórmulas reais de combate.
 */
import {
  CHAVES_DOS_ATRIBUTOS,
  type DistribuicaoDeAtributos,
  type ChaveDeAtributo,
  type PartidaLocal,
} from "@greywake/dominio";
import { Button, Card } from '@/components/ui'
import { useDistribuicaoDeAtributos } from '@/hooks/useDistribuicaoDeAtributos'
import { rotulosDaInterface } from '@/rotulosDaInterface'
import estilos from './PainelDeAtributos.module.css'

const rotulosDosAtributos: Record<ChaveDeAtributo, string> = {
  vitalidade: "Vitalidade",
  mente: "Mente",
  vigor: "Vigor",
  forca: "Força",
  destreza: "Destreza",
  inteligencia: "Inteligência",
  fe: "Fé",
};

type PropriedadesDePainelDeAtributos = {
  partida: PartidaLocal;
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>;
};

/** Combina atributos persistidos com a proposta temporária para mostrar valores antes e depois. */
export default function PainelDeAtributos({
  partida,
  aoDistribuirAtributos,
}: PropriedadesDePainelDeAtributos) {
  const {
    rascunho,
    pendentePontos,
    faltamPontos,
    ehSalvando,
    atualEstatisticas,
    previaEstatisticas,
    alteracaoAtributo,
    limparRascunho,
    confirmar,
  } = useDistribuicaoDeAtributos(partida, aoDistribuirAtributos)

  /** Resume os recursos máximos afetados diretamente por Vitalidade, Mente e Vigor. */
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
    <Card>
      <div className="painel-tituloDaSecao">
        <div>
          <p className="secao-chamada">Atributos</p>
          <h2>Distribuição</h2>
        </div>
        <span className="situacao-selo">
          {faltamPontos} ponto(s) restante(s)
        </span>
      </div>

      <div className={estilos.attributes}>
        {CHAVES_DOS_ATRIBUTOS.map((chave) => {
          const baseValor = partida.personagem.atributos[chave];
          const pendente = rascunho[chave] ?? 0;
          const previaValor = baseValor + pendente;
          const previa = recursoPrevia(chave);

          return (
            <div key={chave} className={estilos.attribute}>
              <span>
                {rotulosDosAtributos[chave]}
                {previa ? <small>{previa}</small> : null}
              </span>
              <div className={estilos.controls}>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pendente <= 0 || ehSalvando}
                  onClick={() => alteracaoAtributo(chave, -1)}
                  aria-label={`Remover ponto temporário de ${rotulosDosAtributos[chave]}`}
                >
                  −
                </Button>
                <strong>
                  {pendente > 0 ? `${baseValor} → ${previaValor}` : baseValor}
                </strong>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={faltamPontos <= 0 || ehSalvando}
                  onClick={() => alteracaoAtributo(chave, 1)}
                  aria-label={`Adicionar ponto a ${rotulosDosAtributos[chave]}`}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {pendentePontos > 0 ? (
        <div className="botao-linhaDeDados">
          <Button
            variant="secondary"
            disabled={ehSalvando}
            onClick={limparRascunho}
          >
            Desfazer
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={ehSalvando}
            onClick={() => void confirmar()}
          >
            {ehSalvando
              ? "Salvando…"
              : `${rotulosDaInterface.confirmar} distribuição · ${pendentePontos}`}
          </Button>
        </div>
      ) : null}

      {partida.personagem.pontosDeAtributoDisponiveis === 0 ? (
        <p className="atenuado">Nenhum ponto de atributo disponível no momento.</p>
      ) : null}
    </Card>
  );
}
