import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('lockfile pnpm 12 do workspace', () => {
  it('mantém os documentos boot e projeto, ambos válidos', () => {
    const texto = readFileSync(new URL('../../../../pnpm-lock.yaml', import.meta.url), 'utf8')
    const documentos = texto.split(/^---\s*$/gm).map(doc => doc.trim()).filter(Boolean)
    expect(documentos).toHaveLength(2)
    expect(documentos[0]).toContain('packageManagerDependencies:')
    expect(documentos[1]).toContain('  aplicativos/jogo:')
    expect(documentos.every(doc => doc.includes("lockfileVersion: '9.0'"))).toBe(true)
  })

  it('executa o verificador nativo independentemente do caminho Windows/Linux', () => {
    const script = fileURLToPath(new URL('../../../../ferramentas/verificarLockfile.mjs', import.meta.url))
    const resultado = execFileSync(process.execPath, [script], { encoding: 'utf8' })
    expect(resultado).toContain('Lockfile pnpm:')
  })
})
