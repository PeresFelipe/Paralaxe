import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import styles from './MenuDeOpcoes.module.css'

/** Contrato de opção reutilizável: apenas acrescente itens a uma lista no chamador. */
export type OpcaoDeMenu = {
  id: string
  grupo: string
  titulo: string
  descricao?: string
  icone?: ReactNode
  detalhe?: string
  desabilitada?: boolean
  acao: () => void
}

type PropriedadesDeMenu = {
  itens: readonly OpcaoDeMenu[]
  alinhamento?: 'inicio' | 'fim'
  abertoInicial?: boolean
}

/** Menu de cabeçalho com fechamento externo/Esc e navegação por teclado. */
export function MenuDeOpcoes({ itens, alinhamento = 'fim', abertoInicial = false }: PropriedadesDeMenu) {
  const [aberto, definirAberto] = useState(abertoInicial)
  const [abrirAcima, definirAbrirAcima] = useState(false)
  const [alturaDisponivel, definirAlturaDisponivel] = useState<number | null>(null)
  const idDoMenu = useId()
  const raizRef = useRef<HTMLSpanElement>(null)
  const disparadorRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLSpanElement>(null)

  // Calcula apenas enquanto o menu está aberto. Mantém a lista visível
  // em janelas baixas e quando o componente está longe do topo (/ui-kit).
  useLayoutEffect(() => {
    if (!aberto) return

    function atualizarPosicao() {
      const gatilho = disparadorRef.current
      if (!gatilho) return
      const retangulo = gatilho.getBoundingClientRect()
      const abaixo = Math.max(0, window.innerHeight - retangulo.bottom - 12)
      const acima = Math.max(0, retangulo.top - 12)
      const alturaMenu = menuRef.current?.scrollHeight ?? 320
      const inverter = abaixo < alturaMenu && acima > abaixo
      definirAbrirAcima(inverter)
      definirAlturaDisponivel(Math.max(0, Math.min(512, inverter ? acima : abaixo)))
    }

    atualizarPosicao()
    window.addEventListener('resize', atualizarPosicao)
    window.addEventListener('scroll', atualizarPosicao, true)
    return () => {
      window.removeEventListener('resize', atualizarPosicao)
      window.removeEventListener('scroll', atualizarPosicao, true)
    }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return

    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()

    function dispensarCliqueExterno(evento: PointerEvent) {
      if (!raizRef.current?.contains(evento.target as Node)) definirAberto(false)
    }

    function dispensarEscape(evento: globalThis.KeyboardEvent) {
      if (evento.key !== 'Escape') return
      evento.preventDefault()
      definirAberto(false)
      disparadorRef.current?.focus()
    }

    document.addEventListener('pointerdown', dispensarCliqueExterno)
    document.addEventListener('keydown', dispensarEscape)
    return () => {
      document.removeEventListener('pointerdown', dispensarCliqueExterno)
      document.removeEventListener('keydown', dispensarEscape)
    }
  }, [aberto])

  function navegarPeloTeclado(evento: KeyboardEvent<HTMLSpanElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(evento.key)) return

    const opcoes = Array.from(
      evento.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'),
    )
    if (opcoes.length === 0) return

    evento.preventDefault()
    const atual = opcoes.indexOf(document.activeElement as HTMLButtonElement)
    const indice = evento.key === 'Home' ? 0
      : evento.key === 'End' ? opcoes.length - 1
      : evento.key === 'ArrowDown' ? (atual + 1) % opcoes.length
      : (atual - 1 + opcoes.length) % opcoes.length
    opcoes[indice]?.focus()
  }

  // O Map preserva a ordem dos grupos e permite novas seções sem condicional de layout.
  const grupos = new Map<string, OpcaoDeMenu[]>()
  for (const opcao of itens) {
    const grupo = grupos.get(opcao.grupo) ?? []
    grupo.push(opcao)
    grupos.set(opcao.grupo, grupo)
  }

  return (
    <span
      className={styles.raiz}
      ref={raizRef}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) definirAberto(false)
      }}
    >
      <button
        ref={disparadorRef}
        className={styles.disparador}
        type="button"
        title="Opções do jogo"
        aria-label="Abrir opções do jogo"
        aria-haspopup="menu"
        aria-controls={aberto ? idDoMenu : undefined}
        aria-expanded={aberto}
        onClick={() => definirAberto(valor => !valor)}
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {aberto ? (
        <span
          id={idDoMenu}
          ref={menuRef}
          className={styles.painel}
          data-alinhamento={alinhamento}
          data-posicao={abrirAcima ? 'acima' : 'abaixo'}
          style={alturaDisponivel === null ? undefined : { maxHeight: alturaDisponivel }}
          role="menu"
          aria-label="Opções do jogo"
          onKeyDown={navegarPeloTeclado}
        >
          <span className={styles.cabecalho} aria-hidden="true">
            <strong>Opções</strong>
            <small>Personalize sua jornada</small>
          </span>

          {Array.from(grupos, ([grupo, opcoes]) => (
            <span className={styles.grupo} role="group" aria-label={grupo} key={grupo}>
              <span className={styles.nomeGrupo} aria-hidden="true">{grupo}</span>
              {opcoes.map(opcao => (
                <button
                  key={opcao.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  className={styles.opcao}
                  disabled={opcao.desabilitada}
                  onClick={() => {
                    definirAberto(false)
                    disparadorRef.current?.focus()
                    opcao.acao()
                  }}
                >
                  {opcao.icone ? <span className={styles.icone} aria-hidden="true">{opcao.icone}</span> : null}
                  <span className={styles.textos}>
                    <strong>{opcao.titulo}</strong>
                    {opcao.descricao ? <small>{opcao.descricao}</small> : null}
                  </span>
                  {opcao.detalhe ? <span className={styles.detalhe}>{opcao.detalhe}</span> : null}
                </button>
              ))}
            </span>
          ))}
        </span>
      ) : null}
    </span>
  )
}
