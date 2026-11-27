# Progresso

## Etapas registradas

| Etapa | Situação | Entrega |
|---|---|---|
| 00 | Concluída | Análise inicial, decisões e inventário |
| 01 | Concluída | Configuração inicial |
| 02 | Concluída | Arquitetura inicial |
| 03–04 | Concluídas | Identidade visual e Design System |
| 05.1–05.6 | Concluídas | Componentes compartilhados |
| 06.1–06.6 | Concluídas | Layouts, navegação e página 404 |
| 07 | Concluída | Página institucional |
| 08.1–08.4 | Concluídas e sincronizadas | Cadastro, login, sessão, logout e recuperação |
| 09.1–09.2 | Implementadas, validadas e sincronizadas | Contextos de atuação, cliente automático e sessão entre abas |
| 09.3–09.4 | Implementadas, validadas e sincronizadas | Alternância, guardas e controle de acesso demonstrativo |
| 09.5 | Implementada, validada e sincronizada | Gerenciamento básico da conta |
| 09.6–09.7 | Implementadas, versionamento pendente | Integração de layouts e validação integrada |

## Planejamento inicial (registro histórico)

A tabela abaixo preserva a numeração de planejamento de 26/11/2026.
A tabela acima acompanha os registros efetivos de implementação.

Atualização: 26/11/2026. Análise conceitual inicial encerrada; 91 decisões específicas aprovadas. Nenhuma instalação no computador do usuário confirmada. Nenhuma tela implementada ou testada. PDF/Figma originais não modificados.

| Etapa | Situação | Entrega |
|---|---|---|
| 00 | Concluída (análise inicial) | Inventário, decisões, escopo e pendências |
| 01 | Próxima | Ambiente, Vite, React, TypeScript, Tailwind, Router, Lucide |
| 02 | Pendente | Componentes e identidade visual |
| 03 | Pendente | Página institucional |
| 04–05 | Pendente | Autenticação, conta e perfis |
| 06–07 | Pendente | Prestadores e autorizações administrativas |
| 08 | Pendente | Veículos, motoristas, vínculos, tarifas |
| 09–12 | Pendente | Pesquisa, solicitações, propostas, contratação |
| 13–17 | Pendente | Designação, execução, ocorrências, acordo, cancelamento e conclusão |
| 18 | Pendente | Consolidar notificações e históricos (gerar eventos desde o início) |
| 19–21 | Pendente | Contestações, achados e perdidos, avaliações |
| 22 | Pendente | Testes integrados e revisão documental |

## Critério de conclusão
Fluxo navegável, validações, permissões, estados, dados compartilhados, erros e listas vazias, responsividade, testes e rastreabilidade. Registrar arquivos alterados e comandos realmente executados. Atualizar este arquivo, DECISOES e PENDENCIAS a cada módulo.

## Registro de desenvolvimento — 26/11/2026

### Etapa 01 — Configuração inicial

Status: concluída tecnicamente.

#### Ambiente

- Node.js: 24.20.0
- npm: 11.19.0
- Git: 2.53.0
- Sistema operacional: Linux

#### Tecnologias instaladas

- React: 19.3.1
- React DOM: 19.3.1
- TypeScript: 6.0.3
- Vite: 8.4.0
- Tailwind CSS: 4.3.5
- React Router: 8.5.3
- Lucide React: 1.81.0
- ESLint: 10.15.0

#### Atividades realizadas

- [x] Verificação do ambiente de desenvolvimento.
- [x] Criação do projeto React com TypeScript.
- [x] Instalação das dependências.
- [x] Configuração do Tailwind CSS.
- [x] Configuração do React Router.
- [x] Integração do Lucide React.
- [x] Criação da interface temporária de teste.
- [x] Renderização das rotas inicial e de teste.
- [x] Validação visual.
- [x] Execução de npm run build sem erros.
- [x] Execução de npm run lint sem erros.
- [x] Inclusão da documentação inicial.
- [x] Inicialização do repositório Git.
- [x] Primeiro commit: 041a853.

#### Observações

A identidade visual utilizada na interface de teste
é provisória e não representa o Design System definitivo.

Nenhuma funcionalidade de negócio foi implementada.

#### Próxima etapa

Organização da arquitetura de pastas e definição
das responsabilidades de cada camada do protótipo.

## Etapa 02 — Arquitetura inicial

Data: 26/11/2026

Status: concluída.

### Atividades realizadas

- [x] Definição da arquitetura de diretórios.
- [x] Separação das páginas temporárias.
- [x] Criação do EnvironmentPage.
- [x] Criação do NavigationTestPage.
- [x] Centralização das rotas em AppRoutes.
- [x] Simplificação do App.tsx.
- [x] Validação da compilação.
- [x] Validação do ESLint.
- [x] Teste de navegação após refatoração.
- [x] Criação do documento ARQUITETURA.md.

### Resultados

- Build executado sem erros.
- ESLint executado sem erros ou avisos.
- Estrutura de arquivos validada.
- Comportamento das páginas temporárias preservado.

### Próxima etapa

Análise da identidade visual das capturas originais
do Figma e construção do Design System do MUV.

## Etapas 03 e 04 — Identidade visual e Design System

### Etapa 03 — Análise visual

Status: concluída.

- [x] Análise das capturas originais do Figma.
- [x] Identificação dos padrões visuais.
- [x] Definição da paleta de cores.
- [x] Definição da escala tipográfica.
- [x] Definição dos espaçamentos.
- [x] Aprovação das decisões DEC-037.1 a DEC-037.10.

### Etapa 04 — Implementação do Design System

Status: concluída após validação responsiva.

- [x] Instalação da fonte Inter.
- [x] Configuração dos tokens visuais.
- [x] Configuração dos estilos globais.
- [x] Criação da página de demonstração.
- [x] Documentação do Design System.
- [x] Validação visual.
- [ ] Validação completa da responsividade.
- [x] Validação do build e lint.
- [x] Implementação provisória do logotipo.
- [ ] Registro no Git.

### Etapa 05.1 — Componentes reutilizáveis

- [x] Implementação do Logo.
- [x] Implementação do Button.
- [x] Implementação do Card.
- [x] Implementação do Badge.
- [x] Criação do CoreComponentsDemo.
- [x] Validação visual.
- [x] Validação do build.
- [x] Validação do ESLint.

### Próximo incremento

Implementação dos componentes reutilizáveis
de formulário.

### Etapa 05.2 — Componentes de formulário

Status: concluída após validação funcional.

- [x] Implementação do FormField.
- [x] Implementação do Input.
- [x] Implementação do Select.
- [x] Implementação do Textarea.
- [x] Criação do FormComponentsDemo.
- [x] Validação visual.
- [x] Validação do build.
- [x] Validação do ESLint.
- [ ] Teste de submissão inválida.
- [ ] Teste de submissão válida.
- [ ] Teste de limpeza dos campos.
- [ ] Validação da responsividade.

### Próximo incremento

Implementação dos componentes Checkbox e RadioGroup.

## Registro de incidente — 26/11/2026

### Problema identificado

Uma interrupção no fornecimento de energia provocou
a corrupção de um objeto interno do repositório Git.

Durante a tentativa de recuperação, o repositório
local e três arquivos não versionados foram excluídos.

### Arquivos restaurados

- src/components/ui/Checkbox.tsx
- src/components/ui/RadioGroup.tsx
- src/pages/dev/SelectionComponentsDemo.tsx

### Resultado da recuperação

- [x] Código-fonte recuperado.
- [x] Documentação preservada.
- [x] Componentes restaurados.
- [x] Integração dos componentes verificada.
- [x] Build executado sem erros.
- [x] ESLint executado sem erros.
- [ ] Nova validação funcional no navegador.
- [ ] Nova cópia de segurança.
- [x] Restabelecimento do Git.
- [x] Configuração de repositório remoto.

### Histórico anterior conhecido

- 041a853 — Inicialização do protótipo.
- aa31351 — Organização da arquitetura.
- 8f18214 — Design System e componentes iniciais.

Os identificadores anteriores foram preservados
para fins de rastreabilidade documental.

### Situação do desenvolvimento

O projeto permanece na Etapa 05.3.

Próxima etapa: implementação dos componentes
Alert, Modal e ConfirmDialog.

### Restabelecimento do versionamento

- Novo commit de referência: 49c8208.
- Branch principal: main.
- Repositório remoto: GustavoSousa2917/prototipomuv.
- Sincronização com origin/main concluída.
- Integridade do Git verificada com git fsck --full.
- Histórico original preservado apenas como referência documental.

O desenvolvimento será retomado a partir da Etapa 05.4.

## Etapa 05.4 — Componentes de feedback

Status: implementada, em validação final.

- [x] Implementação do Alert.
- [x] Implementação do Modal.
- [x] Implementação do ConfirmDialog.
- [x] Criação do FeedbackComponentsDemo.
- [x] Validação visual.
- [x] Validação das mensagens.
- [x] Teste de abertura do modal.
- [x] Teste de confirmação de contratação.
- [x] Teste de confirmação de cancelamento.
- [x] Teste de processamento.
- [x] Validação do build.
- [x] Validação do ESLint.
- [ ] Teste de fechamento e desistência da operação.
- [ ] Validação da navegação por teclado.
- [ ] Validação da responsividade.
- [ ] Registro no Git.
- [ ] Sincronização com GitHub.

### Próximo incremento

Implementação dos componentes Avatar,
PageHeader, EmptyState e Loading.

## Etapas 05.5 e 05.6 — Componentes compartilhados

Status: implementadas e validadas em desktop.

- [x] Implementação do Avatar.
- [x] Implementação do PageHeader.
- [x] Implementação do EmptyState.
- [x] Implementação do Loading.
- [x] Criação do SharedComponentsDemo.
- [x] Integração ao Design System.
- [x] Validação visual.
- [x] Validação dos quatro estados da listagem.
- [x] Validação das ações dos cabeçalhos.
- [x] Validação do build.
- [x] Validação do ESLint.
- [ ] Teste de falha de carregamento da imagem do Avatar.
- [ ] Validação da responsividade.
- [ ] Registro no Git.
- [ ] Sincronização com GitHub.

### Resultado

Biblioteca inicial composta por 17 componentes
reutilizáveis, organizados em quatro categorias:

- Common.
- UI.
- Forms.
- Feedback.

### Próximo incremento

Etapa 06.1 — Layout público e navegação institucional.

## Etapa 06.1 — Layout público

Status: implementada e validada em desktop.

- [x] Criação do MobileMenu.
- [x] Criação do PublicHeader.
- [x] Criação do PublicFooter.
- [x] Criação do PublicLayout.
- [x] Criação da HomePage provisória.
- [x] Criação da PublicPlaceholderPage.
- [x] Configuração das rotas aninhadas.
- [x] Validação visual em desktop.
- [x] Validação da página de login provisória.
- [x] Validação da página de cadastro provisória.
- [x] Validação do cabeçalho e rodapé.
- [x] Validação do build.
- [x] Validação do ESLint.
- [ ] Validação das rotas de desenvolvimento.
- [ ] Validação da navegação por âncoras.
- [ ] Validação das demais rotas públicas.
- [ ] Validação do menu mobile.
- [ ] Validação da responsividade.
- [ ] Validação da navegação por teclado.
- [ ] Registro no Git.
- [ ] Sincronização com GitHub.

### Resultado

Estrutura pública implementada com componentes
compartilhados e navegação institucional.

A página inicial permanece provisória.

A autenticação e o cadastro serão implementados
posteriormente.

### Próximo incremento

Etapa 06.2 — Layout do cliente.

## Etapa 06.2 — Layout do cliente

Status: em implementação.

### Implementação

- [x] Criação do ClientHeader.
- [x] Criação do ClientLayout.
- [x] Criação do ClientPlaceholderPage.
- [x] Configuração das rotas do cliente.
- [x] Redirecionamento da rota inicial.
- [x] Indicador de navegação ativa.
- [x] Menu da conta.
- [x] Acesso às notificações.
- [x] Navegação mobile.
- [x] Acesso ao módulo Seja prestador.

### Validação

- [x] Navegação desktop.
- [x] Navegação mobile.
- [x] Responsividade.
- [x] Navegação por teclado.
- [x] Preservação das rotas anteriores.
- [x] Build.
- [x] ESLint.
- [x] Commit.
- [x] Sincronização com GitHub.

### Próximo incremento

Etapa 06.3 — Layout operacional compartilhado.

## Etapa 06.3 — Layout operacional compartilhado

Status: implementada e validada.

### Implementação

- [x] Criação do SidebarItem.
- [x] Criação do Sidebar.
- [x] Criação do OperationalHeader.
- [x] Criação do OperationalLayout.
- [x] Criação do OperationalLayoutDemo.
- [x] Configuração das rotas demonstrativas.
- [x] Navegação lateral configurável.
- [x] Identificação da rota ativa.
- [x] Navegação mobile.
- [x] Fechamento por Escape.
- [x] Reutilização do Design System.

### Validação

- [x] Navegação desktop.
- [x] Navegação mobile.
- [x] Responsividade em 320 px.
- [x] Responsividade em 390 px.
- [x] Responsividade em tablet.
- [x] Navegação por teclado.
- [x] Preservação das rotas anteriores.
- [x] Build.
- [x] ESLint.
- [x] Commit `7c287e9` confirmado no histórico local.
- [x] Incluída na `main` remota anteriormente confirmada em `3cd6f14`. A referência local `origin/main` aponta para esse commit. A nova consulta direta falhou na resolução de `github.com`.

### Resultado

Estrutura operacional compartilhada implementada,
permitindo a configuração de diferentes ambientes
sem duplicação dos componentes de navegação.

O layout contempla cabeçalho persistente,
barra lateral configurável, identificação do
perfil ativo, navegação responsiva e recursos
de acessibilidade.

A navegação mobile utiliza o elemento dialog
nativo do HTML.

As rotas demonstrativas permanecem disponíveis
para testes independentes.

### Limitações temporárias

- Identificação fictícia do usuário.
- Conteúdo provisório das páginas.
- Ausência de autenticação.
- Ausência de controle de permissões.
- Ausência de alternância entre perfis.

### Próximo incremento

Etapa 06.4 — Navegação específica por perfil.

## Etapa 06.4 — Navegação específica por perfil

Status: implementada, em validação final.

### Implementação

- [x] Configuração da navegação por perfil.
- [x] Criação do ProfileOperationalLayout.
- [x] Criação das páginas operacionais provisórias.
- [x] Configuração do ambiente do prestador autônomo.
- [x] Configuração do ambiente da empresa.
- [x] Configuração do ambiente da cooperativa.
- [x] Configuração do ambiente do motorista.
- [x] Configuração do ambiente administrativo.
- [x] Reutilização do OperationalLayout.
- [x] Preservação da demonstração operacional.

### Etapa 06.4.1 — Refinamento da navegação

- [x] Rolagem independente da navegação desktop.
- [x] Identificação persistente do perfil.
- [x] Navegação secundária persistente em desktop.
- [x] Quebra de linha dos nomes dos prestadores.
- [x] Cabeçalho persistente no menu mobile.
- [x] Validação visual em 1440 x 900.
- [x] Validação visual em 1280 x 720.
- [x] Validação visual em 768 x 1024.
- [x] Validação visual do conteúdo em 320 x 568.

### Validação final

- [x] Build.
- [x] ESLint.
- [ ] Revisão da formatação.
- [ ] Validação completa da navegação mobile.
- [ ] Validação em 1024 x 768.
- [ ] Navegação por teclado.
- [ ] Testes de regressão.
- [x] Commit `3cd6f14` confirmado no histórico local.
- [x] Incluída na `main` remota anteriormente confirmada em `3cd6f14`. A referência local `origin/main` aponta para esse commit. A nova consulta direta falhou na resolução de `github.com`.

### Resultado

Estrutura de navegação específica para os ambientes
operacionais do MUV, utilizando componentes
compartilhados e configurações por perfil.

A autenticação e as permissões permanecem pendentes.

### Próximo incremento

Etapa 06.5 — Layout de autenticação.

## Etapa 06.5 — Layout de autenticação

Status: validada, versionada e sincronizada com o GitHub.

- `src/layouts/AuthLayout.tsx` fornece o layout responsivo compartilhado.
- `src/pages/auth/LoginPage.tsx` e `src/pages/auth/RegisterPage.tsx`
  reutilizam `src/pages/auth/AuthPlaceholderPage.tsx`.
- `src/routes/AppRoutes.tsx` associa `/login` e `/cadastro` ao layout de
  autenticação. As páginas são provisórias. Autenticação, formulário
  funcional, sessão e controle de acesso permanecem pendentes.
- `src/styles/base.css` deixa o corpo ocupar a largura útil da janela. A
  largura mínima fixa de 320 px causava rolagem horizontal quando a
  barra vertical reduzia a largura útil.

### Validação

- Chromium headless com capturas e medições em ambas as rotas. Duas
  colunas em 1440 × 900, 1280 × 720 e 1024 × 768. Coluna única em
  768 × 1024, 390 × 844 e 320 × 568. Sem rolagem horizontal nos 12
  cenários após a correção.
- Layouts público, cliente e operacional do autônomo inspecionados em
  320 e 390 px, sem cortes visíveis ou rolagem horizontal.
- Acesso direto, links entre login e cadastro, retorno ao site, links
  legais, acesso pelo site, histórico, rolagem, foco, Tab, Shift+Tab,
  Enter e atalho para o conteúdo passaram na sessão anterior e na
  revalidação automatizada.
- Renderização inicial dos ambientes público, cliente, autônomo,
  empresa, cooperativa, motorista, administrador e quatro rotas de
  desenvolvimento confirmada. Os redirecionamentos de `/cliente` e
  `/prestador` também passaram.
- Build com TypeScript, ESLint e verificação de whitespace passaram.
  `git fsck --full` terminou com código 0 e reportou uma árvore sem
  referência.
- O console registrou apenas o HTTP 404 de `/favicon.ico`, pendência
  técnica separada. A consulta remota anterior falhou e foi sucedida
  pela confirmação do responsável.

### Versionamento

- [x] `6e9c2d1` — docs: adiciona instrucoes de desenvolvimento para o Codex.
- [x] `ab4f2bb` — feat: implementa layout de autenticacao.
- [x] Integração à `main` por fast-forward.
- [x] Push confirmado pelo responsável. `HEAD`, `origin/main` e a
  referência remota `refs/heads/main` foram confirmados em
  `ab4f2bb9ef4f12096eca276e47b6142be22ab93d`. As referências locais
  coincidiram na preparação da Etapa 06.6.

## Etapa 06.6 — Página de erro 404

Status: implementada, validada no Chromium headless e versionada.

Commit `94470a77aa6d536faa65ff8414545f950968b7b0` —
feat: implementa pagina de erro 404. Integração à `main` e sincronização
remota confirmadas pelo responsável. As referências locais `main` e
`origin/main` coincidiram na preparação da revisão do modelo.

- `src/pages/errors/NotFoundPage.tsx` apresenta logotipo, código 404,
  mensagem e link para a página inicial.
- `src/routes/AppRoutes.tsx` usa a rota global `*` para endereços
  desconhecidos, inclusive subrotas. O preview da SPA retorna HTTP 200
  para o documento que renderiza a página 404. Acesso negado (403)
  permanece pendente.

### Validação

- Capturas e medições em 1440 × 900, 1280 × 720, 1024 × 768,
  768 × 1024, 390 × 844 e 320 × 568, sem cortes nem rolagem horizontal.
- Acesso direto e 12 subrotas inexistentes passaram. Tab exibiu o
  indicador de foco no link. Enter levou à página inicial, e o histórico
  restaurou as páginas esperadas ao voltar e avançar.
- As 17 verificações de regressão abrangeram rotas públicas, de
  autenticação, cliente, prestadores, motorista, administrador e
  desenvolvimento, incluindo os redirecionamentos de `/cliente` e
  `/prestador`.
- Console sem erros novos. O HTTP 404 de `/favicon.ico` permanece
  registrado em `PENDENCIAS.md`.
- Build com TypeScript, ESLint e verificações de whitespace passaram.
  `git fsck --full` terminou com código 0 e reportou a árvore sem
  referência já conhecida.

## Alinhamento anterior à Etapa 07 — Solicitações direcionadas

A DEC-038 consolida a revisão aprovada pelo responsável. A documentação
passa a prever um prestador escolhido por solicitação, valor base pelas
tarifas desse prestador, encerramento por recusa e reaproveitamento dos
dados em nova solicitação com histórico preservado. A matriz de
rastreabilidade registra as divergências com o PDF original por página.

A interface provisória foi alinhada no texto de Solicitações para
autônomos, empresas e cooperativas, no texto institucional e na
demonstração de seleção do Design System. Os menus e as rotas foram
preservados. Solicitação e contratação funcionais permanecem pendentes.

- Chromium headless confirmou os links dos menus e a descrição
  atualizada nas três rotas de solicitações. Também confirmou navegação
  nos ambientes de cliente, motorista e administrador e o texto
  institucional atualizado.
- No demonstrador, passaram a ausência da escolha de tipo, a validação
  sem seleções, a validação com checkbox e modalidade selecionados e a
  limpeza. O console registrou somente o 404 conhecido de `/favicon.ico`.
- Build com TypeScript, ESLint e `git diff --check` passaram.
  `git fsck --full` terminou com código 0 e reportou a árvore sem
  referência já conhecida.

Permanece pendente a definição dos critérios técnicos para identificar
a mesma necessidade de frete.

O commit `aee048a7c4f4b20984b6f7b1cc1cfef1ea30d124` registrou a revisão.
Integração à `main` e sincronização remota confirmadas pelo responsável.

## Etapa 07 — Página institucional definitiva

Status: T01 implementada, validada e versionada em
`e3391be01fd6ab659c5b463316a2ebc7316cde15`. Integração à `main` e
sincronização remota confirmadas pelo responsável.

A página inicial reúne hero, públicos, benefícios, cinco passos,
exemplo de solicitação direcionada, seção de prestadores, seis perguntas
frequentes, banner final e rodapé. As cinco chamadas da página apontam
para a rota de cadastro, que ainda era provisória na Etapa 07. O rodapé identifica o caráter acadêmico e
demonstrativo do protótipo.

As capturas T01 09, 10 e 11 do `prototipo.zip` orientaram a composição.
Os painéis gráficos usam ícones Lucide e tokens do Design System. Os
recursos locais foram inspecionados e não incluem fotografias adequadas.
O arquivo `src/assets/hero.png` é uma ilustração do projeto inicial.

### Validação

- Capturas inspecionadas e dimensões verificadas em 1440 × 900,
  1280 × 720, 1024 × 768, 768 × 1024, 390 × 844 e 320 × 568.
  Hero em duas colunas a partir de 1024 px e coluna única abaixo
  desse limite, sem rolagem horizontal.
- Menu mobile abriu, fechou por Escape com retorno de foco e fechou
  após navegação. As âncoras posicionaram a seção abaixo do cabeçalho
  e transferiram o foco. Passaram os testes a partir da página
  inicial, de termos e de privacidade.
- As seis perguntas abriram por clique. A primeira recebeu foco
  visível por Tab e abriu e fechou com Enter. Login, cadastro, termos,
  privacidade e as cinco chamadas da T01 foram verificados.
- Passaram dez verificações pontuais nas rotas de autenticação,
  página 404, cliente, autônomo, empresa, cooperativa, motorista,
  administrador e demonstração operacional. O console registrou
  somente o HTTP 404 de favicon já conhecido.
- Build com TypeScript, ESLint e `git diff --check` passaram.
  `git fsck --full` terminou com código 0 e reportou duas árvores sem
  referência.

## Etapas 08.1 e 08.2 — Fundação funcional e cadastro

A DEC-039 registra P08-01 a P08-10. O cadastro único da T03 adapta as
capturas 56 a 61 ao fluxo em duas etapas, reutilizando componentes do
Design System e o AuthLayout. O formulário valida os dados pessoais,
registra uma finalidade inicial e exige aceite dos termos e da
privacidade. O sucesso oferece acesso ao login provisório.

O domínio valida e normaliza os dados. O serviço coordena a unicidade,
o UUID, as datas e a derivação PBKDF2 com SHA-256 e salt individual. O
repositório persiste o registro em `muv.users.v1`. A persistência é
demonstrativa. As páginas legais permanecem provisórias.

### Validação

- Domínio: foram verificados dados válidos, campos vazios, nome só com
  espaços, CPF inválido e repetido, telefone e e-mail inválidos, senha
  curta ou sem letra ou número, confirmação divergente, finalidade
  ausente ou inválida e falta de aceite.
- Serviço e repositório: em armazenamento simulado com Node.js e Web
  Crypto, passaram consultas por ID, CPF e e-mail, normalização,
  duplicidade com diferenças de formato, concorrência no mesmo
  contexto, verificação da derivação, salt individual e preservação de
  registros em falhas de leitura, gravação e dados inválidos.
- Chromium headless em perfil isolado: foram inspecionadas capturas
  das duas etapas em 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024,
  390 × 844 e 320 × 568, sem cortes horizontais ou rolagem indevida.
- Passaram os testes de formatação, erros associados aos campos,
  visibilidade de senha, foco, seleção por teclado, volta com dados
  preservados e consulta aos dois links legais em outra aba.
- Cadastro, processamento, tentativa dupla, duplicidade por CPF e
  e-mail, persistência após recarga e falha simulada de gravação
  passaram. A inspeção do registro confirmou ausência de senha em
  claro, confirmação, perfil ou sessão. A finalidade de administrador
  foi rejeitada no domínio e está ausente no formulário.
- Regressão de 12 rotas na página institucional, login provisório,
  páginas legais, 404 e ambientes existentes. O console apresentou
  apenas o HTTP 404 de favicon já conhecido.
- Build com TypeScript, ESLint e verificações de whitespace passaram.
  `git fsck --full` retornou código 0 e listou duas árvores sem referência.

RF001 está parcialmente implementado. Próximos incrementos previstos:
login e sessão (08.3), recuperação simulada (08.4) e integração do
perfil cliente (09). As Etapas 08.1 e 08.2 foram registradas no commit
`2ca3b2c62ac6e6147f17d35aab4870cf4d2930cf`, integradas à `main` e
sincronizadas conforme confirmação do responsável.

## Etapa 08.3 — Login, sessão e logout

Status: implementada, validada e versionada em
`14655e518f76dbc1b1e79fca8950ccb46f7174ae`. Integração à `main` e
sincronização remota confirmadas pelo responsável.

A T02 segue a captura 62 e a DEC-039. A conta é acessada por e-mail e
senha. A derivação PBKDF2 foi compartilhada com o cadastro e verifica
os parâmetros e o salt persistidos, preservando `muv.users.v1`.
A sessão simulada guarda apenas o ID da conta em `muv.session.v1`.
O contexto restaura a identidade na recarga quando encontra o usuário.
O cabeçalho do cliente apresenta nome, iniciais e a ação de saída.

### Validação

- Serviços e repositórios: passaram a compatibilidade com uma
  credencial sintética no formato anterior, conferida por PBKDF2
  independente, e o login de conta nova. Foram verificadas a
  normalização do e-mail, as validações, credenciais incorretas,
  restauração com dados inválidos ou usuário ausente e falhas de
  leitura, gravação e remoção.
- Chromium headless com perfil isolado: capturas do login inspecionadas
  em 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024, 390 × 844 e
  320 × 568, sem rolagem horizontal.
- Cadastro → login → cliente → recarga → logout passou. Foram
  verificados o foco após erros, o controle de visibilidade de senha,
  a mensagem genérica para credenciais inválidas, o envio único,
  a falha de gravação, o nome e as iniciais, o login por teclado e
  o logout em desktop e mobile. Uma recarga após logout permaneceu
  sem sessão, e a conta foi preservada.
- As verificações pontuais cobriram a página institucional, cadastro,
  páginas legais, 404 e ambientes operacionais. O console registrou
  somente o 404 de favicon já conhecido.
- Build com TypeScript, ESLint e verificação de whitespace passaram.
  `git fsck --full` retornou código 0 e listou as duas árvores sem
  referência já registradas.

A sessão é demonstrativa e manipulável. O contexto é local à aba e
reflete a sessão persistida na próxima recarga. RF001 segue parcialmente
implementado. A recuperação fica para a Etapa 08.4 e a integração de
conta e perfis para a Etapa 09.

## Etapa 08.4 — Recuperação e redefinição de senha

Status: implementada, validada e versionada em
`2af5212a789420dc12be66505a9d8775056fd22a`. Integração à `main` e
sincronização remota confirmadas pelo responsável.

As telas T04 e T05 seguem as capturas 12 e 13 e a DEC-039. As rotas
`/recuperar-senha` e `/redefinir-senha` reutilizam o AuthLayout. O
link de redefinição é apresentado na caixa de entrada demonstrativa
apenas quando existe conta. Nenhum e-mail é enviado.

O serviço gera um token aleatório de uso único, com validade de 15
minutos. O repositório guarda o resumo SHA-256 em
`muv.passwordRecovery.v1`. A redefinição consome o token, remove a
sessão persistida da conta recuperada e atualiza a credencial PBKDF2
e a data de alteração. Se uma operação posterior ao consumo falhar,
é necessário solicitar um novo link. A senha anterior permanece
válida e a sessão pode ter sido encerrada.

### Validação

- Serviços e repositórios: passou a normalização de e-mail, conta
  inexistente, validade no limite de expiração com relógio simulado,
  invalidação de pedidos anteriores, rejeição de token ausente,
  inválido, expirado ou usado e validação de nova senha e confirmação.
- Duas tentativas concorrentes no mesmo contexto produziram uma única
  alteração. Foram verificados dados cadastrais preservados,
  isolamento de tokens e sessões de outras contas, ausência de senha
  em claro e falhas simuladas de leitura, gravação e remoção.
- Chromium headless em perfil isolado: ambas as interfaces foram
  inspecionadas em 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024,
  390 × 844 e 320 × 568, sem rolagem horizontal indevida.
- Passaram mensagens, foco, teclado, visibilidade da senha, link
  demonstrativo, processamento da redefinição, prevenção de envio
  duplicado, retorno ao login, rejeição da senha antiga, login com a
  nova, encerramento da sessão anterior e logout.
- Regressões passaram no cadastro, login, sessão, logout, página
  institucional, 404 e ambientes existentes. O texto do console
  não continha senhas ou tokens completos. O erro observado foi o
  404 de favicon já conhecido.
- Build com TypeScript, ESLint e verificações de whitespace passaram.
  `git fsck --full` terminou com código 0 e listou as duas árvores
  sem referência já registradas.

RF001, RU001 e US-001 estão funcionalmente atendidos no escopo
demonstrativo da Etapa 08. A segurança de produção e o atendimento
integral ao RNF003 permanecem fora desta entrega. Integração de conta
e perfis, permissões e controle de acesso continuam para a Etapa 09.

## Etapas 09.1 e 09.2 — Fundação de contas e contextos de atuação

Status: implementadas, validadas e versionadas em
`32b4d108b25cb658950d112b45d219a4fed419c6`. Integração à `main` e
sincronização remota confirmadas pelo responsável.

A DEC-040 registra P09-01 a P09-11. Nesta entrega, contas comuns
novas e legadas recebem contexto cliente derivado. Atribuições
explícitas são lidas separadamente e identificam a organização ou o
vínculo, quando aplicável. Administração exclusiva requer atribuição
válida. As capacidades indicam acesso conceitual aos ambientes.
Os formatos de `muv.users.v1` e `muv.session.v1` foram preservados.

A seleção é validada por conta e por aba em `muv.activeContext.v1`
no sessionStorage. Eventos de armazenamento propagam autenticação,
mudanças de conta e atribuições. Logout confere a conta sob o mesmo
bloqueio das outras mutações de autenticação. O contexto expõe
identidade resumida e capacidades, sem credenciais.

### Validação

- Testes isolados de domínio e serviços passaram para conta legada e
  nova, atribuições organizacionais distintas, rejeição de dados
  inválidos, inconsistentes ou de outra conta, administração exclusiva,
  ausência de administração no cadastro público, resolução e restauração
  da seleção, destinos iniciais, logout condicionado e falhas de
  armazenamento.
- No Chromium headless, duas abas de um perfil isolado confirmaram
  login, logout, substituição e atualização da conta, revalidação ao
  remover atribuição e invalidação após recuperação. As seleções
  permaneceram independentes. Uma operação de logout iniciada por A
  antes da substituição por B preservou a sessão de B.
- O cabeçalho do cliente foi inspecionado em 1440 × 900, 1280 × 720,
  1024 × 768, 768 × 1024, 390 × 844 e 320 × 568. Nome, iniciais,
  contexto, foco, teclado e saída foram verificados, sem rolagem
  horizontal indevida.
- Passaram as regressões direcionadas de cadastro, login, recuperação
  e redefinição, restauração, logout, página institucional, 404 e
  ambientes existentes. O console apresentou apenas o 404 de favicon
  já conhecido.
- Build com TypeScript, ESLint e verificações de whitespace passaram.
  `git fsck --full` retornou código 0 e listou duas árvores sem
  referência já conhecidas.

Sem Web Locks a fila serializa apenas a aba atual. Não há transações
entre chaves nem distinção entre sessões consecutivas da mesma conta.
O armazenamento é demonstrativo. Seletor, guardas, 403, conta canônica,
atribuições demonstrativas permanentes e autorização operacional
permanecem pendentes.

## Etapas 09.3 e 09.4 — Alternância e controle de acesso

Status: implementadas, validadas e versionadas em
`957c99795f97bc1b60a78d72a486411ea9ef4f49`. Integração à `main` e
sincronização remota confirmadas pelo responsável.

O seletor segue a referência T06 (capturas 70–71). A seleção explícita
revalida a conta e as atribuições e persiste apenas na aba atual.
Cabeçalhos apresentam identidade e contexto separadamente e oferecem
logout. A saída explícita descarta o destino de retorno.

A política central verifica conta, contexto, capacidade e escopo
opcional. As rotas válidas de cliente, autônomo, empresa, cooperativa,
motorista e administração têm guardas. A entrada `/prestador` lista
atuações profissionais ou orienta sobre o cadastro futuro. O 403 do
item A24 mantém a URL solicitada. Endereços desconhecidos continuam
no 404. Rotas públicas e demonstradores permanecem acessíveis.

O provisionamento idempotente fica em `/dev/contas`, apenas em modo
de desenvolvimento. As instruções de acesso estão em ARQUITETURA.md.
Contas existentes e sessões são preservadas. Uma colisão não promove
uma conta comum. O bundle de produção foi conferido e não contém a
rota de provisionamento nem a senha fictícia.

### Validação

- Testes isolados passaram para política de acesso, escopo entre
  empresas e cooperativas, vínculo incompatível, troca inválida ou
  de outra conta, falha de persistência da seleção, revogação,
  provisionamento inicial e idempotente e colisão administrativa.
- Chromium headless em perfis isolados: passaram as jornadas dos
  seis ambientes protegidos, retorno interno e rejeição de destino
  externo, troca explícita, 403/404, entrada de prestador com zero,
  um ou vários contextos, logout e destino administrativo após a saída.
- Duas abas confirmaram seleção independente, recarga, revogação e
  invalidação de sessão após recuperação de senha.
- Foram inspecionadas capturas do seletor, dos cabeçalhos com a conta
  aberta, do 403, da troca necessária e da entrada de prestadores em
  1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024, 390 × 844 e
  320 × 568. Passaram foco, Escape e verificação de rolagem horizontal.
- Passaram regressões na estrutura pública, cadastro, login, sessão,
  recuperação, 404, páginas legais e demonstradores. O console
  apresentou somente o 404 de favicon já conhecido.
- Build, lint e verificações de whitespace passaram. `git fsck --full`
  terminou com código 0 e reportou as duas árvores sem referência
  já conhecidas.

A política de escopo foi verificada com dados isolados. Autorização
por modalidade, prontidão e proteção de registros de negócio ficam
nos seus módulos. A proteção cliente-side é demonstrativa e o RNF003
permanece pendente. A próxima etapa prevista é 09.5.

## Etapa 09.5 — Gerenciamento básico da conta

Versionada em `dda58d0b5e8a529d2994c78fa314d2fcf0798e7a`.
Integração à `main` e sincronização remota confirmadas pelo responsável.

A rota autenticada `/conta` atende contas comuns e administrativas
e implementa A23 conforme DEC-040.10. As capturas 70–71 de T06
orientaram a apresentação separada dos dados e contextos de uma conta
única. A entrega cobre consulta dos dados básicos, edição de nome e
telefone, identificação do contexto ativo e alternância existente.
Cadastro profissional, autorização por modalidade e prontidão
operacional permanecem nos módulos próprios.

A edição preserva os demais campos, as atribuições, a sessão e a
seleção da aba. A sincronização por eventos de armazenamento atualiza
a identidade em outras abas. O protótipo mantém as limitações de
concorrência e segurança documentadas em PENDENCIAS.md.

### Validação

- Testes isolados com dados fictícios verificaram contas legadas e
  recém-cadastradas, projeção sem credenciais, validação, atualização
  individual de nome e telefone, normalização, rejeição de campos
  adicionais, falha de gravação, preservação dos demais dados e recusa
  de gravação quando a conta muda antes da persistência.
- No Chromium, contas demonstrativas comuns e administrativas
  acessaram a própria conta. Foram verificados retorno após login,
  atalhos dos cabeçalhos, alias administrativo, rótulos de contextos
  distintos, validação de campos, cancelamento, falha de gravação,
  submissão duplicada, confirmação e persistência após recarga.
- Duas abas confirmaram a atualização do nome e das iniciais e a
  preservação dos contextos independentes. As regressões abrangeram
  cadastro, login, logout, recuperação após edição, alternância,
  guardas, 403 e 404. O navegador reportou o 404 de favicon já conhecido.
- Visualização e edição foram inspecionadas em 1440 × 900, 1280 × 720,
  1024 × 768, 768 × 1024, 390 × 844 e 320 × 568. Foram verificados
  foco de entrada e de retorno, acionamento por teclado e ausência
  de rolagem horizontal indevida.
- Build, lint e verificações de whitespace passaram. `git fsck --full`
  terminou com código 0 e reportou três árvores sem referência já
  identificadas.

## Etapas 09.6 e 09.7 — Integração e validação da Etapa 09

O cabeçalho público, o menu mobile, o rodapé e as chamadas da Home
passaram a considerar a sessão. O acesso ao ambiente usa o contexto
ativo da aba. A chamada de cliente passa pela guarda e a de prestador
leva à seleção em `/prestador`. A administração exclusiva vê apenas
os destinos de conta e administração. O cabeçalho cliente usa a
mesma entrada para prestadores. As demais guardas, os ambientes, a
conta canônica e os demonstradores públicos foram preservados.

### Jornadas verificadas

| Jornada | Evidência |
|---|---|
| A — Conta nova | No Chromium, cadastro pelo site, entrada no cliente, edição, recarga, logout e novo login. Finalidade profissional sem atribuição adicional. |
| B — Múltiplos contextos | No Chromium, seleção explícita, abertura da conta, retorno ao ambiente, recarga, troca para motorista e cliente com a mesma sessão. |
| C — Organizações | No Chromium, seleção de empresas distintas por ID e persistência após recarga. Em testes isolados, a política rejeitou escopos incompatíveis de organização e vínculo. |
| D — Administração | No Chromium, entrada em `/admin`, edição da própria conta, ausência de chamadas comerciais, 403 com retorno à administração e logout. |
| E — Controle de acesso | No Chromium, rotas públicas e demonstradores, retorno interno, rejeição de destino externo, troca explícita, 403, 404 e ausência de conteúdo protegido enquanto a restauração estava suspensa. |
| F — Abas | No Chromium, login, atualização de identidade, seleção independente, recuperação e logout entre abas. Em testes isolados, edição e logout desatualizados preservaram a outra conta e sua sessão. |
| G — Recuperação | No Chromium, redefinição, invalidação da sessão, recusa da senha anterior, login com a nova senha e preservação dos demais dados e atribuições. |

Foram percorridos os seis ambientes e conferidos os menus operacionais
móveis e os atalhos de conta. As capturas de cabeçalho público, menu
mobile, cabeçalho operacional, Minha conta, seletor e 403 foram
inspecionadas em 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024,
390 × 844 e 320 × 568. Foram verificados Escape, retorno de foco,
âncoras institucionais e ausência de rolagem horizontal indevida.
O console apresentou apenas o 404 de favicon já conhecido.

O provisionamento criou os oito cenários, preservou cadastros,
credenciais e sessão na reexecução e recusou colisões. O bundle de
produção foi examinado após o build e não contém a rota, os dados de
provisionamento ou a senha fictícia. As instruções de uso ficam em
ARQUITETURA.md.

A Etapa 09 encerra o escopo técnico de conta e contextos do protótipo.
Permanecem as limitações da persistência simulada, da concorrência
e da distinção entre sessões sucessivas da mesma conta. RNF003,
autorização por modalidade, prontidão e proteção de registros de
negócio seguem pendentes. O versionamento de 09.6 e 09.7 aguarda
autorização.
