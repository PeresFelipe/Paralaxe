# Acesso local e preparação de autenticação

## Escopo entregue

A entrada do Paralaxe passa pela tela de acesso antes da seleção/criação de personagens. O layout usa composição em duas áreas no desktop, cabeçalho compacto no celular, a fonte do projeto, tokens, controles existentes, a cena da Cidade Livre e o ornamento de Dark Ages UI já distribuído.

- **Entrar localmente**: usa um nome de entrada (usuário ou e-mail), sem exigir nem coletar senha.
- **Lembrar usuário**: consentimento desmarcado por padrão. Guarda apenas o identificador em `paralaxe.usuario-lembrado`. Desmarcar apaga essa preferência; a próxima visita pede nova entrada, sem login automático.
- **Criar usuário** e **Esqueci a senha**: telas completas, navegáveis e acessíveis, com aviso de indisponibilidade e campos/envio desabilitados.
- **Google**: botão desabilitado com explicação visível, sem SDK externo, pop-up, redirecionamento ou requisição.
- **Sair do acesso local**: disponível nas telas iniciais e no menu de opções da partida. Aguarda a fila de gravação, preserva os saves e respeita os bloqueios de risco/operação.
- Erro de armazenamento de preferência não impede jogar localmente.

## Limite de confiança

Este acesso é uma conveniência local, **não autenticação nem autorização**. O identificador não prova identidade, não cria conta, não isola personagens por usuário e não criptografa o IndexedDB. As partidas existentes continuam disponíveis no mesmo navegador/origem e não são movidas nem associadas a contas fictícias. Sair não apaga personagens, só encerra o estado de acesso em memória.

Nenhuma senha, token, cookie de sessão, hash de senha ou código de recuperação é gravado no cliente por esta entrega. Nenhum evento registra credenciais. O campo de senha está desabilitado. Não há e-mail enviado ou mensagem fingindo sucesso de cadastro/recuperação. Sem backend, não é possível oferecer proteção real de conta.

## Arquitetura

| Local | Responsabilidade |
| --- | --- |
| `features/acesso/TelaDeAcesso` | Apresentação e navegação entre entrada/cadastro/recuperação |
| `features/acesso/EntradaDoJogo.tsx` | Coordenação do acesso local em memória e montagem do jogo |
| `services/acessoLocal.ts` | Preferência com porta de armazenamento injetável e normalização de tamanho/caracteres de controle |
| `pacotes/interface/fonte/autenticacao.ts` | Contrato futuro de login por credencial, cadastro, recuperação, Google e saída |
| `criarAutenticacaoIndisponivel` | Implementação que rejeita explicitamente integrações ainda não habilitadas; não chama rede |
| `principal.tsx` | Ponto de composição do acesso e do repositório local |
| `useAplicativoDaPartida` | Saída coordenada com gravações e estado de risco |
| `components/ui/Checkbox` | Controle genérico acessível com rótulo associado e foco visível |

Estado e regras do RPG permanecem nos pacotes existentes. Não houve mudança do esquema 18, do nome físico `greywake` nem do formato histórico das partidas. O identificador do acesso não é enviado ao domínio nem inserido em um personagem.

## Integração online futura

A porta existe; habilitar uma integração exige implementar e injetar um adaptador real e conectar os formulários. Não basta remover `disabled`. Backend, banco de contas, endpoints, client ID Google, domínio de callback e entrega de e-mails não foram provisionados nesta etapa.

O contrato `ProvedorDeAutenticacao` recebe os dados de entrada somente para a operação correspondente. `ContaAutenticada` expõe metadados de conta, não um bearer token. O fluxo local deve continuar sendo distinguido de uma sessão autenticada.

### Requisitos para ativação posterior

1. **Servidor autoritativo**: TLS, validação de dados, política clara de unicidade/canonicalização de username e e-mail, autorização por conta no servidor. Não usar o identificador lembrado como prova de identidade ou dono de save.
2. **Senhas**: hashing de senha no servidor com algoritmo recomendado, por exemplo Argon2id, parâmetros revisados e salt individual; nunca criptografia reversível ou senha em texto. Aceitar gerenciadores de senha, permitir colar e adotar política atual de tamanho/força sem truncamento silencioso de senhas.
3. **Sessões**: preferir BFF e cookies `HttpOnly`, `Secure`, `SameSite` adequado ao fluxo; rotação após login, expiração e invalidação no logout. Não persistir tokens/JWT/refresh tokens em localStorage/sessionStorage.
4. **CSRF e abuso**: proteção de operações autenticadas, limitação de tentativas no servidor, respostas de login/recuperação que não enumerem contas; logs sem segredos, acompanhamento de abuso e controles proporcionais de recuperação.
5. **Recuperação**: resposta neutra, token aleatório de uso único, com expiração curta e hash no servidor, origem de link controlada, sem perguntas secretas. Invalidar o token após uso e tratar sessões existentes conforme política.
6. **Google**: OpenID Connect via fluxo suportado pela Google Identity, com SDK/biblioteca oficial ou adaptador confiável; validar emissor, audiência, expiração e nonce no servidor. Em Authorization Code, usar PKCE quando aplicável e proteção state/CSRF. Nunca incluir client secret no bundle; restringir redirect URIs e não aceitar open redirects.
7. **Vincular contas**: verificar propriedade e exigir fluxo explícito antes de unir login Google e conta por e-mail; não unir automaticamente só porque um texto de e-mail coincide.
8. **Deploy**: revisar CSP, frame-ancestors, HSTS, referrer policy, cache e política de origem no host/BFF. Não prometer esses cabeçalhos por existir um formulário frontend.
9. **Dados locais**: planejar importação/vinculação de saves separadamente, com consentimento e validação. O login futuro não pode transformar progressão local/debug em economia conectada confiável.

## Pesquisa de arte e créditos

Consulta em 08/11/2026 ao catálogo solicitado: https://itch.io/game-assets/tag-idle . A seleção considerou gratuidade, permissão comercial expressa, estilo e compatibilidade com o sistema existente.

| Recurso | Evidência na página do autor | Decisão |
| --- | --- | --- |
| Golden Forge Free Idle & Tycoon UI Sampler | Gratuito, uso pessoal/comercial e modificação permitidos; não redistribuir como outro pack | Avaliado; estética de botões coloridos não foi incorporada nesta tela |
| Medieval Style Game UI Panel — acmgame | Uso comercial permitido; somente botão grátis, conjunto completo pago e restrição de redistribuição | Não incorporado |
| Dark Ages UI — Hypnobius | Download nomeie seu preço; uso comercial e adaptação permitidos; licença já preservada no projeto | Reutilizado o recorte de ornamento dourado existente, mantendo créditos |

Fontes:
- https://goldenforgestudios.itch.io/golden-forge-free-idle-tycoon-ui-sampler
- https://acmgame.itch.io/medieval-style-game-ui-panel
- https://hypnobius.itch.io/dark-ages-ui

Não houve download/republicação de um pacote novo. A arte da cidade e os ícones já licenciados permanecem nos seus arquivos atuais. `catalogoDeCreditos.json` registra o novo uso do ornamento; os créditos também estão acessíveis na entrada.

## Referências de segurança

Consultadas as fontes primárias em 08/11/2026:
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html

Essas referências orientam as fronteiras e os requisitos futuros; a entrega não constitui auditoria ou certificação de segurança.

## Validação

Testes unitários cobrem lembrar/apagar identificador com consentimento, bloqueio de storage, normalização, escape de texto, checkbox e recusa das integrações online sem requisições. Navegador: entrada, validação e foco, telas secundárias, funções online desabilitadas, saída, recarga e preferência, ausência de requisições externas, falha de storage e larguras 320/390/768/1920 sem rolagem horizontal. A revisão visual usa capturas desktop e mobile.

Resultado desta entrega: `pnpm verificar` aprovado com **402 testes**, análise arquitetural, CSS Modules, lint, TypeScript e créditos; `pnpm compilar` aprovado. Em Chromium também foi conferida a criação de personagem, saída pelo menu e reentrada com preservação do save. Não foi feita auditoria de segurança independente nem teste formal com leitores de tela.
