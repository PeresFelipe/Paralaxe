/**
 * @file Imagem padronizada do catálogo de ícones: endereço, tamanho e acessibilidade.
 * A aparência pixelada é definida no CSS; não há lógica de jogo neste componente.
 */
import { obterCaminhoDoIconeShikashi, type NomeDoIconeShikashi } from "./iconesDosRecursos";

/** O texto alternativo é opcional: ícones ao lado de um rótulo visível são decorativos. */
type PropriedadesDeIconeDoJogo = {
  icone: NomeDoIconeShikashi | null | undefined;
  tamanho?: number;
  nomeDaClasse?: string;
  alt?: string;
};

/** Omite ícones sem mapeamento e reserva largura e altura antes de carregar a imagem. */
export default function IconeDoJogo({
  icone,
  tamanho = 32,
  nomeDaClasse,
  alt,
}: PropriedadesDeIconeDoJogo) {
  if (!icone) return null;

  return (
    <img
      className={nomeDaClasse ? `jogo-icone ${nomeDaClasse}` : "jogo-icone"}
      src={obterCaminhoDoIconeShikashi(icone)}
      alt={alt ?? ""}
      width={tamanho}
      height={tamanho}
      loading="lazy"
      decoding="async"
      aria-hidden={alt ? undefined : true}
    />
  );
}
