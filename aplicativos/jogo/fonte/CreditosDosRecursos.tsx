/**
 * @file Créditos apresentados a partir do catálogo único de recursos.
 * A janela reúne autoria, origem, adaptações e avisos sem duplicar esses dados no JSX.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import catalogo from './catalogoDeCreditos.json'
import IconeDoJogo from './IconeDoJogo'

/** Filtra um grupo e apresenta suas contribuições e as atribuições complementares. */
function ListaDeContribuicoes({ grupo }: { grupo: string }) {
  return <ul className="creditos-lista">
    {catalogo.recursos.filter((recurso) => recurso.grupo === grupo).map((recurso) => <li key={recurso.id} className="creditos-contribuicao">
      <div className="creditos-autoria">
        <h4>{recurso.titulo}</h4>
        <p className="creditos-autores">{recurso.autores.map((autor) => autor.url
          ? <a key={autor.nome} href={autor.url} target="_blank" rel="noopener noreferrer">{autor.nome}<span className="creditos-leitor"> (abre em nova aba)</span></a>
          : <span key={autor.nome}>{autor.nome}</span>)}</p>
      </div>
      <div className="creditos-descricao">
        <p>{recurso.contribuicao}</p>
        <p className="creditos-adaptacao">{recurso.modificacoes}</p>
        <div className="creditos-referencias">
          {recurso.licenca.url
            ? <a className="creditos-licenca" href={recurso.licenca.url} target="_blank" rel="noopener noreferrer" aria-label={`${recurso.licenca.nome} · ${recurso.titulo} (abre em nova aba)`}>{recurso.licenca.nome}</a>
            : <span className="creditos-licenca">{recurso.licenca.nome}</span>}
          {recurso.origem ? <a href={recurso.origem} target="_blank" rel="noopener noreferrer" aria-label={`Página original · ${recurso.titulo} (abre em nova aba)`}>Página original <span aria-hidden="true">↗</span></a> : null}
          {recurso.avisos.map((aviso) => <a key={aviso.url} href={aviso.url} target="_blank" rel="noopener noreferrer" aria-label={`${aviso.rotulo} · ${recurso.titulo} (abre em nova aba)`}>{aviso.rotulo} <span aria-hidden="true">↗</span></a>)}
        </div>
        {recurso.creditosComplementares.map((credito) => <div key={credito.url} className="creditos-origem-complementar">
          <p><a href={credito.url} target="_blank" rel="noopener noreferrer">{credito.nome}<span className="creditos-leitor"> (abre em nova aba)</span></a>{' · '}<a href={credito.urlLicenca} target="_blank" rel="noopener noreferrer">{credito.licenca}<span className="creditos-leitor"> (abre em nova aba)</span></a></p>
          <p>{credito.observacao}</p>
        </div>)}
      </div>
    </li>)}
  </ul>
}

/** Modal acessível com título exclusivo e devolução do foco ao elemento que o abriu. */
function JanelaDeCreditos({ aoFechar }: { aoFechar: () => void }) {
  const referencia = useRef<HTMLDialogElement>(null)
  const id = useId()

  useEffect(() => {
    const janela = referencia.current
    const acionador = document.activeElement
    janela?.showModal()
    return () => {
      janela?.close()
      if (acionador instanceof HTMLElement && acionador.isConnected) acionador.focus()
    }
  }, [])

  // O portal coloca o diálogo fora da navegação lateral, evitando recortes ou
  // ocultação herdada de contêineres responsivos. O diálogo nativo controla o foco modal.
  return createPortal(<dialog ref={referencia} className="creditos-janela" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-descricao`}
    onCancel={(evento) => { evento.preventDefault(); aoFechar() }}
    onClick={(evento) => {
      // Cliques nos filhos não fecham a janela. No próprio diálogo, somente coordenadas
      // fora do retângulo indicam um clique no fundo escurecido.
      if (evento.target !== evento.currentTarget) return
      const limites = evento.currentTarget.getBoundingClientRect()
      if (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom) aoFechar()
    }}>
    <header className="creditos-cabecalho">
      <div>
        <p className="creditos-marca">Greywake</p>
        <h2 id={`${id}-titulo`}>Créditos e licenças</h2>
        <p id={`${id}-descricao`}>Arte, autoria e contribuições que dão vida à jornada.</p>
      </div>
      <button className="creditos-fechar" type="button" aria-label="Fechar créditos" onClick={aoFechar}>×</button>
    </header>
    <div className="creditos-conteudo" tabIndex={0} role="region" aria-label="Contribuições ao Greywake">
      {catalogo.grupos.filter((grupo) => grupo.id !== 'tecnologia').map((grupo) => <section key={grupo.id} className="creditos-grupo" aria-labelledby={`${id}-${grupo.id}`}>
        <h3 id={`${id}-${grupo.id}`}>{grupo.titulo}</h3>
        <ListaDeContribuicoes grupo={grupo.id} />
      </section>)}
      {/* As dependências de software ficam em uma seção expansível para priorizar a autoria visual. */}
      <details className="creditos-tecnologia">
        <summary>Tecnologia e licenças de software</summary>
        <ListaDeContribuicoes grupo="tecnologia" />
      </details>
      <p className="creditos-agradecimento">Obrigado aos artistas e colaboradores por compartilharem seu trabalho.</p>
    </div>
    <footer className="creditos-rodape">
      <span>Cada contribuição mantém seus próprios termos de uso.</span>
      <a href="/creditos/LEIA-ME.txt" target="_blank" rel="noopener noreferrer">Consultar os avisos<span className="creditos-leitor"> (abre em nova aba)</span> <span aria-hidden="true">↗</span></a>
    </footer>
  </dialog>, document.body)
}

/** Mantém apenas o estado de abertura; desmontar a janela executa a restauração do foco. */
export default function CreditosDosRecursos() {
  const [aberto, definirAberto] = useState(false)
  return <div className="recursoVisual-creditos">
    <button className="creditos-abrir" type="button" aria-haspopup="dialog" onClick={() => definirAberto(true)}>
      <IconeDoJogo icone="livro-abrir" tamanho={24} />
      <span>Créditos e licenças</span>
      <span aria-hidden="true">→</span>
    </button>
    {aberto ? <JanelaDeCreditos aoFechar={() => definirAberto(false)} /> : null}
  </div>
}
