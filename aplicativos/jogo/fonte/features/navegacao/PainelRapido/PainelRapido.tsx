/**
 * @file Contêiner modal reutilizado pelos painéis laterais da partida.
 * A presença do componente controla a abertura; o pai recebe a intenção de fechar.
 */
import type { ReactNode } from 'react'
import { Modal } from '../../../components/ui'
import estilos from './PainelRapido.module.css'

/** Compõe o diálogo compartilhado com a apresentação lateral própria do painel rápido. */
export default function PainelRapido({ rotulo, aoFechar, children }: {
  rotulo: string
  aoFechar: () => void
  children: ReactNode
}) {
  return <Modal className={`${estilos.panel} lateral-folha`} ariaLabel={rotulo} onClose={aoFechar}>{children}</Modal>
}
