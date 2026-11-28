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

### Navegação pública por sessão

O cabeçalho mantém os links institucionais e suas âncoras em desktop
e mobile. Enquanto a sessão é restaurada, as ações de conta ficam
indisponíveis. Visitantes veem **Entrar** e **Criar conta**. Pessoas
autenticadas veem **Minha conta**, **Sair da conta** e **Acessar meu
ambiente** quando há contexto ativo. O rodapé usa os mesmos destinos
de conta. O destino ativo segue a matriz da seção **Alternância e
política de acesso**, sem trocar o contexto durante a navegação.

As chamadas comerciais da Home levam visitantes a `/cadastro`.
Contas comuns seguem a `/cliente` para solicitar ou a `/prestador`
para oferecer serviços. A guarda solicita escolha explícita quando
o destino exige outro contexto. A administração exclusiva acessa
`/admin` e sua própria `/conta`, sem chamadas comerciais.

A página inicial, as páginas legais, as rotas de autenticação e os
demonstradores visuais permanecem públicos. `/dev/contas` existe
somente no modo de desenvolvimento. Os seis ambientes, a entrada
`/prestador` e a conta canônica usam guardas distintas conforme suas
exigências de contexto ou de identidade.

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

### Gerenciamento básico da própria conta

A rota canônica `/conta` usa a guarda compartilhada com uma exigência
de identidade autenticada, aplicável também à administração exclusiva.
Os cabeçalhos cliente e operacional oferecem **Minha conta**. As rotas
pessoais provisórias redirecionam para a rota canônica. As páginas de
perfil do prestador e o demonstrador operacional mantêm sua finalidade.

`src/services/manageAccount.ts` deriva a conta da sessão validada e
confere se ela corresponde à identidade conhecida pela interface.
A projeção contém nome, CPF, telefone, e-mail, finalidade inicial,
data de cadastro e contextos, sem credenciais ou tokens. A visualização
usa o contexto resolvido sem regravar a seleção da aba.

A gravação reutiliza a validação cadastral e o bloqueio das operações
de autenticação. No bloqueio do repositório, relê o registro e confere
a sessão imediatamente antes de gravar somente nome, telefone e
`updatedAt`. O formato de `muv.users.v1` permanece o mesmo. A aba que
salva atualiza o contexto de autenticação. As demais recebem o evento
da chave de usuários e mantêm seu próprio contexto ativo válido.

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

## Fundação e cadastro autônomo

O domínio `src/domain/autonomousProvider.ts` representa o cadastro
profissional e as modalidades `PESSOA` e `ENCOMENDA`. A chave
`muv.autonomousProviders.v1` armazena uma lista de registros com ID estável,
ID da conta, número normalizado da CNH, categoria, validade ISO de
calendário, declaração de EAR, modalidades e datas de criação e edição.
Nome, CPF, telefone, e-mail e credenciais permanecem na conta.

`src/services/autonomousProvider.ts` resolve o titular pela sessão,
revalida a conta antes de gravar e usa o bloqueio de mutações existente.
O repositório rejeita estruturas inválidas e duplicidades de ID, titular
ou CNH sem sobrescrever dados. A consulta apresenta erros de leitura.
O resolvedor de contextos combina o registro íntegro com atribuições
demonstrativas sem repetir o contexto e preserva a exclusividade
administrativa. A aba autora atualiza a sessão em memória. As outras
abas observam a chave profissional e revalidam a seleção local.

### Validação da habilitação

Valida-se o **número de registro**, com nove dígitos-base e dois
verificadores, conforme a estrutura indicada no art. 4º da
[Resolução CONTRAN 886/2021](https://gestaoconteudo.detran.sp.gov.br/wps/wcm/connect/27397fbf-c227-4ca7-b8d0-47e9f1165910/Resolucao8862021F.pdf).
A implementação local segue o algoritmo de módulo 11 do
[validate-docbr](https://github.com/alvarofpp/validate-docbr/blob/master/validate_docbr/CNH.py):
pesos 9 a 1 no primeiro dígito e 1 a 9 no segundo. Primeiro resto
10 resulta em zero e desconto de dois no segundo, calculado módulo 11.
Resto ajustado 10 resulta em zero. Sequências repetidas são rejeitadas.
A checagem matemática não comprova emissão, autenticidade ou titularidade.

O catálogo adotado inclui A a E e combinações AB, AC, AD e AE.
A data de validade deve ser real e pelo menos igual ao dia local no
momento de salvar. Uma expiração posterior mantém o contexto de
preparação. EAR exige Sim ou Não e é autodeclarada. A intenção exige
uma ou ambas as modalidades, sem regras cruzadas com categoria, EAR
ou veículo nesta etapa.

## Cadastro e contextos organizacionais

Empresa e cooperativa compartilham o mesmo domínio e formulário.
`muv.organizations.v1` contém duas coleções: organizações e associações
de responsabilidade. A organização conserva ID, tipo, CNPJ, razão
social, nome fantasia opcional, telefone e e-mail comerciais, endereço
cadastral (CEP, logradouro, número, complemento opcional, bairro,
município e UF), modalidades pretendidas e datas. A associação conserva
ID, organização, conta, papel de responsável e datas da declaração
e da criação. Ela é simulada.

O repositório grava as duas coleções juntas ao criar, valida unicidade
de CNPJ e IDs e exige exatamente uma associação por organização.
Uma leitura inconsistente bloqueia mutações e não gera contextos de
negócio. As operações usam o bloqueio de autenticação existente.
Isso reduz concorrência com Web Locks, mas a fila alternativa é local
à aba. LocalStorage não oferece transações entre chaves nem isolamento
de produção. Edições concorrentes dos mesmos campos seguem a última
gravação processada.

O CNPJ é persistido como texto, com zeros iniciais e letras maiúsculas.
A normalização aceita caracteres alfanuméricos, máscara e espaços.
São 12 caracteres alfanuméricos e dois verificadores numéricos.
O cálculo usa ASCII menos 48, pesos de 2 a 9 da direita para a
esquerda, repetidos, e módulo 11. Resto 0 ou 1 gera zero. Nos
demais casos, usa-se 11 menos o resto. A segunda rodada inclui o
primeiro dígito. Referência: [manual do CNPJ da Receita Federal, pp. 3–4](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf).
A validação é local e estrutural.

O resolvedor combina as fontes autônoma, organizacional e demonstrativa
pela chave de contexto existente, com administração exclusiva.
Nome fantasia ou razão social identificam o contexto em memória.
CNPJ distingue organizações homônimas de mesmo tipo. Contextos
demonstrativos conservam o identificador quando faltam registros.
A seleção persistida continua usando tipo e ID. A aba autora atualiza
a sessão local, e outras abas reagem à chave organizacional.

Criação usa a sessão da conta comum. Consulta e edição exigem a
associação e a política de capacidade, tipo e ID do contexto ativo.
CNPJ, tipo, responsável e data de criação são preservados na edição.
O endereço cadastral e as modalidades pretendidas são dados do
cadastro. Regiões, autorizações e elegibilidade pertencem aos seus
respectivos módulos.

## Regiões de atendimento

`ProviderReference` identifica o autônomo pelo ID profissional e a
empresa ou cooperativa pelo tipo e ID organizacional. O serviço resolve
a conta pela sessão e usa o contexto ativo para identificar a atuação.
Confere a capacidade na política centralizada e valida titularidade
ou associação de responsabilidade no cadastro persistido. Uma atribuição
demonstrativa de prestador permite navegação, mas o gerenciamento exige
o respectivo registro de negócio. A identidade da conta serve para
autenticação e para detectar mudanças de escopo em operações pendentes.

`muv.serviceRegions.v1` armazena apenas a referência do prestador, a
modalidade, o código IBGE e a data da inclusão. A combinação dos três
primeiros campos é única. A ausência da chave equivale a uma coleção
vazia. O repositório valida toda a coleção e impede sobrescrita quando
encontra estrutura inválida, duplicata ou código desconhecido. Nenhuma
cobertura é derivada do endereço cadastral. O serviço confere a intenção
vigente dentro de `withAuthMutation` e revalida o escopo antes da escrita.
Coberturas de modalidades fora da intenção permanecem visíveis para
consulta, com as ações de edição indisponíveis.

A página observa eventos de `storage` da chave territorial. A aba
autora reconsulta após a mutação. O contexto ativo continua no
`sessionStorage`, independente por aba. A sincronização de sessão e
cadastros continua a cargo do `AuthProvider`. As gravações usam
uma chave única, com leitura e escrita serializadas entre abas quando
há Web Locks. A fila alternativa serializa apenas na própria aba.
LocalStorage não oferece transações entre chaves e sessões sucessivas
da mesma conta continuam indistinguíveis pela chave da sessão.

### Catálogo municipal

Fonte: [DTB 2025 do IBGE](https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2025/),
planilha `RELATORIO_DTB_BRASIL_2025_MUNICIPIOS.ods` do arquivo
`DTB_2025.zip`, data-base 31/12/2025, obtida em 28/11/2026.
São 5.571 entradas das 27 UFs, incluindo Brasília/DF (5300108) e
Fernando de Noronha/PE (2605459) como unidades equiparadas, e Boa Esperança
do Norte/MT (5101837). A contagem corresponde à planilha e é corroborada
pela [publicação de áreas territoriais do IBGE](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/15761-areasdos-munivipios.html),
com 5.569 municípios e duas unidades equiparadas. A Malha Municipal é
outro produto e inclui áreas operacionais que não pertencem à planilha
da DTB. Os dados são públicos e a atribuição da fonte ao IBGE é preservada.

Para reproduzir o artefato, baixar o ZIP oficial para fora do repositório
e executar `python3 scripts/generate-municipalities.py /tmp/DTB_2025.zip --retrieved 2026-11-28`.
O gerador usa a biblioteca padrão, lê as colunas municipais da planilha,
confere total, códigos, prefixos por UF, nomes e registros de referência
e produz o JSON local em ordem de código, com os metadados e SHA-256
da entrada. Para uma nova edição, conferir as alterações oficiais, adaptar
os parâmetros validados pelo gerador, revisar códigos descontinuados e a
compatibilidade com coberturas persistidas antes de substituir o artefato.

O catálogo é distribuído no chunk da página de regiões, carregado sob
demanda. LocalStorage guarda somente os códigos selecionados.

## Autorizações administrativas por modalidade

`muv.providerAuthorizations.v1` é a coleção de tentativas e decisões.
Cada tentativa usa `ProviderReference`, modalidade individual, ID
próprio, número sequencial no par, data de envio, identificação
projetada de quem solicitou e o retrato submetido. Uma decisão ausente
representa pendência. Uma decisão persistida é aprovada ou rejeitada
e encerra a tentativa. A ausência de tentativas no par representa
Não solicitada. O repositório valida a coleção integralmente e ordena
por data de envio, sequência e ID. O reenvio preserva a tentativa
rejeitada e recebe nova sequência e novo ID.

O retrato inclui campos profissionais e pessoais pertinentes ou
campos comerciais, endereço cadastral e nome do responsável. Os
municípios incluem nome, código, UF e edição do catálogo. A projeção
exclui credenciais, dados internos de autenticação e tokens. O
histórico territorial é legível independentemente de catálogos
posteriores. A lista administrativa recebe somente a identificação
de apresentação e os campos necessários aos filtros.

A solicitação verifica cadastro, intenção, cobertura e vigência
da CNH do autônomo. A aprovação revalida as mesmas condições e
compara as projeções submetida e atual. A ordem dos mesmos municípios
é irrelevante. O diálogo registra ciência da versão normalizada
exibida. O serviço recalcula essa versão sob o bloqueio e rejeita
confirmações desatualizadas. O ato guarda os dados atuais reconhecidos
quando houve diferenças e preserva o retrato original. A rejeição
exige justificativa e continua disponível quando existem impedimentos
objetivos à aprovação. Ambas as decisões exigem a administração
exclusiva e gravam o identificador e nome histórico do administrador.

A edição cadastral consulta a coleção apenas ao retirar uma modalidade
da intenção e bloqueia a retirada se a tentativa estiver pendente.
Edições ou remoções territoriais preservam o histórico, inclusive
quando a cobertura fica vazia. Depois da aprovação, mudança de
intenção ou vencimento da CNH preserva a decisão registrada.

As mutações de cadastro, território e autorização usam
`withAuthMutation`. As telas observam alterações de armazenamento
pertinentes e reconsultam imediatamente na aba autora. Sessão e
contexto seguem a DEC-040. Sem Web Locks, a fila coordena somente
a própria aba. LocalStorage carece de transações entre chaves,
e a identidade da sessão é limitada ao ID da conta. As verificações
são demonstrativas. Garantias definitivas dependem do backend.

A navegação carrega as páginas de autorização sob demanda. A lista
administrativa e a proteção da intenção cadastral podem ler a coleção
sem carregar o catálogo municipal. O detalhe e o envio consultam
a cobertura atual usando o catálogo local.

## Identidade profissional do motorista

`muv.driverProfessionals.v1` reúne `professionals`,
`autonomousRegistrations` e a assinatura diagnóstica do legado. O
profissional tem ID estável, ID de conta existente, CNH normalizada,
categoria, validade, EAR autodeclarada e datas. Nome, CPF, telefone
e e-mail vêm da conta. O registro autônomo conserva seu próprio ID,
`userId`, modalidades e datas e referencia a identidade por
`professionalId`. O repositório valida titularidade da referência,
contas existentes, datas, categorias, unicidade da conta e da CNH,
IDs e modalidades na coleção integral. Vigência é avaliada em
criação, atualização e operações que a exigem. Uma CNH vencida
continua legível e preserva o contexto de preparação.

`autonomousProviderRepository` mantém `findById`, `findByUserId`,
`findByCnh` e `save`. As leituras projetam os dados de habilitação
a partir da identidade. `findByCnh` recebe o número normalizado e
retorna somente a atuação autônoma quando existir. A unicidade
consulta toda a coleção profissional, inclusive perfis sem atuação
autônoma. Regiões e autorizações continuam referenciando o ID
autônomo. Envio e análise consultam os dados atuais compartilhados,
e os retratos históricos e decisões persistidos conservam seus dados.

A leitura sem chave nova valida e projeta `muv.autonomousProviders.v1`
em memória. O legado é um array de cadastros autônomos com dados de
habilitação, titularidade, modalidades e datas. A projeção deriva
o ID profissional legado do ID autônomo, com prefixo `legacy:`.
A entrada no perfil solicita transição quando houver chave legada.
A primeira gravação de perfil ou cadastro autônomo também pode
transicionar e gravar a mutação no mesmo ato. A seção serializada
relê a origem e a presença da chave ativa. Uma única escrita
publica a coleção integral. Após publicação, o legado serve como
origem histórica e diagnóstico. A coleção ativa inválida gera erro
e impede gravações. A chave antiga permanece intacta.

O aplicativo novo compara a assinatura da origem ao abrir as telas
profissionais e sinaliza alterações posteriores. A assinatura é
diagnóstica e pode ter colisões. Abas em versões antigas devem ser
fechadas ou recarregadas antes da transição. Essas versões ainda
podem escrever no legado, mesmo usando Web Locks. A mudança fica
fora da fonte ativa, sem reconciliação automática. Sem Web Locks,
a serialização atual continua restrita à aba. LocalStorage não
oferece transação entre chaves e a sessão continua identificada
somente pelo ID da conta.

Em falha, feche abas antigas, preserve as duas chaves e tente
novamente após verificar a disponibilidade do armazenamento. Se
houver inconsistência, suspenda a edição e examine os registros
em sessão isolada, usando somente dados fictícios. Uma recuperação
manual deve conferir IDs, contas, unicidade e referências e
preservar as alterações da fonte ativa antes de qualquer reparo.
Evite excluir a chave ativa para retentar a transição, pois a
ausência da chave representa primeira inicialização e o legado
pode estar desatualizado. A aplicação não restaura automaticamente
uma coleção ativa inválida nem exporta material de autenticação.

As interfaces enviam a revisão dos dados aberta no formulário.
Os serviços comparam a versão sob bloqueio e verificam a sessão
antes de gravar. `AuthProvider` observa as duas chaves para
revalidar as telas e os contextos, preservando a seleção por aba.
A página de perfil é carregada sob demanda. A integração
profissional não precisa carregar o catálogo municipal.
