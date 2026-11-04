/// <reference types="node" />
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ } from "@paralaxe/conteudo";
import {
  iconeDeEquipamentoPorId,
  iconeDeItemPorId,
  iconeDeProfissaoPorId,
  iconeDoPainelPorId,
  obterCaminhoDoIconeShikashi,
  obterIconeDoEquipamento,
  obterIconeDoItem,
  obterIconeDoProduto,
} from "./iconesDosRecursos";

describe("ícones dos recursos", () => {
  it("aponta somente para arquivos públicos existentes", () => {
    const icones = new Set([
      ...Object.values(iconeDeItemPorId),
      ...Object.values(iconeDeEquipamentoPorId),
      ...Object.values(iconeDeProfissaoPorId),
      ...Object.values(iconeDoPainelPorId),
    ]);
    for (const icone of icones) {
      const caminho = obterCaminhoDoIconeShikashi(icone).split("?")[0];
      expect(existsSync(new URL(`../publico${caminho}`, import.meta.url)), caminho).toBe(true);
    }
  });

  it("usa o ícone do inventário para cada oferta do mercado", () => {
    for (const { produto } of OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ) {
      const iconeDoInventario = produto.tipo === "item"
        ? obterIconeDoItem(produto.idDaDefinicao)
        : obterIconeDoEquipamento(produto.idDaDefinicao);
      expect(iconeDoInventario).toBeDefined();
      expect(obterIconeDoProduto(produto)).toBe(iconeDoInventario);
    }
  });

  it("deixa a interface aplicar o fallback para IDs sem arte", () => {
    expect(obterIconeDoItem("item.tratado-fragmento")).toBeUndefined();
    expect(obterIconeDoEquipamento("arma.viagem-lanca")).toBeUndefined();
    expect(obterIconeDoItem("constructor")).toBeUndefined();
  });
});
