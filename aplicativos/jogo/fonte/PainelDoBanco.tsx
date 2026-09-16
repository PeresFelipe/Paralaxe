/**
 * @file Consulta e transferência entre mochila e banco da Cidade Livre.
 * A tela mostra capacidades calculadas pelo domínio e envia quantidade ou ID de instância
 * aos callbacks; estoque e validação de espaço permanecem na camada de regras.
 */
import { obterDefinicaoDeEquipamento } from "@greywake/conteudo";
import {
  LIMITE_DE_ESPACOS_DO_BANCO_V01,
  LIMITE_DE_ESPACOS_DO_INVENTARIO_V01,
  obterUsoDeEspacosDoBanco,
  obterUsoDeEspacosDoInventario,
  type PartidaLocal,
} from "@greywake/dominio";
import IconeDoJogo from "./IconeDoJogo";
import { obterIconeDoEquipamento, obterIconeDoItem } from "./iconesDosRecursos";

type PropriedadesDePainelDoBanco = {
  partida: PartidaLocal;
  aoDepositarPilha: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilha: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoDepositarEquipamento: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamento: (idDaInstancia: string) => Promise<void>;
  aoVoltar: () => void;
};

const rotulosDosItens: Record<string, string> = {
  "material.cloch": "Cloch",
  "material.giuis": "Giúis",
  "material.scadan": "Scadán",
  "material.neantog": "Neantóg",
  "material.tratada-cloch": "Cloch Tratada",
  "item.comida.assado-scadan": "Scadán Assado",
  "item.consumivel.neantog-preparacao": "Preparado de Neantóg",
  "item.consumivel.campo-preparacao": "Preparado de Campo",
  "item.consumivel.carmesim-frasco": "Frasco Carmesim",
  "item.chave.enferrujada": "Chave Enferrujada",
  "item.missao.semNome-pedra": "Pedra Sem Nome",
  "item.equipamento.viajante-anel": "Anel do Viajante",
  "item.guarnicao-suprimento-registroDeDados": "Registro de Suprimentos",
  "item.tratado-fragmento": "Fragmento do Tratado",
  "item.fairtheoir-fragmento": "Fragmento de Fairtheoir",
};

function itemNome(idDaDefinicao: string) {
  return rotulosDosItens[idDaDefinicao] ?? idDaDefinicao;
}

/** Apresenta duas origens de transferência e oferece uma unidade ou a pilha inteira sem modificar listas diretamente. */
export default function PainelDoBanco({
  partida,
  aoDepositarPilha,
  aoRetirarPilha,
  aoDepositarEquipamento,
  aoRetirarEquipamento,
  aoVoltar,
}: PropriedadesDePainelDoBanco) {
  const equipadoIds = new Set(Object.values(partida.personagem.equipamento));
  // Equipamentos vestidos não aparecem como candidatos ao depósito; o domínio também impede guardá-los enquanto equipados.
  const desequipadoEquipamento = partida.personagem.itensDeEquipamento.filter(
    (item) => !equipadoIds.has(item.idDaInstancia),
  );
  const inventarioUso = obterUsoDeEspacosDoInventario(partida);
  const bancoUso = obterUsoDeEspacosDoBanco(partida);

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Cidade · Banco</p>
          <h1 className="destaque-titulo">Banco</h1>
          <p className="atenuado">
            Armazenamento seguro na Cidade Livre. Depósitos e retiradas não têm
            custo.
          </p>
        </div>
        <button className="discreto-botao" type="button" onClick={aoVoltar}>
          Voltar à Cidade
        </button>
      </div>

      <div className="banco-capacidade-gradeVisual">
        <article className="painel">
          <span className="secao-chamada">Inventário</span>
          <strong>
            {inventarioUso} / {LIMITE_DE_ESPACOS_DO_INVENTARIO_V01} espaços
          </strong>
        </article>
        <article className="painel">
          <span className="secao-chamada">Banco</span>
          <strong>
            {bancoUso} / {LIMITE_DE_ESPACOS_DO_BANCO_V01} espaços
          </strong>
        </article>
      </div>

      {/* A coluna do inventário deposita e a do banco retira; ambas usam a mesma identidade dos itens e equipamentos. */}
      <div className="banco-colunas secao-espacamento">
        <article className="painel dense-painel">
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Inventário</p>
              <h2>Levar para o Banco</h2>
            </div>
          </div>
          <div className="folha-listar">
            {partida.personagem.inventario.map((pilha) => (
              <div className="banco-linhaDeDados" key={pilha.idDaDefinicao}>
                <div>
                  <span className="banco-item-rotulo">
                    <IconeDoJogo
                      icone={obterIconeDoItem(pilha.idDaDefinicao)}
                      tamanho={24}
                    />
                    <strong>{itemNome(pilha.idDaDefinicao)}</strong>
                  </span>
                  <small>×{pilha.quantidade}</small>
                </div>
                <div className="botao-linhaDeDados">
                  <button
                    className="discreto-botao compacto"
                    type="button"
                    onClick={() => void aoDepositarPilha(pilha.idDaDefinicao, 1)}
                  >
                    Depositar 1
                  </button>
                  {pilha.quantidade > 1 ? (
                    <button
                      className="discreto-botao compacto"
                      type="button"
                      onClick={() =>
                        void aoDepositarPilha(pilha.idDaDefinicao, pilha.quantidade)
                      }
                    >
                      Tudo
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {desequipadoEquipamento.map((instancia) => {
              const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
              return (
                <div className="banco-linhaDeDados" key={instancia.idDaInstancia}>
                  <div>
                    <span className="banco-item-rotulo">
                      <IconeDoJogo
                        icone={obterIconeDoEquipamento(instancia.idDaDefinicao)}
                        tamanho={24}
                      />
                      <strong>
                        {definicao?.nome ?? instancia.idDaDefinicao}
                      </strong>
                    </span>
                    <small>Equipamento · +{instancia.nivelDeReforco}</small>
                  </div>
                  <button
                    className="discreto-botao compacto"
                    type="button"
                    onClick={() => void aoDepositarEquipamento(instancia.idDaInstancia)}
                  >
                    Depositar
                  </button>
                </div>
              );
            })}
            {partida.personagem.inventario.length === 0 &&
            desequipadoEquipamento.length === 0 ? (
              <p className="atenuado">Nada disponível para depósito.</p>
            ) : null}
          </div>
        </article>

        <article className="painel dense-painel">
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Banco</p>
              <h2>Retirar</h2>
            </div>
          </div>
          <div className="folha-listar">
            {partida.personagem.banco.inventario.map((pilha) => (
              <div className="banco-linhaDeDados" key={pilha.idDaDefinicao}>
                <div>
                  <span className="banco-item-rotulo">
                    <IconeDoJogo
                      icone={obterIconeDoItem(pilha.idDaDefinicao)}
                      tamanho={24}
                    />
                    <strong>{itemNome(pilha.idDaDefinicao)}</strong>
                  </span>
                  <small>×{pilha.quantidade}</small>
                </div>
                <div className="botao-linhaDeDados">
                  <button
                    className="discreto-botao compacto"
                    type="button"
                    onClick={() => void aoRetirarPilha(pilha.idDaDefinicao, 1)}
                  >
                    Retirar 1
                  </button>
                  {pilha.quantidade > 1 ? (
                    <button
                      className="discreto-botao compacto"
                      type="button"
                      onClick={() =>
                        void aoRetirarPilha(pilha.idDaDefinicao, pilha.quantidade)
                      }
                    >
                      Tudo
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {partida.personagem.banco.itensDeEquipamento.map((instancia) => {
              const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
              return (
                <div className="banco-linhaDeDados" key={instancia.idDaInstancia}>
                  <div>
                    <span className="banco-item-rotulo">
                      <IconeDoJogo
                        icone={obterIconeDoEquipamento(instancia.idDaDefinicao)}
                        tamanho={24}
                      />
                      <strong>
                        {definicao?.nome ?? instancia.idDaDefinicao}
                      </strong>
                    </span>
                    <small>Equipamento · +{instancia.nivelDeReforco}</small>
                  </div>
                  <button
                    className="discreto-botao compacto"
                    type="button"
                    onClick={() =>
                      void aoRetirarEquipamento(instancia.idDaInstancia)
                    }
                  >
                    Retirar
                  </button>
                </div>
              );
            })}
            {partida.personagem.banco.inventario.length === 0 &&
            partida.personagem.banco.itensDeEquipamento.length === 0 ? (
              <p className="atenuado">O Banco está vazio.</p>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
