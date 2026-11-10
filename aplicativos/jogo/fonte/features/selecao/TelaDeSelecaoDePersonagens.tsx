/** Seleção visual das partidas existentes; nenhuma ação altera os dados salvos até o clique. */
import type { ReactNode } from 'react'
import type { IdDaClasseDoPersonagem, IdDoPresente, PartidaLocal } from '@paralaxe/dominio'
import { Button } from '@/components/ui'
import CreditosDosRecursos from '@/components/jogo/CreditosDosRecursos'
import estilos from './TelaDeSelecaoDePersonagens.module.css'

interface Propriedades {
  partidas: PartidaLocal[]
  mensagem: string | null
  aoCriar: () => void
  aoCarregar: (id: PartidaLocal['idDaPartida']) => void
  aoSair?: () => void
  saidaIndisponivel: boolean
  obterNomeDaClasse: (id: IdDaClasseDoPersonagem) => string
  obterNomeDoPresente: (id: IdDoPresente) => string
  avisoDoAplicativo?: ReactNode
}

export default function TelaDeSelecaoDePersonagens({
  partidas, mensagem, aoCriar, aoCarregar, aoSair, saidaIndisponivel,
  obterNomeDaClasse, obterNomeDoPresente, avisoDoAplicativo,
}: Propriedades) {
  return (
    <main className={"entrada-estrutura " + estilos.tela}>
      {avisoDoAplicativo}
      <header className={estilos.cabecalho}>
        <div className={estilos.identidade}>
          <p className={estilos.marca}>PARALAXE</p>
          <span className={estilos.rotuloMarca}>SUA JORNADA</span>
        </div>
        <Button variant="primary" size="md" className={estilos.novo} onClick={aoCriar}>
          <span aria-hidden="true">+</span> Novo personagem
        </Button>
      </header>

      <section className={estilos.introducao} aria-labelledby="selecao-titulo">
        <div>
          <p className={estilos.sobretitulo}>CONTINUAR</p>
          <h1 className={estilos.titulo} id="selecao-titulo">Escolha um personagem</h1>
        </div>
        <span className={estilos.contagem}>
          {partidas.length} {partidas.length === 1 ? 'personagem' : 'personagens'}
        </span>
      </section>

      {mensagem ? <p className="emLinha-mensagem" role="status">{mensagem}</p> : null}

      {partidas.length > 0 ? (
        <section className={estilos.grade} aria-label="Personagens salvos">
          {partidas.map((partida) => {
            const emExpedicao = partida.masmorra.expedicaoAtiva
            const classe = obterNomeDaClasse(partida.personagem.idDaClasse)
            return (
              <Button
                variant="saveCard"
                className={estilos.cartao}
                data-expedicao={emExpedicao ? 'true' : 'false'}
                key={partida.idDaPartida}
                aria-label={partida.personagem.nome + ', ' + classe + ' nível ' + partida.personagem.nivel +
                  (emExpedicao ? '. Retomar expedição em Dún Liath' : '. Continuar jornada')}
                onClick={() => aoCarregar(partida.idDaPartida)}
              >
                <span className={estilos.detalhes}>
                  <span className={estilos.classe}>{classe}</span>
                  <span className={estilos.nivel}>Nv. {partida.personagem.nivel}</span>
                </span>
                <strong className={estilos.nome}>{partida.personagem.nome}</strong>
                <small className={estilos.presente}>{obterNomeDoPresente(partida.personagem.idDoPresente)}</small>
                <span className={estilos.acao}>
                  {emExpedicao ? 'Retomar Dún Liath' : 'Continuar jornada'}
                  <span aria-hidden="true">↗</span>
                </span>
              </Button>
            )
          })}
        </section>
      ) : (
        <div className={estilos.vazio} role="status">
          <p>Você ainda não tem personagens.</p>
          <span>Crie um personagem para começar sua jornada.</span>
        </div>
      )}

      <footer className={estilos.rodape}>
        {aoSair
          ? <Button variant="ghost" className={estilos.sair} disabled={saidaIndisponivel} onClick={aoSair}>
              Sair do acesso local
            </Button>
          : null}
        <CreditosDosRecursos />
      </footer>
    </main>
  )
}
