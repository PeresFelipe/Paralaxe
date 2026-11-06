import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { validarLockfile } from '../../../../ferramentas/verificarLockfile.mjs'

describe('lockfile pnpm do workspace', () => {
  it('mantém um único documento e os importers do projeto', () => {
    const texto = readFileSync(new URL('../../../../pnpm-lock.yaml', import.meta.url), 'utf8')
    expect(validarLockfile(texto)).toEqual([])
  })
  it('rejeita dois documentos concatenados e importers ausentes', () => {
    expect(validarLockfile("---\nlockfileVersion: '9.0'\nimporters:\n---\nlockfileVersion: '9.0'\nimporters:")).not.toEqual([])
  })
})
