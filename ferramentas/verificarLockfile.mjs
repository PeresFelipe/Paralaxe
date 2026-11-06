/** Lockfile pnpm 12: documento de boot opcional + documento do projeto. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export function validarLockfile(conteudo) {
  const erros = []
  const documentos = conteudo.trim().split(/^---\s*$/gm).map(doc => doc.trim()).filter(Boolean)
  const marcadores = [...conteudo.matchAll(/^---\s*$/gm)].length

  if (documentos.length < 1 || documentos.length > 2 ||
      (marcadores !== 0 && marcadores !== documentos.length)) {
    erros.push('Lockfile deve conter um documento de projeto e, opcionalmente, um documento de boot do pnpm.')
  }

  for (const documento of documentos) {
    if ([...documento.matchAll(/^lockfileVersion\s*:/gm)].length !== 1) {
      erros.push('Documento YAML sem uma única declaração lockfileVersion.')
    }
  }

  if (documentos.length === 2 &&
      !/\b(?:configDependencies|packageManagerDependencies):/.test(documentos[0])) {
    erros.push('Primeiro documento deve ser o boot/env do pnpm.')
  }

  const projeto = documentos.at(-1) ?? ''
  if (!/^importers:/m.test(projeto)) erros.push('Documento do projeto sem importers.')
  for (const pacote of ['aplicativos/jogo', 'pacotes/conteudo', 'pacotes/dominio', 'pacotes/interface', 'pacotes/persistencia']) {
    if (!projeto.includes('  ' + pacote + ':')) erros.push('Importer ausente: ' + pacote)
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
    console.log('Lockfile pnpm: documento de projeto e boot opcional verificados.')
  }
}
