import type { PersistirAlteracaoDaPartida } from '@/services/alteracoesDaPartida'
/** @file Navegação e composição das telas de Aventura. */
import { IconeDoJogo } from "@/components/jogo";
import { Button, Card } from "@/components/ui";
import BancadaDaMasmorra from "@/features/aventura/BancadaDaMasmorra";
import BancadaDeCombate from "@/features/aventura/BancadaDeCombate";
import PainelDeDesafios from "@/features/aventura/PainelDeDesafios";
import PainelDeGrupo from "@/features/aventura/PainelDeGrupo";
import { iconeDeAtalhoPorId } from "@/iconesDosRecursos";
import {
  type PartidaLocal
} from "@paralaxe/dominio";


import type { TelaDeAventura } from "@/features/navegacao/tiposDeNavegacao";
/** Alterna a visão geral e as bancadas de serviço ou masmorra; cada bancada controla sua preparação e resolução. */
export default function ComponenteDaTelaDeAventura({
  partida,
  telaDoJogo,
  aoTelaDoJogo,
  prepararRisco,
  aoPersistir,
  aoAlterarEstadoDeRisco,
  aoAlterarEstadoDePreparacao,
}: {
  partida: PartidaLocal;
  telaDoJogo: TelaDeAventura;
  aoTelaDoJogo: (telaDoJogo: TelaDeAventura) => void;
  prepararRisco: () => Promise<PartidaLocal>;
  aoPersistir: PersistirAlteracaoDaPartida;
  aoAlterarEstadoDeRisco: (ativo: boolean) => void;
  aoAlterarEstadoDePreparacao: (ativo: boolean) => void;
}) {
  if (telaDoJogo === "grupo") {
    return <PainelDeGrupo partida={partida} aoPersistir={aoPersistir} aoVoltar={() => aoTelaDoJogo("visaoGeral")} />;
  }
  if (telaDoJogo === "desafios") {
    return <PainelDeDesafios partida={partida} aoVoltar={() => aoTelaDoJogo("visaoGeral")} />;
  }
  if (telaDoJogo === "servico") {
    return (
      <BancadaDeCombate
        partida={partida}
        prepararRisco={prepararRisco}
        aoAlterarPartida={aoPersistir}
        aoAlterarEstadoDeRisco={aoAlterarEstadoDeRisco}
        aoRetorno={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }
  if (telaDoJogo === "masmorra") {
    return (
      <BancadaDaMasmorra
        partida={partida}
        prepararRisco={prepararRisco}
        aoAlterarPartida={aoPersistir}
        aoAlterarEstadoDeRisco={aoAlterarEstadoDeRisco}
        aoAlterarEstadoDePreparacao={aoAlterarEstadoDePreparacao}
        aoRetorno={() => aoTelaDoJogo("visaoGeral")}
      />
    );
  }

  return (
    <section className="funcionalidade-telaDoJogo">
      <div className="telaDoJogo-tituloDaSecao">
        <div>
          <p className="secao-chamada">Aventura</p>
          <h1 className="destaque-titulo">Além da segurança</h1>
          <p className="atenuado">
            Serviços são encontros menores; Masmorras são expedições prolongadas
            com risco acumulado.
          </p>
        </div>
      </div>
      <div className="aventura-visaoGeral-disposicao secao-espacamento">
        <div className="contexto-arte contexto-arte--aventura" aria-hidden="true">
          <span>ARTE 16:9 · AVENTURA</span>
        </div>
        <div className="aventura-gradeVisual">
          <Card className="aventura-cartao">
            <p className="secao-chamada">Serviço</p>
            <h2>Estrada Baixa</h2>
            <p className="atenuado">
              Presença hostil confirmada. Encontro de curta duração.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Estado</span>
              <strong>
                {partida.combate.loboDerrotado
                  ? "Concluído anteriormente"
                  : "Disponível"}
              </strong>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => aoTelaDoJogo("servico")}
            >
              Preparar serviço
            </Button>
          </Card>
          <Card className="aventura-cartao risco-painel">
            <p className="secao-chamada">Masmorra</p>
            <h2>Dún Liath</h2>
            <p className="atenuado">
              Fortaleza Cinzenta · expedição prolongada · Bolsa de Expedição.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Contrato</span>
              <strong>
                {partida.masmorra.contratoAceito || partida.masmorra.contratoConcluido
                  ? "Conhecido"
                  : "Ainda não aceito"}
              </strong>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => aoTelaDoJogo("masmorra")}
            >
              {(partida.masmorra.expedicaoAtiva || partida.masmorra.incursaoAutomaticaAtiva) ? "Retomar atividade" : "Ver Dún Liath"}
            </Button>
          </Card>
          <Card className="aventura-cartao">
            <p className="secao-chamada">Grupo · Ameaça</p>
            <h2>Parceiros e formação</h2>
            <p className="atenuado">
              Prepare até três parceiros, conheça as regras de foco dos inimigos
              e acompanhe a jornada de Mira após Dún Liath.
            </p>
            <div className="informacao-linhaDeDados">
              <span>Parceiros ativos</span>
              <strong>{partida.grupo.idsDosParceirosAtivos.length}/3</strong>
            </div>
            <Button variant="secondary" size="sm" icon={<IconeDoJogo icone={iconeDeAtalhoPorId.grupo} tamanho={16} />} onClick={() => aoTelaDoJogo("grupo")}>
              Consultar Grupo
            </Button>
          </Card>
          <Card className="aventura-cartao">
            <p className="secao-chamada">Desafios</p>
            <h2>Marcos da jornada</h2>
            <p className="atenuado">Acompanhe contratos, descobertas e seu progresso.</p>
            <div className="informacao-linhaDeDados"><span>Concluídos</span><strong>{partida.desafios.idsConcluidos.length}</strong></div>
            <Button variant="secondary" size="sm" onClick={() => aoTelaDoJogo("desafios")}>Consultar desafios</Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

