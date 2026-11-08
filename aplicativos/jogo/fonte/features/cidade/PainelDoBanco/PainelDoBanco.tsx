import { useAcaoAssincrona } from '@/hooks/useAcaoAssincrona'
/**
 * @file Consulta e transferência entre mochila e banco da Cidade Livre.
 * A tela mostra capacidades calculadas pelo domínio e envia quantidade ou ID de instância
 * aos callbacks; estoque e validação de espaço permanecem na camada de regras.
 */
import { IconeDoJogo } from "@/components/jogo";
import { Button, Card } from '@/components/ui';
import { obterIconeDoEquipamento, obterIconeDoItem } from "@/iconesDosRecursos";
import { rotulosDaInterface } from '@/rotulosDaInterface';
import { rotulosDosItens } from '@/rotulosDoJogo';
import { obterDefinicaoDeEquipamento } from "@paralaxe/conteudo";
import {
  obterLimiteDeEspacosDoBanco,
  obterLimiteDeEspacosDoInventario,
  obterUsoDeEspacosDoBanco,
  obterUsoDeEspacosDoInventario,
  type PartidaLocal,
} from "@paralaxe/dominio";
import estilos from './PainelDoBanco.module.css';

type PropriedadesDePainelDoBanco = {
  partida: PartidaLocal;
  aoDepositarPilha: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilha: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoDepositarEquipamento: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamento: (idDaInstancia: string) => Promise<void>;
  aoVoltar: () => void;
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
  const { executar, pendente, mensagem, erro } = useAcaoAssincrona();
  const transferir = (acao: () => Promise<void>) => executar(acao, 'Transferência concluída.');

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
        <Button variant="secondary" onClick={aoVoltar}>
          {rotulosDaInterface.voltarACidade}
        </Button>
      </div>

      {mensagem ? <p className="emLinha-mensagem" role={erro ? "alert" : "status"}>{mensagem}</p> : null}
      <div className={estilos.capacities}>
        <Card className={estilos.capacity}>
          <span className="secao-chamada">Inventário</span>
          <strong>
            {inventarioUso} / {obterLimiteDeEspacosDoInventario(partida)} espaços
          </strong>
        </Card>
        <Card className={estilos.capacity}>
          <span className="secao-chamada">Banco</span>
          <strong>
            {bancoUso} / {obterLimiteDeEspacosDoBanco(partida)} espaços
          </strong>
        </Card>
      </div>

      {/* A coluna do inventário deposita e a do banco retira; ambas usam a mesma identidade dos itens e equipamentos. */}
      <div className={`${estilos.columns} secao-espacamento`}>
        <Card className={estilos.listCard}>
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Inventário</p>
              <h2>Levar para o Banco</h2>
            </div>
          </div>
          <div className={estilos.list}>
            {partida.personagem.inventario.map((pilha) => (
              <div className={estilos.row} key={pilha.idDaDefinicao}>
                <div>
                  <span className={estilos.itemLabel}>
                    <IconeDoJogo
                      icone={obterIconeDoItem(pilha.idDaDefinicao)}
                      tamanho={24}
                    />
                    <strong>{itemNome(pilha.idDaDefinicao)}</strong>
                  </span>
                  <small>×{pilha.quantidade}</small>
                </div>
                <div className="botao-linhaDeDados">
                  <Button
                    variant="secondary"
                    icon={<IconeDoJogo icone="depositar" tamanho={16} />}
                    size="sm"
                    disabled={pendente}
                    onClick={() => void transferir(() => aoDepositarPilha(pilha.idDaDefinicao, 1))}
                  >
                    Depositar 1
                  </Button>
                  {pilha.quantidade > 1 ? (
                    <Button
                      variant="secondary"
                    icon={<IconeDoJogo icone="depositar" tamanho={16} />}
                      size="sm"
                    disabled={pendente}
                      onClick={() =>
                        void transferir(() => aoDepositarPilha(pilha.idDaDefinicao, pilha.quantidade))
                      }
                    >
                      Transferir tudo ({pilha.quantidade})
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
            {desequipadoEquipamento.map((instancia) => {
              const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
              return (
                <div className={estilos.row} key={instancia.idDaInstancia}>
                  <div>
                    <span className={estilos.itemLabel}>
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
                  <Button
                    variant="secondary"
                    icon={<IconeDoJogo icone="depositar" tamanho={16} />}
                    size="sm"
                    disabled={pendente}
                    onClick={() => void transferir(() => aoDepositarEquipamento(instancia.idDaInstancia))}
                  >
                    Depositar
                  </Button>
                </div>
              );
            })}
            {partida.personagem.inventario.length === 0 &&
            desequipadoEquipamento.length === 0 ? (
              <p className="atenuado">Nada disponível para depósito.</p>
            ) : null}
          </div>
        </Card>

        <Card className={estilos.listCard}>
          <div className="painel-tituloDaSecao">
            <div>
              <p className="secao-chamada">Banco</p>
              <h2>Retirar</h2>
            </div>
          </div>
          <div className={estilos.list}>
            {partida.personagem.banco.inventario.map((pilha) => (
              <div className={estilos.row} key={pilha.idDaDefinicao}>
                <div>
                  <span className={estilos.itemLabel}>
                    <IconeDoJogo
                      icone={obterIconeDoItem(pilha.idDaDefinicao)}
                      tamanho={24}
                    />
                    <strong>{itemNome(pilha.idDaDefinicao)}</strong>
                  </span>
                  <small>×{pilha.quantidade}</small>
                </div>
                <div className="botao-linhaDeDados">
                  <Button icon={<IconeDoJogo icone="retirar" tamanho={16} />}
                    variant="secondary"
                    size="sm"
                    disabled={pendente}
                    onClick={() => void transferir(() => aoRetirarPilha(pilha.idDaDefinicao, 1))}
                  >
                    Retirar 1
                  </Button>
                  {pilha.quantidade > 1 ? (
                    <Button icon={<IconeDoJogo icone="retirar" tamanho={16} />}
                      variant="secondary"
                      size="sm"
                    disabled={pendente}
                      onClick={() =>
                        void transferir(() => aoRetirarPilha(pilha.idDaDefinicao, pilha.quantidade))
                      }
                    >
                      Transferir tudo ({pilha.quantidade})
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
            {partida.personagem.banco.itensDeEquipamento.map((instancia) => {
              const definicao = obterDefinicaoDeEquipamento(instancia.idDaDefinicao);
              return (
                <div className={estilos.row} key={instancia.idDaInstancia}>
                  <div>
                    <span className={estilos.itemLabel}>
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
                  <Button icon={<IconeDoJogo icone="retirar" tamanho={16} />}
                    variant="secondary"
                    size="sm"
                    disabled={pendente}
                    onClick={() =>
                      void transferir(() => aoRetirarEquipamento(instancia.idDaInstancia))
                    }
                  >
                    Retirar
                  </Button>
                </div>
              );
            })}
            {partida.personagem.banco.inventario.length === 0 &&
            partida.personagem.banco.itensDeEquipamento.length === 0 ? (
              <p className="atenuado">O Banco está vazio.</p>
            ) : null}
          </div>
        </Card>
      </div>
    </section>
  );
}

