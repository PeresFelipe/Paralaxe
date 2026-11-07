/** @file Navegação e composição dos serviços da Cidade Livre. */
import { IconeDoJogo } from "@/components/jogo";
import { Button, Card } from "@/components/ui";
import BancadaDoMercado from "@/features/cidade/BancadaDoMercado";
import {
  PainelDeProjetos,
  ResumoDaCidade,
  type AcoesDoLegado,
} from '@/features/cidade/LegadoDaCidade';
import PainelDoBanco from "@/features/cidade/PainelDoBanco";
import PainelDoCodice from "@/features/cidade/PainelDoCodice";
import { iconeDeAtalhoPorId } from "@/iconesDosRecursos";
import { rotulosDaInterface } from '@/rotulosDaInterface';
import {
  obterDialogoDeBrann
} from "@paralaxe/conteudo";
import {
  type PartidaLocal
} from "@paralaxe/dominio";


import type { TelaDaCidade } from "@/features/navegacao/tiposDeNavegacao";
/** Encaminha os serviços implementados e apresenta o contexto dos locais ainda sem mecânica funcional. */
export default function ComponenteDaTelaDaCidade({
  partida,
  telaDoJogo,
  aoTelaDoJogo,
  aoAbrirAventura,
  aoConcluirProjeto,
  aoComprarOfertaDoMercado,
  aoDepositarPilhaNoBanco,
  aoRetirarPilhaDoBanco,
  aoDepositarEquipamentoNoBanco,
  aoRetirarEquipamentoDoBanco,
}: {
  partida: PartidaLocal;
  telaDoJogo: TelaDaCidade;
  aoTelaDoJogo: (telaDoJogo: TelaDaCidade) => void;
  aoAbrirAventura: () => void;
  aoConcluirProjeto: AcoesDoLegado['aoConcluirProjeto'];
  aoComprarOfertaDoMercado: (idDaOferta: string) => Promise<void>;
  aoDepositarPilhaNoBanco: (idDaDefinicao: string, quantidade: number) => Promise<void>;
  aoRetirarPilhaDoBanco: (
    idDaDefinicao: string,
    quantidade: number,
  ) => Promise<void>;
  aoDepositarEquipamentoNoBanco: (idDaInstancia: string) => Promise<void>;
  aoRetirarEquipamentoDoBanco: (idDaInstancia: string) => Promise<void>;
}) {
  if (telaDoJogo === 'reconstrucao') {
    return <PainelDeProjetos partida={partida} aoVoltar={() => aoTelaDoJogo('visaoGeral')}
      aoConcluirProjeto={aoConcluirProjeto} />;
  }
  if (telaDoJogo === "codice") {
    return <PainelDoCodice partida={partida} aoVoltar={() => aoTelaDoJogo("visaoGeral")} />;
  }
  if (telaDoJogo === "mercado")
    return (
      <BancadaDoMercado
        partida={partida}
        aoComprarOferta={aoComprarOfertaDoMercado}
        aoVoltar={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  if (telaDoJogo === "banco") {
    return (
      <PainelDoBanco
        partida={partida}
        aoDepositarPilha={aoDepositarPilhaNoBanco}
        aoRetirarPilha={aoRetirarPilhaDoBanco}
        aoDepositarEquipamento={aoDepositarEquipamentoNoBanco}
        aoRetirarEquipamento={aoRetirarEquipamentoDoBanco}
        aoVoltar={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }

  if (telaDoJogo === "taverna") {
    const dialogo = obterDialogoDeBrann(partida);
    return (
      <section className="funcionalidade-telaDoJogo">
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Cidade · Taverna</p>
            <h1 className="destaque-titulo">Taverna</h1>
            <p className="atenuado">Conversas e contratos.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            {rotulosDaInterface.voltarACidade}
          </Button>
        </div>
        <div className="cidade-contexto-disposicao">
          <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
            <span>ARTE 16:9 · TAVERNA</span>
          </div>
          <Card className="pnj-cartao">
            <div
              className="retrato-marcador retrato-marcador--pnj"
              aria-hidden="true"
            >
              <span>PNJ 4:5</span>
            </div>
            <div>
              <p className="secao-chamada">
                Brann
                {partida.masmorra.contratoConcluido ? " · Contrato concluído" : ""}
              </p>
              <h2>{dialogo.titulo}</h2>
              <p className="atenuado">{dialogo.corpo}</p>
              {dialogo.lembranca ? (
                <blockquote className="brann-lembranca">
                  {dialogo.lembranca}
                </blockquote>
              ) : null}
              {dialogo.acao ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={aoAbrirAventura}
                >
                  {dialogo.acao}
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // Ferreiro e Relicário possuem apresentação contextual, mas não executam novos serviços nesta versão.
  if (telaDoJogo !== "visaoGeral") {
    const texto: Record<
      Exclude<TelaDaCidade, "visaoGeral" | "taverna" | "mercado" | "banco" | "reconstrucao">,
      { titulo: string; corpo: string }
    > = {
      ferreiro: {
        titulo: "Ferreiro",
        corpo: "Serviços de PNJ pertencem à Cidade. A Profissão Forja continua em Atividades. Nenhum novo serviço do Ferreiro está implementado nesta configuração.",
      },
      relicario: {
        titulo: "Relicário",
        corpo: "Relíquias descobertas serão apresentadas aqui. O sistema funcional de Relicário ainda não está implementado nesta configuração.",
      },
      codice: {
        titulo: "Códice",
        corpo: "Registro das descobertas do personagem.",
      },
    };
    const atual = texto[telaDoJogo];
    return (
      <section className="funcionalidade-telaDoJogo">
        <div className="telaDoJogo-tituloDaSecao">
          <div>
            <p className="secao-chamada">Cidade</p>
            <h1 className="destaque-titulo">{atual.titulo}</h1>
            <p className="atenuado">{atual.corpo}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => aoTelaDoJogo("visaoGeral")}
          >
            {rotulosDaInterface.voltarACidade}
          </Button>
        </div>
        <div className="contexto-arte contexto-arte--cidade" aria-hidden="true">
          <span>ARTE 16:9 · {atual.titulo.toUpperCase()}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Cidade</p>
          <h1 className="destaque-titulo">Cidade Livre</h1>
          <p className="atenuado">
            Trégua, necessidade e comércio sustentam este território neutro.
          </p>
        </div>
      </div>
      <div className="cidade-visaoGeral-disposicao secao-espacamento">
        <ResumoDaCidade partida={partida}
          aoAbrirProjetos={() => aoTelaDoJogo('reconstrucao')} />
        <div className="cidade-localDoJogo-gradeVisual">
          <Button variant="location" icon={<IconeDoJogo icone="livro-abrir" tamanho={32} />} onClick={() => aoTelaDoJogo("taverna")}>
            <strong>Taverna</strong>
            <span>Contratos e conversas</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="coroa-moeda" tamanho={32} />} onClick={() => aoTelaDoJogo("mercado")}>
            <strong>Mercado</strong>
            <span>Compra e venda</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="ferreiro" tamanho={32} />} onClick={() => aoTelaDoJogo("ferreiro")}>
            <strong>Ferreiro</strong>
            <span>Serviços de equipamento</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone={iconeDeAtalhoPorId.banco} tamanho={32} />} onClick={() => aoTelaDoJogo("banco")}>
            <strong>Banco</strong>
            <span>Armazenamento seguro</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="pedraRunica" tamanho={32} />} onClick={() => aoTelaDoJogo("relicario")}>
            <strong>Relicário</strong>
            <span>Relíquias e memória</span>
          </Button>
          <Button variant="location" icon={<IconeDoJogo icone="livro-abrir" tamanho={32} />} onClick={() => aoTelaDoJogo("codice")}>
            <strong>Códice</strong>
            <span>Descobertas e conhecimento</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

