/**
 * @file Folha de consulta rápida compartilhada por Jornada e Inventário.
 * O <dialog> nativo cuida do foco, Escape e retorno ao acionador.
 * Apenas o corpo rola; o botão de fechar nunca abandona a área visível.
 */
import { useId, type ReactNode } from 'react'
import { Button, Modal } from '@/components/ui'
import estilos from './PainelRapido.module.css'

type Propriedades = {
  rotulo: string
  aoFechar: () => void
  children: ReactNode
  icone?: ReactNode
}

/** Mantém o contrato anterior e oferece um cabeçalho semanticamente associado ao diálogo. */
export default function PainelRapido({ rotulo, aoFechar, children, icone }: Propriedades) {
  const tituloId = useId()

  return (
    <Modal className={`${estilos.panel} lateral-folha`} labelledBy={tituloId} onClose={aoFechar}>
      <header className={estilos.header}>
        <div className={estilos.identity}>
          {icone ? <span className={estilos.icone} aria-hidden="true">{icone}</span> : null}
          <div className={estilos.titulos}>
            <span className={estilos.contexto}>Consulta rápida</span>
            <h2 className={estilos.titulo} id={tituloId}>{rotulo}</h2>
          </div>
        </div>
        <Button
          variant="ghost"
          type="button"
          autoFocus
          className={estilos.fechar}
          onClick={aoFechar}
          aria-label={`Fechar ${rotulo}`}
          title={`Fechar ${rotulo}`}
        >
          <span aria-hidden="true">×</span>
        </Button>
      </header>
      <div className={estilos.corpo}>{children}</div>
    </Modal>
  )
}
