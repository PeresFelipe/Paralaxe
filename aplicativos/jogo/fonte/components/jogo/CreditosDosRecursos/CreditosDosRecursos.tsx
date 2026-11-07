/**
 * @file Créditos apresentados a partir do catálogo único de recursos.
 * A janela reúne autoria, origem, adaptações e avisos sem duplicar esses dados no JSX.
 */
import { useId, useState } from 'react'
import catalogo from '@/catalogoDeCreditos.json'
import estilos from './CreditosDosRecursos.module.css'
import { IconeDoJogo } from '..'
import { Button, Modal } from '../../ui'

/** Filtra um grupo e apresenta suas contribuições e as atribuições complementares. */
function ListaDeContribuicoes({ grupo }: { grupo: string }) {
  return <ul className={estilos.list}>
    {catalogo.recursos.filter((recurso) => recurso.grupo === grupo).map((recurso) => <li key={recurso.id} className={estilos.contribution}>
      <div className={estilos.authorship}>
        <h4>{recurso.titulo}</h4>
        <p className={estilos.authors}>{recurso.autores.map((autor) => autor.url
          ? <a key={autor.nome} href={autor.url} target="_blank" rel="noopener noreferrer">{autor.nome}<span className={estilos.visuallyHidden}> (abre em nova aba)</span></a>
          : <span key={autor.nome}>{autor.nome}</span>)}</p>
      </div>
      <div className={estilos.description}>
        <p>{recurso.contribuicao}</p>
        <p className={estilos.adaptation}>{recurso.modificacoes}</p>
        <div className={estilos.references}>
          {recurso.licenca.url
            ? <a className={estilos.license} href={recurso.licenca.url} target="_blank" rel="noopener noreferrer" aria-label={`${recurso.licenca.nome} · ${recurso.titulo} (abre em nova aba)`}>{recurso.licenca.nome}</a>
            : <span className={estilos.license}>{recurso.licenca.nome}</span>}
          {recurso.origem ? <a href={recurso.origem} target="_blank" rel="noopener noreferrer" aria-label={`Página original · ${recurso.titulo} (abre em nova aba)`}>Página original <span aria-hidden="true">↗</span></a> : null}
          {recurso.avisos.map((aviso) => <a key={aviso.url} href={aviso.url} target="_blank" rel="noopener noreferrer" aria-label={`${aviso.rotulo} · ${recurso.titulo} (abre em nova aba)`}>{aviso.rotulo} <span aria-hidden="true">↗</span></a>)}
        </div>
        {recurso.creditosComplementares.map((credito) => <div key={credito.url} className={estilos.complementaryOrigin}>
          <p><a href={credito.url} target="_blank" rel="noopener noreferrer">{credito.nome}<span className={estilos.visuallyHidden}> (abre em nova aba)</span></a>{' · '}<a href={credito.urlLicenca} target="_blank" rel="noopener noreferrer">{credito.licenca}<span className={estilos.visuallyHidden}> (abre em nova aba)</span></a></p>
          <p>{credito.observacao}</p>
        </div>)}
      </div>
    </li>)}
  </ul>
}

/** Modal acessível com título exclusivo e devolução do foco ao elemento que o abriu. */
function JanelaDeCreditos({ aoFechar }: { aoFechar: () => void }) {
  const id = useId()

  // O portal coloca o diálogo fora da navegação lateral, evitando recortes ou
  // ocultação herdada de contêineres responsivos. Modal centraliza foco, Escape e portal.
  return <Modal className={estilos.dialog} labelledBy={`${id}-titulo`} describedBy={`${id}-descricao`} closeOnBackdropClick onClose={aoFechar}>
    <header className={estilos.header}>
      <div>
        <p className={estilos.brand}>Paralaxe</p>
        <h2 id={`${id}-titulo`}>Créditos e licenças</h2>
        <p id={`${id}-descricao`}>Arte, autoria e contribuições que dão vida à jornada.</p>
      </div>
      <Button variant="icon" aria-label="Fechar créditos" onClick={aoFechar}>×</Button>
    </header>
    <div className={estilos.content} tabIndex={0} role="region" aria-label="Contribuições ao Paralaxe">
      {catalogo.grupos.filter((grupo) => grupo.id !== 'tecnologia' && grupo.id !== 'referencias').map((grupo) => <section key={grupo.id} className={estilos.group} aria-labelledby={`${id}-${grupo.id}`}>
        <h3 id={`${id}-${grupo.id}`}>{grupo.titulo}</h3>
        <ListaDeContribuicoes grupo={grupo.id} />
      </section>)}
      <details className={estilos.technology}>
        <summary>Referências de jogos idle — autores e licenças</summary>
        <p>Ideias e padrões estudados; nenhum código ou asset desses projetos foi incorporado.</p>
        <ListaDeContribuicoes grupo="referencias" />
      </details>
      {/* As dependências de software ficam em uma seção expansível para priorizar a autoria visual. */}
      <details className={estilos.technology}>
        <summary>Tecnologia e licenças de software</summary>
        <ListaDeContribuicoes grupo="tecnologia" />
      </details>
      <p className={estilos.thanks}>Obrigado aos artistas e colaboradores por compartilharem seu trabalho.</p>
    </div>
    <footer className={estilos.footer}>
      <span>Cada contribuição mantém seus próprios termos de uso.</span>
      <a href="/creditos/LEIA-ME.txt" target="_blank" rel="noopener noreferrer">Consultar os avisos<span className={estilos.visuallyHidden}> (abre em nova aba)</span> <span aria-hidden="true">↗</span></a>
    </footer>
  </Modal>
}

/** Mantém apenas o estado de abertura; desmontar a janela executa a restauração do foco. */
export default function CreditosDosRecursos() {
  const [aberto, definirAberto] = useState(false)
  return <div className={estilos.trigger}>
    <Button variant="secondary" icon={<IconeDoJogo icone="livro-abrir" tamanho={24} />} aria-haspopup="dialog" onClick={() => definirAberto(true)}>
      Créditos e licenças <span aria-hidden="true">→</span>
    </Button>
    {aberto ? <JanelaDeCreditos aoFechar={() => definirAberto(false)} /> : null}
  </div>
}
