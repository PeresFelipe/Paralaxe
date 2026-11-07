/// <reference types="node" />
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OFERTAS_INICIAIS_DO_MERCADO_DE_PNJ, ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO, DEFINICOES_DE_EQUIPAMENTO, CONSUMIVEIS_DE_COMBATE } from "@paralaxe/conteudo";
import {
  iconeDeEquipamentoPorId,
  iconeDeAtalhoPorId,
  iconeDeAcaoPorId,
  iconeDeItemPorId,
  iconeDeProfissaoPorId,
  iconeDoPainelPorId,
  obterCaminhoDoIconeDoJogo,
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
      ...Object.values(iconeDeAtalhoPorId),
      ...Object.values(iconeDeAcaoPorId),
    ]);
    for (const icone of icones) {
      const caminho = obterCaminhoDoIconeDoJogo(icone).split("?")[0];
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

  it("cobre os recursos coletáveis de todos os níveis e Prestígios", () => {
    for (const atividade of ATIVIDADES_OCIOSAS_INICIAIS) {
      expect(obterIconeDoItem(atividade.idDaDefinicaoDoItemProduzido), atividade.id).toBeDefined();
    }
  });

  it("cobre ingredientes e resultados de todas as receitas", () => {
    const faltantes = new Set<string>();
    for (const receita of RECEITAS_INICIAIS_DE_FABRICACAO) {
      for (const ingrediente of receita.ingredientes) {
        if (!obterIconeDoItem(ingrediente.idDaDefinicao)) faltantes.add(ingrediente.idDaDefinicao);
      }
      if (receita.saida.tipo !== "equipamento-reforco" && !obterIconeDoProduto(receita.saida)) {
        faltantes.add(receita.saida.idDaDefinicao);
      }
    }
    expect([...faltantes]).toEqual([]);
  });

  it("cobre todos os equipamentos e consumíveis definidos no conteúdo", () => {
    for (const equipamento of DEFINICOES_DE_EQUIPAMENTO) {
      expect(obterIconeDoEquipamento(equipamento.id), equipamento.id).toBeDefined();
    }
    for (const consumivel of CONSUMIVEIS_DE_COMBATE) {
      expect(obterIconeDoItem(consumivel.id), consumivel.id).toBeDefined();
    }
  });

  it("mostra lanças como lanças nas definições de viagem e do Vigia", () => {
    expect(obterIconeDoEquipamento("arma.viagem-lanca")).toBe("lanca");
    expect(obterIconeDoEquipamento("arma.vigia-lanca")).toBe("lanca");
  });

  it("deixa a interface aplicar o fallback para IDs sem arte", () => {
    expect(obterIconeDoItem("item.tratado-fragmento")).toBeUndefined();
    expect(obterIconeDoEquipamento("arma.inexistente")).toBeUndefined();
    expect(obterIconeDoItem("constructor")).toBeUndefined();
  });
});
