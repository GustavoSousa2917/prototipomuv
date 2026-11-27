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

### Layouts planejados

- AuthLayout.
- ClientLayout.
- OperationalLayout.

As permissões de acesso serão tratadas
posteriormente pelo módulo de autenticação
e pelos mecanismos de proteção de rotas.

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
- /login
- /cadastro
- /termos-de-uso
- /privacidade

### Rotas de desenvolvimento

- /dev/environment
- /dev/design-system
- /teste

As rotas de desenvolvimento permanecem
independentes do layout público.

### Layouts planejados

- AuthLayout.
- ClientLayout.
- OperationalLayout.

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

A identificação do cliente utiliza dados fictícios.

A autenticação, a sessão, a persistência e as
permissões de acesso serão integradas posteriormente.