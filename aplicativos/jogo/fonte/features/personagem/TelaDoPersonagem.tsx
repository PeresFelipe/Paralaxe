/** @file Abas de atributos, equipamentos, técnicas, inventário e prestígio. */
import { IconeDoJogo } from "@/components/jogo";
import { Button, Card } from "@/components/ui";
import GradeDoInventario from "@/features/inventario/GradeDoInventario";
import PainelDeAtributos from "@/features/personagem/PainelDeAtributos";
import PainelDePrestigio from "@/features/personagem/PainelDePrestigio";
import { iconeDeProfissaoPorId, obterIconeDoEquipamento } from "@/iconesDosRecursos";
import { rotulosDasProfissoes } from "@/rotulosDoJogo";
import {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidadeDeCombate,
  RECEITAS_INICIAIS_DE_FABRICACAO
} from "@paralaxe/conteudo";
import {
  obterValorPrincipalDoEquipamento,
  type DistribuicaoDeAtributos,
  type IdDaProfissao,
  type PartidaLocal
} from "@paralaxe/dominio";


import type { AbaDoPersonagem } from "@/features/navegacao/tiposDeNavegacao";
/** Distribui abas de atributos, equipamentos, técnicas, inventário e prestígio usando os mesmos dados da partida. */
export default function TelaDoPersonagem({
  partida,
  aba,
  aoAba,
  aoEquipar,
  aoIniciarReceita,
  aoDistribuirAtributos,
  aoRealizarPrestigioDoPersonagem,
  aoDesbloquearNoDePrestigio,
}: {
  partida: PartidaLocal;
  aba: AbaDoPersonagem;
  aoAba: (aba: AbaDoPersonagem) => void;
  aoEquipar: (idDaInstancia: string) => Promise<void>;
  aoIniciarReceita: (
    idDaDefinicaoDaReceita: string,
    idDaInstanciaDoEquipamentoAlvo?: string | null,
  ) => Promise<void>;
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>;
  aoRealizarPrestigioDoPersonagem: () => Promise<void>;
  aoDesbloquearNoDePrestigio: (noId: string) => Promise<void>;
}) {
  const reforcos = RECEITAS_INICIAIS_DE_FABRICACAO.filter(
    (receita) => receita.saida.tipo === "equipamento-reforco",
  );

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Personagem</p>
          <h1 className="destaque-titulo">{partida.personagem.nome}</h1>
          <p className="atenuado">Toda jornada deixa suas marcas.</p>
        </div>
      </div>
      <div className="subnavegacao" aria-label="Personagem">
        {(
          [
            ["visaoGeral", "Visão Geral"],
            ["atributos", "Atributos"],
            ["equipamento", "Equipamento"],
            ["tecnicas", "Técnicas"],
            ["inventario", "Inventário"],
            ["prestigio", "Prestígio"],
          ] as const
        ).map(([id, rotulo]) => (
          <Button
            variant="tab"
            key={id}
            aria-pressed={aba === id}
            onClick={() => aoAba(id)}
          >
            {rotulo}
          </Button>
        ))}
      </div>

      {aba === "visaoGeral" ? (
        <div className="personagem-disposicao">
          <div className="personagem-efigie">
            <div className="retrato-marcador" aria-hidden="true" />
            <p className="efigie-rotulo">EQUIPAMENTO EM USO</p>
            <div className="equipado-suporte">
              {partida.personagem.itensDeEquipamento
                .filter((item) =>
                  Object.values(partida.personagem.equipamento).includes(
                    item.idDaInstancia,
                  ),
                )
                .map((item) => (
                  <Button
                    variant="inventory"
                    key={item.idDaInstancia}
                    title={obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome}
                    aria-label={`Ver ${obterDefinicaoDeEquipamento(item.idDaDefinicao)?.nome ?? "equipamento"}`}
                    onClick={() => aoAba("equipamento")}
                  >
                    <IconeDoJogo
                      icone={obterIconeDoEquipamento(item.idDaDefinicao)}
                      tamanho={32}
                    />
                  </Button>
                ))}
            </div>
          </div>
          <div className="visaoGeral-pilha">
            <Card>
              <p className="secao-chamada">Seu legado</p>
              <h2>
                {partida.personagem.nome} · Nível {partida.personagem.nivel}
              </h2>
              <div className="informacoes-gradeVisual">
                <div>
                  <span>XP geral</span>
                  <strong>{partida.personagem.xp}</strong>
                </div>
                <div>
                  <span>Pontos disponíveis</span>
                  <strong>{partida.personagem.pontosDeAtributoDisponiveis}</strong>
                </div>
                <div>
                  <span>Equipamentos</span>
                  <strong>{partida.personagem.itensDeEquipamento.length}</strong>
                </div>
                <div>
                  <span>Técnicas conhecidas</span>
                  <strong>{partida.personagem.idsDasHabilidadesConhecidas.length}</strong>
                </div>
              </div>
            </Card>
            <Card>
              <p className="secao-chamada">Domínio dos ofícios</p>
              <div className="profissao-resumo-gradeVisual">
                {Object.entries(partida.profissoes).map(([idDaProfissao, progresso]) => (
                  <div key={idDaProfissao}>
                    <span className="profissao-resumo-rotulo">
                      <IconeDoJogo
                        icone={iconeDeProfissaoPorId[idDaProfissao as IdDaProfissao]}
                        tamanho={22}
                      />
                      <span>{rotulosDasProfissoes[idDaProfissao as IdDaProfissao]}</span>
                    </span>
                    <strong>Nv. {progresso.nivel}</strong>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {aba === "atributos" ? (
        <PainelDeAtributos
          partida={partida}
          aoDistribuirAtributos={aoDistribuirAtributos}
        />
      ) : null}

      {aba === "equipamento" ? (
        <div className="equipamento-gradeVisual-emExecucao">
          {partida.personagem.itensDeEquipamento.map((instancia) => {
            const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
            if (!definicao) return null;
            const equipado = Object.values(partida.personagem.equipamento).includes(
              instancia.idDaInstancia,
            );
            const principal = obterValorPrincipalDoEquipamento(
              definicao,
              instancia.nivelDeReforco,
            );
            const reforcoReceita = reforcos.find(receita =>
              receita.saida.tipo === 'equipamento-reforco' &&
              (receita.saida.nivelDeReforcoAlvo ?? 1) === instancia.nivelDeReforco + 1,
            );
            return (
              <article
                className={`item-cartao ${equipado ? "selecionado-cartao" : ""}`}
                key={instancia.idDaInstancia}
              >
                <div className="item-miniatura" aria-hidden="true">
                  <IconeDoJogo
                    icone={obterIconeDoEquipamento(instancia.idDaDefinicao)}
                    tamanho={64}
                  />
                </div>
                <div className="item-cartaoCorpo">
                  <p className="secao-chamada">{definicao.espaco}</p>
                  <h3>
                    {definicao.nome} +{instancia.nivelDeReforco}
                  </h3>
                  <p className="atenuado">
                    {definicao.bonusDeColeta
                      ? `+${definicao.bonusDeColeta.xpAdicionalPorAcao} XP de ${definicao.bonusDeColeta.idDaProfissao} por ciclo, sem durabilidade`
                      : principal !== null
                        ? `${definicao.estatisticaPrincipal?.tipo === "ataque" ? "Poder" : "Defesa"} ${principal}`
                        : "Sem valor primário"}
                  </p>
                  <div className="botao-linhaDeDados">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={equipado}
                      onClick={() => void aoEquipar(instancia.idDaInstancia)}
                    >
                      {equipado ? "Equipado" : "Equipar"}
                    </Button>
                    {reforcoReceita &&
                    instancia.nivelDeReforco < 2 &&
                    definicao.estatisticaPrincipal ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          void aoIniciarReceita(
                            reforcoReceita.id,
                            instancia.idDaInstancia,
                          )
                        }
                      >
                        Reforçar +{instancia.nivelDeReforco + 1}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {aba === "tecnicas" ? (
        <Card className="dense-painel">
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Estilo</p>
              <h2>{partida.combate.preferencias.estilo}</h2>
            </div>
            <span className="situacao-selo">ordem = prioridade real</span>
          </div>
          <div className="tecnica-listar">
            {partida.personagem.espacosDeHabilidadesAtivas.map((habilidadeId, indice) => {
              const habilidade = habilidadeId
                ? obterDefinicaoDeHabilidadeDeCombate(habilidadeId)
                : null;
              return (
                <div
                  className="tecnica-linhaDeDados"
                  key={`${habilidadeId ?? "vazio"}-${indice}`}
                >
                  <span className="prioridade-indice">{indice + 1}</span>
                  <div>
                    <strong>{habilidade?.nome ?? "Espaço vazio"}</strong>
                    <small>
                      {habilidade
                        ? `CD ${habilidade.segundosDeRecarga}s${habilidade.custoDeRecurso !== undefined ? ` · custo ${habilidade.custoDeRecurso} ${habilidade.recurso ?? ""}` : ""}`
                        : "Nenhuma Técnica equipada"}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {aba === "inventario" ? (
        <Card className="inventario-painel">
          <GradeDoInventario partida={partida} aoEquipar={aoEquipar} />
        </Card>
      ) : null}

      {aba === "prestigio" ? (
        <PainelDePrestigio
          partida={partida}
          aoRealizarPrestigio={aoRealizarPrestigioDoPersonagem}
          aoDesbloquearNo={aoDesbloquearNoDePrestigio}
        />
      ) : null}
    </section>
  );
}

