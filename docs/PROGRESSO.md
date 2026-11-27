# Progresso

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

Status: T01 implementada e validada no Chromium headless. Versionamento
pendente.

A página inicial reúne hero, públicos, benefícios, cinco passos,
exemplo de solicitação direcionada, seção de prestadores, seis perguntas
frequentes, banner final e rodapé. As cinco chamadas da página apontam
para o cadastro provisório. O rodapé identifica o caráter acadêmico e
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
