/** Cena compartilhada dos ofícios: quadro uniforme e versão imóvel para movimento reduzido. */
import type { IdDaProfissao } from '@paralaxe/dominio'
import estilos from './CenaDoOficio.module.css'

const artes: Partial<Record<IdDaProfissao, { movimento: string; estatico: string }>> = {
  mineracao: { movimento: '/arte/atividades/mineracao-suave.gif?v=1', estatico: '/arte/atividades/mineracao-estatico.png?v=2' },
  lenhador: { movimento: '/arte/atividades/lenhador-suave.gif?v=1', estatico: '/arte/atividades/lenhador-estatico.png?v=2' },
  pesca: { movimento: '/arte/atividades/pesca-suave.gif?v=1', estatico: '/arte/atividades/pesca-estatico.png?v=2' },
  herbologia: { movimento: '/arte/atividades/herbologia-suave.gif?v=1', estatico: '/arte/atividades/herbologia-estatico.png?v=2' },
  metalurgia: { movimento: '/arte/atividades/metalurgia-suave.gif?v=1', estatico: '/arte/atividades/metalurgia-estatico.png?v=2' },
  forja: { movimento: '/arte/atividades/forja-suave.gif?v=1', estatico: '/arte/atividades/forja-estatico.png?v=2' },
  culinaria: { movimento: '/arte/atividades/culinaria-suave.gif?v=1', estatico: '/arte/atividades/culinaria-estatico.png?v=2' },
}

type Propriedades = { profissao: IdDaProfissao; legenda: string; emAtividade?: boolean }
export function CenaDoOficio({ profissao, legenda, emAtividade = false }: Propriedades) {
  const arte = artes[profissao]
  return (
    <figure className={estilos.moldura}>
      <div className={estilos.palco} aria-hidden="true">
        {arte ? (
          <picture>
            <source media="(prefers-reduced-motion: reduce)" srcSet={arte.estatico} />
            <img src={emAtividade ? arte.movimento : arte.estatico} width={480} height={270} alt="" decoding="async" />
          </picture>
        ) : null}
      </div>
      <figcaption className={estilos.legenda}>{legenda}</figcaption>
    </figure>
  )
}

