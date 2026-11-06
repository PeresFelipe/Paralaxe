/** Verifica que o workspace mantém um único documento de lock do pnpm. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export function validarLockfile(conteudo) {
  const erros = []
  const marcadores = [...conteudo.matchAll(/^---\s*$/gm)].length
  const versoes = [...conteudo.matchAll(/^lockfileVersion\s*:/gm)].length
  const importers = [...conteudo.matchAll(/^importers\s*:/gm)].length
  if (marcadores > 1 || versoes !== 1 || importers !== 1) {
    erros.push('O pnpm-lock.yaml deve conter apenas um documento de workspace.')
  }
  for (const pacote of ['aplicativos/jogo', 'pacotes/conteudo', 'pacotes/dominio', 'pacotes/interface', 'pacotes/persistencia']) {
    if (!conteudo.includes('  ' + pacote + ':')) erros.push('Importer ausente: ' + pacote)
  }
  return erros
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const arquivo = fileURLToPath(new URL('../pnpm-lock.yaml', import.meta.url))
  const erros = validarLockfile(readFileSync(arquivo, 'utf8'))
  if (erros.length) {
    console.error(erros.join('\n'))
    process.exitCode = 1
  } else {
    console.log('Lockfile pnpm: um documento YAML e importers do workspace verificados.')
  }
}
