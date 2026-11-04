/**
 * @file Imagem padronizada do catálogo de ícones: endereço, tamanho e acessibilidade.
 * A aparência pixelada é definida no módulo CSS; não há lógica de jogo neste componente.
 */
import { useState } from "react";
import { obterCaminhoDoIconeShikashi, type NomeDoIconeShikashi } from "@/iconesDosRecursos";
import estilos from "./IconeDoJogo.module.css";

/** O texto alternativo é opcional: ícones ao lado de um rótulo visível são decorativos. */
export type PropriedadesDeIconeDoJogo = {
  icone: NomeDoIconeShikashi | null | undefined;
  tamanho?: number;
  nomeDaClasse?: string;
  alt?: string;
  alternativa?: string;
};

/** Omite ícones sem mapeamento e reserva largura e altura antes de carregar a imagem. */
export default function IconeDoJogo({
  icone,
  tamanho = 32,
  nomeDaClasse,
  alt,
  alternativa,
}: PropriedadesDeIconeDoJogo) {
  const [iconeIndisponivel, definirIconeIndisponivel] = useState<NomeDoIconeShikashi>();
  if (!icone || icone === iconeIndisponivel) {
    if (!alt && !alternativa) return null;
    return <span aria-hidden={alt ? undefined : true}>{alt ?? alternativa}</span>;
  }

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
      onError={() => definirIconeIndisponivel(icone)}
      aria-hidden={alt ? undefined : true}
    />
  );
}
