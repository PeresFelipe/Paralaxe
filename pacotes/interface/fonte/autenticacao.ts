/** Porta futura de conta online; acesso local não é uma sessão autenticada. */
export interface CredenciaisDeEntrada { identificador: string; senha: string }
export interface CadastroDeConta { usuario: string; email: string; senha: string }
/** O identificador de conta não é um bearer token nem concede autorização por si só. */
export interface ContaAutenticada { id: string; nome: string }
export interface ProvedorDeAutenticacao {
  entrar(credenciais: CredenciaisDeEntrada): Promise<ContaAutenticada>
  cadastrar(cadastro: CadastroDeConta): Promise<void>
  recuperarSenha(email: string): Promise<void>
  entrarComGoogle(): Promise<ContaAutenticada>
  sair(): Promise<void>
}
