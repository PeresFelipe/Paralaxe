/**
 * Larguras de conteúdo adaptadas dos estilos
 * compact/normal/wide em GylanSalih/Skill-Issue-Chronicles.
 * Copyright (c) 2025 Gylan Salih — MIT.
 * Origem: https://github.com/GylanSalih/Skill-Issue-Chronicles
 * Licença integral em /creditos/skill-issue-chronicles-MIT.txt.
 * Modificado para CSS tokens, layouts do Paralaxe e escolha persistida.
 */
export const MODOS_DE_LARGURA = ['compacta', 'normal', 'ampla'] as const
export type ModoDeLargura = (typeof MODOS_DE_LARGURA)[number]

export const rotuloDoModoDeLargura: Record<ModoDeLargura, string> = {
  compacta: 'Foco',
  normal: 'Confortável',
  ampla: 'Ampla',
}

export function proximoModoDeLargura(atual: ModoDeLargura): ModoDeLargura {
  const indice = MODOS_DE_LARGURA.indexOf(atual)
  return MODOS_DE_LARGURA[(indice + 1) % MODOS_DE_LARGURA.length] ?? 'normal'
}
