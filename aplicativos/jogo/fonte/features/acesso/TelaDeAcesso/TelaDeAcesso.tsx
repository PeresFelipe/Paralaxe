import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Checkbox, TextField } from '@/components/ui'
import { IconeDoJogo } from '@/components/jogo'
import CreditosDosRecursos from '@/components/jogo/CreditosDosRecursos'
import { LIMITE_DO_IDENTIFICADOR, normalizarIdentificador, type PreferenciasDeAcesso } from '@/services/acessoLocal'
import estilos from './TelaDeAcesso.module.css'

type PaginaDeAcesso = 'entrar' | 'cadastro' | 'recuperar'
interface Propriedades {
  preferencias: PreferenciasDeAcesso
  aoEntrarLocalmente: (identificador: string, lembrar: boolean) => void
  aoEsquecerUsuario: () => void
}

/** Formulários online são somente apresentação: nenhum segredo é coletado nesta etapa. */
export default function TelaDeAcesso({ preferencias, aoEntrarLocalmente, aoEsquecerUsuario }: Propriedades) {
  const [pagina, definirPagina] = useState<PaginaDeAcesso>('entrar')
  const [identificador, definirIdentificador] = useState(preferencias.identificador)
  const [lembrar, definirLembrar] = useState(preferencias.lembrar)
  const [erro, definirErro] = useState<string | null>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)
  const primeiroRender = useRef(true)
  useEffect(() => {
    if (primeiroRender.current) { primeiroRender.current = false; return }
    tituloRef.current?.focus()
  }, [pagina])
  const titulos = { entrar: 'Sua jornada continua.', cadastro: 'Um novo começo.', recuperar: 'Recupere seu caminho.' }
  function mudar(p: PaginaDeAcesso) { definirErro(null); definirPagina(p) }
  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nome = normalizarIdentificador(identificador)
    if (!nome) {
      definirErro('Informe seu usuário ou e-mail para continuar.')
      const campo = evento.currentTarget.elements.namedItem('identificador-local')
      if (campo instanceof HTMLInputElement) campo.focus()
      return
    }
    aoEntrarLocalmente(nome, lembrar)
  }
  return (
    <main className={estilos.pagina}>
      <a className={estilos.pular} href="#acesso-formulario">Ir para o acesso</a>
      <div className={estilos.moldura}>
        <section className={estilos.historia} aria-label="Bem-vindo a Paralaxe">
          <div className={estilos.cena} aria-hidden="true" />
          <div className={estilos.historiaConteudo}>
            <div className={estilos.assinatura}>
              <p className={estilos.marca}>PARALAXE</p>
              <p className={estilos.lema}>Um refúgio entre as sombras</p>
            </div>
            <div className={estilos.convite}>
              <span className={estilos.emblema} aria-hidden="true">
                <IconeDoJogo icone="elmo-barbuta" tamanho={36} />
              </span>
              <p className={estilos.categoria}>FANTASIA SOMBRIA · RPG IDLE</p>
              <p className={estilos.chamada}>Cada escolha<br />deixa um legado.</p>
              <p className={estilos.descricao}>Domine seus ofícios. Desbrave ruínas.<br />Reerga a Cidade Livre, no seu ritmo.</p>
            </div>
          </div>
        </section>
        <section className={estilos.acesso} aria-labelledby="acesso-titulo">
          <div className={estilos.painel}>
          <div className={estilos.conteudo} id="acesso-formulario" tabIndex={-1}>
            <p className={estilos.sobretitulo}>{pagina === 'entrar' ? 'ACESSO LOCAL' : pagina === 'cadastro' ? 'CRIAR USUÁRIO' : 'ESQUECI MINHA SENHA'}</p>
            <h1 id="acesso-titulo" ref={tituloRef} tabIndex={-1}>{pagina === 'entrar' ? 'Entrar' : titulos[pagina]}</h1>
            <p className={estilos.introducao}>{pagina === 'entrar' ? 'Continue sua jornada localmente.' : pagina === 'cadastro' ? 'Em breve, uma conta para acompanhar suas aventuras.' : 'O caminho de volta à sua conta, com tranquilidade.'}</p>
            {pagina === 'entrar' ? <>
              <form noValidate onSubmit={entrar} className={estilos.formulario}>
                <TextField label="Usuário ou e-mail" name="identificador-local" value={identificador} maxLength={LIMITE_DO_IDENTIFICADOR}
                  autoComplete="username" autoCapitalize="none" spellCheck={false} required
                  placeholder="seu.usuario ou voce@email.com" {...(erro ? { error: erro } : {})}
                  onChange={e => { definirIdentificador(e.target.value); definirErro(null) }} />
                <div className={estilos.opcoes}>
                  <Checkbox label="Lembrar usuário" checked={lembrar} onChange={e => { definirLembrar(e.target.checked); if (!e.target.checked) aoEsquecerUsuario() }} />
                </div>
                <Button type="submit" fullWidth size="lg" icon={<IconeDoJogo icone="livro-abrir" tamanho={20} />}>Entrar no jogo <span aria-hidden="true">→</span></Button>
              </form>
              <details className={estilos.avancado}>
                <summary>Opções de conta</summary>
                <div className={estilos.avancadoConteudo}>
                <TextField label="Senha" type="password" name="senha-online-indisponivel" disabled autoComplete="off" placeholder="Disponível com contas online" />
                  <div className={estilos.opcoesSecundarias}>
                  <Button variant="ghost" size="sm" onClick={() => mudar('recuperar')}>Esqueci a senha</Button>
                  </div>
                  <div className={estilos.divisor}><span>OUTRAS FORMAS DE ENTRAR</span></div>
              <Button variant="secondary" fullWidth size="lg" disabled aria-describedby="google-disponibilidade"><span className={estilos.google} aria-hidden="true">G</span> Continuar com Google</Button>
              <p id="google-disponibilidade" className={estilos.emBreve}>Em breve · contas online ainda não estão disponíveis.</p>
                  <p className={estilos.cadastrar}>Novo por aqui? <Button variant="ghost" size="sm" onClick={() => mudar('cadastro')}>Criar usuário</Button></p>
                </div>
              </details>
            </> : <>
              <div className={estilos.aviso} role="status"><IconeDoJogo icone="livro-abrir" tamanho={24} /><div><strong>Disponível em uma próxima etapa</strong><p>{pagina === 'cadastro' ? 'O cadastro online ainda não está habilitado. Você já pode jogar localmente sem criar uma conta.' : 'A recuperação por e-mail será habilitada com as contas online. O acesso local não usa senha.'}</p></div></div>
              <form className={estilos.formulario} onSubmit={e => e.preventDefault()}>
                {pagina === 'cadastro' ? <TextField label="Nome de usuário" disabled placeholder="Escolha seu nome" autoComplete="off" /> : null}
                <TextField label="E-mail" type="email" disabled placeholder="voce@email.com" autoComplete="off" />
                {pagina === 'cadastro' ? <><TextField label="Senha" type="password" disabled placeholder="Disponível com contas online" autoComplete="off" /><TextField label="Confirmar senha" type="password" disabled placeholder="Repita sua senha" autoComplete="off" /></> : null}
                <Button type="submit" fullWidth size="lg" disabled>{pagina === 'cadastro' ? 'Criar conta · em breve' : 'Enviar recuperação · em breve'}</Button>
              </form>
              <Button variant="secondary" fullWidth onClick={() => mudar('entrar')}>Voltar ao acesso local</Button>
            </>}
            {pagina === 'entrar' ? <p className={estilos.privacidade}>Sem senha. Seu progresso fica neste navegador.</p> : null}
          </div>
          <footer className={estilos.rodape}><CreditosDosRecursos /></footer>
          </div>
        </section>
      </div>
    </main>
  )
}
