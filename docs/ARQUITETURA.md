# Arquitetura do Protótipo MUV

## 1. Objetivo

Estabelecer a organização técnica do protótipo navegável do MUV, garantindo modularidade, reutilização, manutenção, rastreabilidade e preparação para futura integração com um backend real.

## 2. Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Context API
- LocalStorage
- ESLint
- Git

## 3. Diretrizes arquiteturais

- Separação de responsabilidades.
- Reutilização de componentes.
- Centralização das regras de negócio.
- Tipagem explícita das entidades.
- Persistência simulada independente da interface.
- Controle de acesso por perfil.
- Desenvolvimento incremental.
- Rastreabilidade entre requisitos e implementação.
- Preparação para integração futura com Spring Boot e PostgreSQL.

## 4. Organização dos diretórios

| Diretório | Responsabilidade |
|---|---|
| assets | Recursos visuais e identidade da marca. |
| components/ui | Componentes básicos reutilizáveis. |
| components/common | Componentes compartilhados entre módulos. |
| components/forms | Componentes especializados em formulários. |
| components/feedback | Alertas, modais e mensagens. |
| layouts | Estruturas de navegação por perfil. |
| pages | Páginas associadas às rotas. |
| routes | Configuração de rotas e controle de acesso. |
| contexts | Estados compartilhados da aplicação. |
| hooks | Comportamentos reutilizáveis do React. |
| domain | Entidades e regras de negócio. |
| services | Casos de uso e operações da aplicação. |
| repositories | Contratos e implementações de persistência. |
| mocks | Dados fictícios para demonstração. |
| types | Tipos compartilhados. |
| constants | Constantes e configurações. |
| utils | Funções auxiliares. |
| styles | Tokens e configurações visuais. |

Os diretórios serão criados progressivamente, conforme a necessidade de implementação.

## 5. Fluxo de responsabilidades

Interface → Serviço → Domínio → Repositório → Persistência simulada.

As páginas deverão solicitar operações aos serviços responsáveis, evitando implementar diretamente regras de negócio complexas.

Os serviços deverão coordenar os casos de uso e utilizar as regras definidas no domínio e os contratos dos repositórios.

Os repositórios serão responsáveis pelo acesso e armazenamento dos dados.

## 6. Persistência simulada

O protótipo utilizará LocalStorage para preservar dados entre sessões do navegador.

A persistência deverá contemplar progressivamente:

- Usuários e perfis.
- Prestadores.
- Autorizações.
- Motoristas e vínculos.
- Veículos.
- Tarifas.
- Solicitações.
- Propostas.
- Fretes.
- Designações.
- Alterações de acordo.
- Ocorrências.
- Notificações.
- Histórico.
- Contestações.
- Achados e perdidos.
- Avaliações.

Os dados utilizados serão fictícios.

O LocalStorage não representa uma solução segura de autenticação ou armazenamento de informações pessoais reais.

## 7. Padrões arquiteturais

### Repository

Isolar as operações de acesso e persistência dos dados, facilitando a substituição do armazenamento local por uma API.

### State

Centralizar as regras de transição entre os estados dos fretes e impedir operações incompatíveis com o estado atual.

### Observer

Permitir que eventos relevantes produzam notificações e registros históricos.

### Strategy

Representar comportamentos distintos conforme a modalidade de frete, especialmente nas validações e nos procedimentos de conclusão.

A aplicação concreta desses padrões será definida conforme a implementação de cada módulo, respeitando a arquitetura documentada do MUV.

## 8. Gerenciamento de estados

A Context API será utilizada para estados compartilhados que necessitem ser acessados por diferentes partes da aplicação.

Estados específicos de formulários e componentes deverão permanecer locais sempre que possível.

O contexto não deverá concentrar todas as regras de negócio do sistema.

## 9. Rotas e permissões

A aplicação será organizada nos seguintes ambientes:

- Público.
- Autenticação.
- Cliente.
- Prestador.
- Motorista vinculado.
- Administrador.

As permissões deverão considerar o usuário autenticado, o perfil ativo, os vínculos, as autorizações e a responsabilidade pelo registro consultado.

A proteção de rotas no frontend terá finalidade demonstrativa. A futura API deverá realizar suas próprias verificações de autenticação e autorização.

## 10. Convenções de desenvolvimento

- Nomes de arquivos e diretórios em inglês.
- Interfaces e documentação em português.
- Componentes React em PascalCase.
- Funções e variáveis em camelCase.
- Componentes React utilizando a extensão .tsx.
- Arquivos TypeScript sem JSX utilizando a extensão .ts.
- Mensagens de commit seguindo Conventional Commits.
- Regras de negócio centralizadas.
- Evitar duplicação de código.
- Não adicionar dependências sem necessidade identificada.

## 11. Estratégia de validação

Cada incremento deverá ser submetido a:

1. Teste funcional no navegador.
2. Verificação da navegação.
3. Verificação das regras de negócio relacionadas.
4. Compilação com npm run build.
5. Verificação com npm run lint.
6. Atualização da documentação.
7. Registro das alterações no Git.

## 12. Integração futura

O protótipo não realizará comunicação com um backend real nesta etapa.

A organização das camadas deverá facilitar a futura integração com:

- API REST.
- Spring Boot.
- PostgreSQL.
- Autenticação real.
- Autorização no servidor.
- Persistência em banco de dados.
- Validação de regras de negócio no backend.

A migração exigirá implementação e validação específicas no servidor, não apenas a substituição do LocalStorage.

## 13. Situação atual

A configuração inicial do ambiente foi concluída.

As páginas temporárias foram separadas do componente principal e as rotas foram centralizadas.

A arquitetura será implementada incrementalmente, sem criar camadas vazias ou antecipar funcionalidades desnecessárias.

## Layouts compartilhados

Os layouts são responsáveis pela estrutura
visual compartilhada entre páginas.

Utilizam rotas aninhadas do React Router
e o componente Outlet para renderização
do conteúdo correspondente.

### PublicLayout

Responsável pelas interfaces públicas
e institucionais do MUV.

Componentes associados:

- PublicHeader.
- PublicFooter.
- MobileMenu.

Características:

- Navegação responsiva.
- Reutilização do Design System.
- Navegação por links e âncoras.
- Separação entre estrutura e conteúdo.
- Suporte à navegação por teclado.

### Rotas de desenvolvimento

- /dev/environment
- /dev/design-system
- /teste

As rotas de desenvolvimento não utilizam
o layout público.

As rotas públicas ficam fora das guardas dos ambientes autenticados.

## Layout público

O PublicLayout é responsável pela estrutura
compartilhada das páginas públicas do MUV.

### Componentes

- PublicHeader.
- PublicFooter.
- MobileMenu.

### Características

- Rotas aninhadas do React Router.
- Renderização de conteúdo com Outlet.
- Cabeçalho persistente durante a rolagem.
- Navegação responsiva.
- Navegação institucional por âncoras.
- Reutilização dos componentes do Design System.

### Rotas públicas

- /
- /termos-de-uso
- /privacidade

### Rotas de desenvolvimento

- /dev/environment
- /dev/design-system
- /teste

As rotas de desenvolvimento permanecem
independentes do layout público.

### Página institucional (T01)

A rota `/` renderiza `HomePage` no `PublicLayout`, com cabeçalho e
rodapé compartilhados. Os links institucionais usam âncoras com caminho
absoluto. O layout público posiciona a seção e transfere o foco ao
destino, inclusive ao navegar a partir de uma página legal.

As chamadas da T01 apontam para `/cadastro`. Os cinco passos e o
exemplo ilustrativo descrevem a solicitação exclusivamente direcionada
da DEC-038. A FAQ usa `details` e `summary` nativos.

## Layout de autenticação

O `AuthLayout` é implementado como um grupo de rotas independente do
`PublicLayout`. Usa `Outlet` para renderizar `LoginPage` em `/login` e
`RegisterPage` em `/cadastro`, `ForgotPasswordPage` em
`/recuperar-senha` e `ResetPasswordPage` em `/redefinir-senha`.

O layout reutiliza o logotipo e os tokens do Design System. O cabeçalho
oferece retorno ao site, o rodapé aponta para termos e privacidade, e o
painel institucional aparece na composição de duas colunas. O atalho
para o conteúdo, o foco no elemento principal e o retorno da rolagem ao
topo apoiam a navegação entre as duas rotas.

A página de login reutiliza `Card`, `Input`, `Button` e `Alert`.
A página de cadastro também usa `RadioGroup` e `Checkbox`. A
proteção de rotas permanece pendente.

### Fundação do cadastro

- `src/domain/userRegistration.ts` define a entidade básica e valida
  os dados pessoais e as escolhas do cadastro. CPF e telefone são
  armazenados como dígitos e o e-mail é normalizado para minúsculas.
- `src/services/registerUser.ts` valida novamente os dados, verifica
  unicidade, gera UUID, deriva a credencial, registra as datas e
  persiste. A interface recebe apenas o identificador em caso de
  sucesso ou um resultado de erro.
- `src/repositories/userRepository.ts` isola a criação e as consultas
  por identificador, CPF e e-mail. A chave `muv.users.v1` contém uma
  lista JSON de usuários. Cada registro guarda os dados normalizados,
  credencial derivada, finalidade inicial e datas de aceite, criação e
  atualização. Falhas de acesso ou dados inválidos impedem a gravação
  e preservam o conteúdo anterior. A gravação relê a lista e verifica
  a unicidade. Web Locks serializa gravações entre abas quando
  disponível. Sem Web Locks, a gravação é síncrona e a concorrência
  entre abas depende do navegador.

A derivação usa Web Crypto com PBKDF2, SHA-256, 600 mil iterações,
salt individual de 16 bytes e saída de 32 bytes. Salt e chave derivada
são codificados em hexadecimal. O registro inclui os parâmetros
necessários à futura verificação. Senha em texto puro e confirmação
ficam fora da persistência. O cadastro requer contexto seguro, como
HTTPS ou localhost. LocalStorage é demonstrativo, manipulável e
inadequado para credenciais reais ou segurança de produção.

### Login e sessão demonstrativa

`src/services/passwordCredential.ts` compartilha a derivação entre
cadastro e login. A verificação reaplica o algoritmo, o hash, as
iterações e o salt do registro. O formato de `muv.users.v1` é preservado.

`src/services/authSession.ts` normaliza o e-mail, consulta o
repositório de usuários e verifica a credencial. O sucesso depende
da gravação da sessão. Credenciais incorretas recebem uma mensagem
genérica. Falhas de armazenamento ou de criptografia são distintas.

`src/repositories/sessionRepository.ts` mantém a chave
`muv.session.v1` com apenas `userId`. Na inicialização, o serviço
consulta o usuário correspondente. Uma referência ausente, um
registro inválido ou uma falha de leitura resulta em estado sem
sessão, preservando a base de usuários.

O `AuthProvider` em `App.tsx` distribui o estado de inicialização,
a identidade resumida (ID e nome) e as ações de login e logout.
O `ClientHeader` usa o nome e as iniciais da conta. O logout remove
somente a chave de sessão, atualiza o contexto e navega para `/login`.
Se a remoção falhar, a interface mantém a sessão e oferece nova
tentativa. Sem sessão, o ambiente cliente continua demonstrativo.

O armazenamento é manipulável e oferece apenas uma simulação.
As abas compartilham a chave persistida e revalidam a autenticação
ao receber eventos de armazenamento da sessão, usuários e atribuições.
A última gravação da sessão prevalece. As guardas usam a sessão e o contexto ativo para controlar a
navegação demonstrativa. Permissões de operações de negócio seguem
pendentes.

### Recuperação e redefinição demonstrativas

O domínio define a validade de 15 minutos e os estados ativo,
utilizado e invalidado. O serviço normaliza o e-mail, consulta a
conta, gera 32 bytes aleatórios com Web Crypto e persiste somente o
resumo SHA-256 do token em `muv.passwordRecovery.v1`. Cada registro
contém ID, ID da conta, resumo, criação, expiração e estado. Um novo
pedido invalida os registros ativos apenas da conta correspondente.

A mensagem principal é genérica. Para uma conta existente, a área
**Simulação de recebimento de e-mail** exibe um link com o token no
fragmento da URL. O fragmento pode ficar no histórico local e a
simulação revela a existência da conta. O protótipo não envia e-mails.

A redefinição reutiliza a validação de senha e a derivação PBKDF2. Sob
o mesmo bloqueio, o serviço revalida e consome o token, encerra a
sessão persistida somente se ela pertencer à conta e grava a credencial
e a data de atualização. O contexto da aba ativa volta a consultar
a sessão. O login verifica novamente a credencial sob o bloqueio
antes de gravar sua sessão, para evitar aceitar uma verificação feita
antes da redefinição.

LocalStorage não oferece transações entre as três chaves. Se a
gravação inicial do token falhar, a sessão e a credencial ficam
intactas. Se a remoção de sessão ou a gravação da credencial falhar
depois, o token permanece consumido, a senha anterior fica válida e
a sessão pode ter sido encerrada. A interface informa falha e pede
um novo link. Web Locks coordena operações entre abas quando
disponível. Sem Web Locks, a fila local serializa apenas a aba
corrente. A remoção da sessão persistida é refletida nas outras abas
pelo evento de armazenamento.

Os dados são manipuláveis pelo navegador e servem exclusivamente à
demonstração. É necessário um contexto seguro para Web Crypto.

### Contas e contextos de atuação

`src/domain/accountAccess.ts` modela os contextos cliente, autônomo,
empresa, cooperativa, motorista vinculado e administração. Empresa e
cooperativa carregam o ID da organização. Motorista vinculado carrega
o ID do vínculo. As capacidades desta entrega identificam somente o
ambiente correspondente ao contexto ativo.

`src/repositories/accessAssignmentRepository.ts` lê a lista de
atribuições em `muv.accessAssignments.v1` no LocalStorage. Cada entrada
contém `userId` e `context`. O contexto contém `kind` e, quando
aplicável, `organizationId` ou `linkId`. Registros inválidos ou
duplicados da conta não concedem capacidades adicionais. Uma
atribuição administrativa válida e exclusiva habilita somente o
contexto administrativo. Atribuições administrativas conflitantes
bloqueiam a resolução de contextos daquela conta.

`src/services/accountAccess.ts` deriva cliente para contas comuns
novas ou legadas, sem alterar `muv.users.v1`. A finalidade inicial
permanece apenas informativa. O repositório de seleção guarda
`{ userId, contextKey }` em `muv.activeContext.v1` no sessionStorage.
A restauração revalida a conta e a seleção. A ausência ou falha
de leitura da seleção usa o contexto padrão permitido. Se o
sessionStorage estiver indisponível, a resolução fica em memória.

O `AuthProvider` compartilha identidade resumida, contextos,
capacidade ativa e inicialização. O login explícito começa no
contexto cliente ou administrativo exclusivo. O evento `storage`
revalida a sessão a partir do valor atual, sem replicar a seleção
da aba. O logout usa o bloqueio de autenticação e confere o ID da
conta antes de remover a sessão. A chave persistida continua
`muv.session.v1` com apenas `{ userId }`.

LocalStorage é manipulável. Sem Web Locks, as abas podem disputar
gravações e a fila serializa apenas uma aba. A sessão identifica
a conta, mas não diferencia duas sessões consecutivas do mesmo
usuário. A interface de provisionamento fica restrita ao modo de
desenvolvimento.

### Alternância e política de acesso

`src/domain/accessPolicy.ts` avalia identidade, contexto disponível,
contexto ativo, capacidade e escopo opcional por ID de organização
ou vínculo. A troca passa pelo serviço de autenticação, que confirma
a conta sob o bloqueio compartilhado e revalida as atribuições antes
de gravar o contexto no sessionStorage da aba. Os cabeçalhos do
cliente e operacionais oferecem seleção explícita e logout.

| Contexto | Capacidade | Ambiente |
|---|---|---|
| Cliente | `accessClient` | `/cliente` |
| Autônomo | `accessAutonomous` | `/prestador/autonomo` |
| Empresa | `accessCompany` | `/prestador/empresa` |
| Cooperativa | `accessCooperative` | `/prestador/cooperativa` |
| Motorista vinculado | `accessLinkedDriver` | `/motorista` |
| Administração | `accessAdmin` | `/admin` |

`AccessGuard` usa essa política nos ramos que correspondem às
rotas válidas. Exibe carregamento durante a inicialização. Depois,
encaminha visitantes a `/login`, oferece troca explícita quando
houver contexto disponível ou renderiza o 403 no endereço solicitado.
O login aceita somente destinos internos entre as rotas protegidas
conhecidas e executa a guarda novamente. A rota curinga continua
tratando endereços inexistentes como 404. O 403 é visual na SPA.

A rota `/prestador` apresenta contextos profissionais disponíveis às
contas comuns. Sem contexto, oferece orientação sobre cadastro futuro.
Páginas institucionais, legais, autenticação e demonstradores existentes
continuam públicas. O provisionamento `/dev/contas` só existe no servidor
de desenvolvimento e usa identificadores reservados, validação de
colisões e credenciais sintéticas derivadas no navegador. Reexecutar
preserva usuários e sessões. As gravações de conta e atribuição usam
chaves distintas, portanto uma falha parcial pode exigir nova tentativa.

Para validar os ambientes, execute `npm run dev`, abra `/dev/contas`
e selecione **Provisionar contas demonstrativas**. Em `/login`, use
um dos endereços abaixo com a senha inicial fictícia `MuvDemo2026`.
A página também informa colisões ou falhas por conta. Uma senha já
alterada pelo fluxo de recuperação é preservada.

| Conta | E-mail demonstrativo |
|---|---|
| Cliente | `cliente@demo.muv.invalid` |
| Autônomo | `autonomo@demo.muv.invalid` |
| Empresa | `empresa@demo.muv.invalid` |
| Cooperativa | `cooperativa@demo.muv.invalid` |
| Motorista | `motorista@demo.muv.invalid` |
| Multiperfil | `multiperfil@demo.muv.invalid` |
| Multiorganização | `multiorganizacao@demo.muv.invalid` |
| Administração exclusiva | `admin@demo.muv.invalid` |

Os ambientes de empresa, cooperativa e motorista representam a
atuação ativa. Os módulos ainda não carregam registros de organização
ou vínculo. Serviços futuros poderão exigir escopo específico na
mesma política. A validação de escopo isolada não equivale à proteção
de dados de negócio nem a autorização por modalidade ou prontidão.

## Layout do cliente

O ClientLayout é responsável pela estrutura
compartilhada das interfaces do cliente.

### Componentes

- ClientHeader.
- ClientLayout.
- ClientPlaceholderPage.

### Características

- Navegação horizontal em desktop.
- Navegação recolhível em telas menores.
- Identificação visual da rota ativa.
- Menu da conta.
- Acesso às notificações.
- Acesso ao processo de autorização como prestador.
- Renderização de páginas através de Outlet.
- Reutilização do Design System.

### Rotas

- /cliente
- /cliente/solicitar-frete
- /cliente/prestadores
- /cliente/solicitacoes
- /cliente/fretes
- /cliente/historico
- /cliente/notificacoes
- /cliente/conta
- /cliente/seja-prestador

### Limitações temporárias

As páginas possuem conteúdos provisórios.

O cabeçalho identifica a conta autenticada, informa o contexto
cliente quando aplicável e oferece logout. Sem sessão, a guarda exibe a
página de login antes de acessar as rotas protegidas. O conteúdo de
frete permanece provisório.

## Layout operacional compartilhado

O OperationalLayout é responsável pela estrutura
visual compartilhada dos ambientes operacionais
do MUV.

### Componentes

- OperationalHeader.
- Sidebar.
- SidebarItem.
- OperationalLayout.

### Características

- Cabeçalho superior persistente.
- Navegação lateral configurável.
- Identificação do perfil ativo.
- Identificação visual da rota ativa.
- Renderização de conteúdo através de Outlet.
- Navegação responsiva.
- Barra lateral sobreposta em dispositivos móveis.
- Utilização de diálogo nativo para navegação mobile.
- Reutilização dos tokens do Design System.

### Ambientes previstos

- Prestador autônomo.
- Empresa.
- Cooperativa.
- Motorista vinculado.
- Administrador.

A estrutura visual é compartilhada, mas os itens
de navegação e as permissões serão definidos
conforme o perfil ativo.

### Rotas de desenvolvimento

- /dev/operational-layout
- /dev/operational-layout/fretes
- /dev/operational-layout/conta
- /dev/operational-layout/notificacoes

### Limitações temporárias

Os dados de identificação são fictícios.

Os menus definitivos de cada perfil serão
configurados posteriormente.

A autenticação e as guardas estão integradas aos ambientes.
Permissões de operações de negócio seguem pendentes.

## Navegação operacional por perfil

Os ambientes operacionais reutilizam o OperationalLayout,
o OperationalHeader, o Sidebar e o SidebarItem.

O ProfileOperationalLayout é responsável pela integração
das configurações específicas de cada ambiente operacional.

### Ambientes

- Prestador autônomo.
- Empresa.
- Cooperativa.
- Motorista vinculado.
- Administrador.

### Responsividade

Em desktop, a barra lateral apresenta três regiões:

- Identificação persistente do perfil.
- Navegação principal com rolagem independente.
- Navegação secundária persistente.

Em telas menores, a navegação utiliza um diálogo
modal nativo com barra lateral recolhível.

O cabeçalho interno do diálogo permanece visível
durante a rolagem.

### Reutilização

Os ambientes operacionais compartilham a mesma
estrutura visual, diferenciando-se pelos itens
de navegação e pela identificação do perfil.

Empresas e cooperativas reutilizam a estrutura
funcional dos prestadores organizacionais.

### Limitações temporárias

Os dados de identificação são fictícios.

As páginas apresentam conteúdos provisórios.

A guarda separada controla a entrada. Os cabeçalhos autenticados
apresentam a conta e o contexto ativo. Os demonstradores preservam
seus próprios dados fictícios. Permissões operacionais serão
integradas nos módulos correspondentes.

## Rota inexistente

O `AppRoutes` usa uma rota curinga global (`*`) para renderizar a
`NotFoundPage` quando nenhuma rota válida corresponde ao endereço.
O fallback também cobre subrotas desconhecidas, preserva a URL
solicitada e oferece um link para `/`.

A página tem estrutura própria, independente dos layouts de perfil e de
sessão. O tratamento acontece no React Router. No preview da SPA, o
servidor entrega o documento inicial com HTTP 200. O tratamento de
acesso negado (403) permanece previsto separadamente.

## Modelo de solicitação planejado

A DEC-038 estabelece que cada solicitação encaminhada tem um único
prestador, selecionado pelo cliente após a pesquisa de compatibilidade.
O cálculo usa as tarifas do destinatário. A resposta do prestador e a
decisão final do cliente pertencem à mesma solicitação. A confirmação
gera o frete, e empresas e cooperativas designam os recursos depois.

Uma recusa encerra o registro. O reaproveitamento dos dados cria uma
nova solicitação direcionada e preserva o registro anterior. O domínio
deverá impedir negociações simultâneas para a mesma necessidade. O
critério técnico de identificação permanece pendente. As páginas
atuais continuam provisórias.
