import { obterCaminhoDoIconeShikashi, type NomeDoIconeShikashi } from "./iconesDosRecursos";

type PropriedadesDeIconeDoJogo = {
  icone: NomeDoIconeShikashi | null | undefined;
  tamanho?: number;
  nomeDaClasse?: string;
  alt?: string;
};

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
