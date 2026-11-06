import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('lockfile pnpm do workspace', () => {
  it('mantém um único documento e os importers do projeto', () => {
    const texto = readFileSync(new URL('../../../../pnpm-lock.yaml', import.meta.url), 'utf8')
    expect([...texto.matchAll(/^---\s*$/gm)]).toHaveLength(1)
    expect([...texto.matchAll(/^lockfileVersion\s*:/gm)]).toHaveLength(1)
    for (const nome of ['aplicativos/jogo', 'pacotes/conteudo', 'pacotes/dominio', 'pacotes/interface', 'pacotes/persistencia']) {
      expect(texto).toContain('  ' + nome + ':')
    }
  })

  it('executa a validação nativa sem erro, inclusive em caminhos Windows', () => {
    const script = fileURLToPath(new URL('../../../../ferramentas/verificarLockfile.mjs', import.meta.url))
    const resultado = execFileSync(process.execPath, [script], { encoding: 'utf8' })
    expect(resultado).toContain('Lockfile pnpm:')
  })
})
