import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const app = join(raiz, 'aplicativos', 'jogo');
const require = createRequire(import.meta.url);
const ts = require(join(app, 'node_modules', 'typescript'));
const erros = [];

async function arquivosEm(diretorio, extensoes) {
  const encontrados = [];
  for (const entrada of await readdir(diretorio, { withFileTypes: true })) {
    const caminho = join(diretorio, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...await arquivosEm(caminho, extensoes));
    else if (extensoes.includes(extname(entrada.name))) encontrados.push(caminho);
  }
  return encontrados;
}

const tsArquivos = [
  ...await arquivosEm(join(app, 'fonte'), ['.ts', '.tsx']),
  ...await arquivosEm(join(raiz, 'pacotes'), ['.ts', '.tsx']),
];
const raizUi = resolve(app, 'fonte', 'components', 'ui');
const parserTs = ts.ScriptTarget.Latest;
const controlesProibidos = new Set(['button', 'input', 'select', 'textarea', 'progress']);

for (const arquivo of tsArquivos) {
  const conteudo = await readFile(arquivo, 'utf8');
  const fonte = ts.createSourceFile(arquivo, conteudo, parserTs, true, arquivo.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const dentroDeUi = resolve(arquivo).startsWith(raizUi + sep);
  function visitar(no) {
    const elementoJsx = ts.isJsxOpeningElement(no) || ts.isJsxSelfClosingElement(no);
    if (no.kind === ts.SyntaxKind.AnyKeyword) erros.push(`${arquivo}: tipo any proibido pelo TypeScript estrito`);
    if (!dentroDeUi && elementoJsx && ts.isIdentifier(no.tagName) && controlesProibidos.has(no.tagName.text)) {
      erros.push(`${arquivo}: elemento <${no.tagName.text}> fora de components/ui`);
    }
    if (ts.isImportDeclaration(no) || ts.isExportDeclaration(no)) {
      const modulo = no.moduleSpecifier;
      if (modulo && ts.isStringLiteral(modulo)) {
        if (modulo.text.startsWith('@greywake/persistencia/') || modulo.text === '@greywake/persistencia') {
          if (arquivo !== join(app, 'fonte', 'principal.tsx')) erros.push(`${arquivo}: persistência deve ser conectada apenas no composition root principal.tsx`);
        }
        if (arquivo.includes(join('pacotes', 'dominio')) && /^react(?:\/|$)/.test(modulo.text)) {
          erros.push(`${arquivo}: domínio não pode importar React`);
        }
      }
    }
    ts.forEachChild(no, visitar);
  }
  visitar(fonte);
}

const arquivosTsConhecidos = new Set(tsArquivos.map((arquivo) => resolve(arquivo)));
const grafoModulos = new Map(tsArquivos.map((arquivo) => [resolve(arquivo), []]));
function resolverModuloLocal(importador, modulo) {
  if (!modulo.startsWith('./') && !modulo.startsWith('../') && !modulo.startsWith('@/')) return null;
  const base = modulo.startsWith('@/')
    ? resolve(app, 'fonte', modulo.slice(2))
    : resolve(dirname(importador), modulo);
  const candidatos = extname(base)
    ? [base]
    : [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')];
  return candidatos.map((candidato) => resolve(candidato)).find((candidato) => arquivosTsConhecidos.has(candidato)) ?? null;
}
for (const arquivo of tsArquivos) {
  const fonte = ts.createSourceFile(arquivo, await readFile(arquivo, 'utf8'), parserTs, true, arquivo.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function coletarImport(no) {
    if (ts.isImportDeclaration(no) || ts.isExportDeclaration(no)) {
      const modulo = no.moduleSpecifier;
      const somenteTipos = ts.isImportDeclaration(no)
        ? Boolean(no.importClause?.isTypeOnly || (!no.importClause?.name && no.importClause?.namedBindings && ts.isNamedImports(no.importClause.namedBindings) && no.importClause.namedBindings.elements.every((elemento) => elemento.isTypeOnly)))
        : Boolean(no.isTypeOnly || (no.exportClause && ts.isNamedExports(no.exportClause) && no.exportClause.elements.every((elemento) => elemento.isTypeOnly)));
      if (!somenteTipos && modulo && ts.isStringLiteral(modulo)) {
        const destino = resolverModuloLocal(arquivo, modulo.text);
        if (destino) grafoModulos.get(resolve(arquivo)).push(destino);
      }
    }
    ts.forEachChild(no, coletarImport);
  }
  coletarImport(fonte);
}
const caminhoModulos = [];
const ativosModulos = new Set();
const visitadosModulos = new Set();
const ciclosEncontrados = new Set();
function visitarModulo(arquivo) {
  if (ativosModulos.has(arquivo)) {
    const inicio = caminhoModulos.indexOf(arquivo);
    const ciclo = [...caminhoModulos.slice(inicio), arquivo].map((item) => relative(raiz, item)).join(' -> ');
    if (!ciclosEncontrados.has(ciclo)) {
      erros.push(`ciclo entre módulos: ${ciclo}`);
      ciclosEncontrados.add(ciclo);
    }
    return;
  }
  if (visitadosModulos.has(arquivo)) return;
  ativosModulos.add(arquivo);
  caminhoModulos.push(arquivo);
  for (const destino of grafoModulos.get(arquivo) ?? []) visitarModulo(destino);
  caminhoModulos.pop();
  ativosModulos.delete(arquivo);
  visitadosModulos.add(arquivo);
}
for (const arquivo of grafoModulos.keys()) visitarModulo(arquivo);

const pacotes = [join(raiz, 'aplicativos', 'jogo'), ...await Promise.all((await readdir(join(raiz, 'pacotes'), { withFileTypes: true })).filter((item) => item.isDirectory()).map((item) => join(raiz, 'pacotes', item.name)))];
const pacotesWorkspace = new Map();
for (const pacote of pacotes) {
  const manifesto = JSON.parse(await readFile(join(pacote, 'package.json'), 'utf8'));
  pacotesWorkspace.set(manifesto.name, manifesto);
}
const grafoPacotes = new Map([...pacotesWorkspace.keys()].map((nome) => [nome, []]));
for (const [nome, manifesto] of pacotesWorkspace) {
  for (const campo of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [dependencia, versao] of Object.entries(manifesto[campo] ?? {})) {
      if (versao === 'workspace:*' && pacotesWorkspace.has(dependencia)) grafoPacotes.get(nome).push(dependencia);
    }
  }
}
const caminhoPacotes = [];
const ativos = new Set();
const visitados = new Set();
function visitarPacote(nome) {
  if (ativos.has(nome)) {
    const inicio = caminhoPacotes.indexOf(nome);
    erros.push(`ciclo entre pacotes: ${[...caminhoPacotes.slice(inicio), nome].join(' -> ')}`);
    return;
  }
  if (visitados.has(nome)) return;
  ativos.add(nome);
  caminhoPacotes.push(nome);
  for (const dependencia of grafoPacotes.get(nome) ?? []) visitarPacote(dependencia);
  caminhoPacotes.pop();
  ativos.delete(nome);
  visitados.add(nome);
}
for (const nome of grafoPacotes.keys()) visitarPacote(nome);

const cssArquivos = await arquivosEm(join(app, 'fonte'), ['.css']);
const cssTokens = join(app, 'fonte', 'styles', 'tokens.css');
const unidadeCrua = /(?<![\w-])\d+(?:\.\d+)?(?:px|rem|em|ms|s)\b/;
const corCrua = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?)\s*\(/i;
const corNomeadaCrua = /(?:^|[;{])\s*(?:color|background(?:-color)?|border(?:-[\w-]+)?|outline|fill|stroke)\s*:\s*(?:[^;]*\b)(?:black|white|red|green|blue|gray|grey|yellow|orange|purple|pink|brown|navy|teal|silver|maroon|olive|lime|aqua|fuchsia)\b/i;
const tokensDeclarados = new Set();
for (const linha of (await readFile(cssTokens, 'utf8')).split(/\r?\n/)) {
  const declaracao = linha.match(/^\s*(--[\w-]+)\s*:/)?.[1];
  if (!declaracao) continue;
  if (tokensDeclarados.has(declaracao)) erros.push(`${cssTokens}: token duplicado ${declaracao}`);
  tokensDeclarados.add(declaracao);
}
for (const arquivo of cssArquivos) {
  if (arquivo === cssTokens) continue;
  const linhas = (await readFile(arquivo, 'utf8')).split(/\r?\n/);
  let dentroDeFontFace = false;
  for (let indice = 0; indice < linhas.length; indice++) {
    const linha = linhas[indice];
    if (/@font-face\b/.test(linha)) dentroDeFontFace = true;
    if (/^\s*@(media|container)\b/.test(linha)) {
      continue;
    }
    if (unidadeCrua.test(linha)) erros.push(`${arquivo}:${indice + 1}: medida literal CSS deve usar token`);
    if (corCrua.test(linha) || corNomeadaCrua.test(linha)) erros.push(`${arquivo}:${indice + 1}: cor literal CSS deve usar token`);
    if (/\bfont-family\s*:\s*(?!\s*(?:var\(|inherit\b|initial\b|unset\b))/i.test(linha) && !dentroDeFontFace && !/--ui-font-family/.test(linha)) {
      erros.push(`${arquivo}:${indice + 1}: família tipográfica deve usar token`);
    }
    if (/(?<![-\w])font-size\s*:\s*(?!\s*(?:var\(|inherit\b|initial\b|unset\b))/i.test(linha)) erros.push(`${arquivo}:${indice + 1}: tamanho tipográfico deve usar token`);
    if (!dentroDeFontFace && /(?<![-\w])font-weight\s*:\s*(?!\s*(?:var\(|normal\b|bold\b|inherit\b|initial\b|unset\b))/i.test(linha)) erros.push(`${arquivo}:${indice + 1}: peso tipográfico deve usar token`);
    if (/(?<![-\w])(?:line-height|letter-spacing)\s*:\s*(?!\s*(?:var\(|normal\b|inherit\b|initial\b|unset\b))/i.test(linha)) erros.push(`${arquivo}:${indice + 1}: altura de linha ou espaçamento tipográfico deve usar token`);
    if (/(?<![-\w])z-index\s*:\s*(?!\s*(?:var\(|auto\b))/i.test(linha)) erros.push(`${arquivo}:${indice + 1}: camada deve usar token`);
    if (/\b(?:transition|animation)(?:-[\w-]+)?\s*:[^;]*(?:\d+(?:\.\d+)?\s*(?:ms|s)\b)/i.test(linha)) erros.push(`${arquivo}:${indice + 1}: duração de movimento deve usar token`);
    if (dentroDeFontFace && /^\s*}/.test(linha)) dentroDeFontFace = false;
  }
}

if (erros.length) {
  console.error(`Verificação arquitetural falhou (${erros.length}):\n- ${erros.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Verificação arquitetural aprovada: ${tsArquivos.length} arquivos TS/TSX, ${pacotesWorkspace.size} pacotes e ${cssArquivos.length} folhas CSS.`);
}
