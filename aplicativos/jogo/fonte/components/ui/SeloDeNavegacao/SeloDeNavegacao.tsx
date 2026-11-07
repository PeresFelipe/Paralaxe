/**
 * Adaptado de NavbarIcon.tsx em ciefa/idle-game-template.
 * Copyright (c) 2026 ciefa — MIT.
 * Fonte: https://github.com/ciefa/idle-game-template/blob/main/src/ui/shell/NavbarIcon.tsx
 * Licença integral distribuída em /creditos/idle-game-template-MIT.txt.
 *
 * Mantido: badgeCount opcional, número visível e limite 99+.
 * Alterado: somente indicador visual, integrado ao Button existente e sem Tailwind.
 * A descrição acessível do contador é responsabilidade do botão de navegação.
 */
import estilos from './SeloDeNavegacao.module.css'

export function SeloDeNavegacao({ quantidade }: { quantidade: number }) {
  const total = Number.isFinite(quantidade) ? Math.max(0, Math.floor(quantidade)) : 0
  if (total === 0) return null

  return (
    <span className={estilos.contador} aria-hidden="true">
      {total > 99 ? '99+' : total}
    </span>
  )
}
