/**
 * @file Imagem padronizada do catálogo de ícones: endereço, tamanho e acessibilidade.
 * A aparência pixelada é definida no módulo CSS; não há lógica de jogo neste componente.
 */
import { obterCaminhoDoIconeShikashi, type NomeDoIconeShikashi } from "../../../iconesDosRecursos";
import estilos from "./IconeDoJogo.module.css";

/** O texto alternativo é opcional: ícones ao lado de um rótulo visível são decorativos. */
export type PropriedadesDeIconeDoJogo = {
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

  const classes = [estilos.icone, "jogo-icone", nomeDaClasse].filter(Boolean).join(" ");

  return (
    <img
      className={classes}
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
