# Design System — MUV

**Versão:** 0.1.0  
**Situação:** Fundamentos visuais aprovados, implementação em andamento.

## 1. Objetivo

Padronizar a identidade visual e os componentes das interfaces do MUV, garantindo consistência, reutilização, acessibilidade e facilidade de manutenção.

## 2. Referência visual

O Design System utiliza como referência as capturas originais do protótipo desenvolvido no Figma.

A identidade visual existente deverá ser preservada, adaptando os conteúdos às regras de negócio aprovadas para o MVP.

## 3. Cores da marca

| Token | Hexadecimal |
|---|---|
| primary | #1D695B |
| primary-dark | #174F45 |
| primary-light | #E4F2ED |
| primary-soft | #CAE1D8 |

## 4. Cores neutras

| Token | Hexadecimal |
|---|---|
| background | #F5F7F8 |
| surface | #FFFFFF |
| foreground | #233135 |
| muted | #637378 |
| border | #DEE6E7 |
| input | #F5F7F8 |
| disabled | #B0B8BB |

## 5. Cores semânticas

| Estado | Texto | Fundo |
|---|---|---|
| Sucesso | #1D695B | #E4F2ED |
| Atenção | #93601E | #FFF3DE |
| Erro | #AF4646 | #FCEDED |
| Informação | #315F94 | #E9F1FA |
| Neutro | #606F74 | #EEF3F4 |

Os estados deverão ser comunicados por textos e, quando pertinente, ícones, evitando depender exclusivamente das cores.

## 6. Tipografia

Família tipográfica: Inter Variable.

Fonte alternativa: Arial, sans-serif.

| Token | Tamanho | Peso |
|---|---:|---:|
| Display | 48 px | 700 |
| H1 | 32 px | 700 |
| H2 | 24 px | 600 |
| H3 | 20 px | 600 |
| H4 | 16 px | 600 |
| Body | 14 px | 400 |
| Label | 13 px | 500 |
| Small | 12 px | 400 |
| Caption | 11 px | 500 |

A família tipográfica exata do Figma não pôde ser confirmada. Inter foi aprovada como referência para o protótipo.

## 7. Espaçamentos

A escala utiliza uma unidade base de quatro pixels.

Valores de referência: 4, 8, 12, 16, 20, 24, 32, 40, 48 e 64 pixels.

## 8. Dimensões estruturais

| Elemento | Dimensão |
|---|---:|
| Cabeçalho | 80 px |
| Menu lateral | 232 px |
| Botão padrão | 44 px |
| Campo de formulário | 46 px |
| Ícone de navegação | 20 px |
| Símbolo da marca | 32 px |

## 9. Arredondamentos

| Elemento | Valor |
|---|---:|
| Inputs | 8 px |
| Botões | 8 px |
| Cards | 12 px |
| Painéis | 16 px |
| Modais | 16 px |
| Badges | Totalmente arredondados |
| Avatares | Circular |

## 10. Organização técnica

- src/styles/theme.css: tokens visuais.
- src/styles/base.css: estilos globais.
- src/index.css: integração dos estilos.
- src/components/ui/: componentes básicos.
- src/components/common/: componentes compartilhados.
- src/pages/dev/DesignSystemPage.tsx: demonstração visual.

## 11. Componentes planejados

Button, Input, Select, Textarea, Checkbox, RadioGroup, Card, Badge, Alert, Modal, ConfirmDialog, Tabs, DataTable, EmptyState, Loading, Pagination, Breadcrumb, Timeline, Logo, Avatar, PageHeader, NotificationBell, Sidebar e Header.

Os componentes serão implementados progressivamente conforme a necessidade.

## 12. Responsividade

As interfaces deverão adaptar-se a smartphones, tablets, notebooks e desktops.

Menus laterais poderão ser recolhidos em dispositivos menores. Formulários e conteúdos deverão adaptar sua distribuição sem comprometer as funcionalidades.

## 13. Acessibilidade

- Indicadores visíveis de foco.
- Navegação por teclado.
- Rótulos associados aos campos.
- Contraste adequado.
- Mensagens de erro compreensíveis.
- Estados identificados por texto.
- Respeito à preferência por movimento reduzido.

## 14. Logotipo

O formato original da marca deverá ser preservado.

A implementação definitiva depende da obtenção do arquivo vetorial original ou da validação de uma reprodução fiel.

## 15. Página de demonstração

Rota interna: /dev/design-system.

A página será utilizada para visualizar e validar os tokens e componentes antes de sua utilização nas interfaces funcionais.

## 16. Decisões aprovadas

Referência: DEC-037.1 a DEC-037.10.

## 17. Evolução

Qualquer alteração relevante nos padrões visuais deverá ser documentada e validada antes de sua aplicação generalizada.

## 18. Componentes implementados

| Componente | Localização | Responsabilidade |
|---|---|---|
| Logo | components/common/Logo.tsx | Identidade visual |
| Button | components/ui/Button.tsx | Ações e interações |
| Card | components/ui/Card.tsx | Superfícies e agrupamentos |
| Badge | components/ui/Badge.tsx | Indicadores de situação |

### Ajustes de acessibilidade

O token semântico neutral foi alterado de
#637378 para #606F74, proporcionando contraste
aproximado de 4,66:1 sobre o fundo neutral-light.

O token muted permanece inalterado.

### Logotipo

O logotipo foi reproduzido provisoriamente em SVG
com base nas capturas originais do Figma.

### Demonstração

Os componentes são apresentados na rota
/dev/design-system, através de CoreComponentsDemo.

A validação visual e funcional será registrada
após a execução dos testes.

## 19. Componentes de formulário

| Componente | Responsabilidade |
|---|---|
| FormField | Estrutura compartilhada dos campos |
| Input | Campos de entrada |
| Select | Seleção de opções |
| Textarea | Campos de texto extensos |

### Características

- Rótulos associados aos campos.
- Indicadores de obrigatoriedade.
- Mensagens de erro.
- Textos auxiliares.
- Suporte a propriedades nativas do HTML.
- Navegação por teclado.
- Estados desabilitados.
- Suporte a componentes controlados.
- Associação das mensagens aos campos por atributos ARIA.

### Separação de responsabilidades

Os componentes de formulário não implementam
regras de negócio específicas.

As validações de cadastro, contratação e demais
operações serão implementadas nos módulos
responsáveis.

### Demonstração

FormComponentsDemo, disponível na rota
/dev/design-system.

## 20. Componentes de seleção

| Componente | Responsabilidade |
|---|---|
| Checkbox | Seleção individual e múltipla |
| RadioGroup | Seleção exclusiva |

### Checkbox

- Seleção controlada ou não controlada.
- Rótulo associado ao campo.
- Descrição complementar.
- Mensagens de erro.
- Estado desabilitado.
- Suporte à navegação por teclado.

### RadioGroup

- Seleção exclusiva.
- Variante convencional.
- Variante em cards selecionáveis.
- Orientação vertical ou horizontal.
- Mensagens de validação.
- Agrupamento semântico com fieldset e legend.
- Suporte à navegação por teclado.

### Aplicação das regras do MUV

Prestadores e veículos podem atender a mais
de uma modalidade, respeitando as condições
e autorizações aplicáveis.

Cada solicitação de frete possui apenas uma
modalidade e um tipo de direcionamento.

### Demonstração

SelectionComponentsDemo, disponível na rota
/dev/design-system.

## 21. Componentes de feedback

| Componente | Responsabilidade |
|---|---|
| Alert | Comunicação de informações e resultados |
| Modal | Janelas de interação |
| ConfirmDialog | Confirmação de operações |

### Alert

- Variante success.
- Variante warning.
- Variante danger.
- Variante info.
- Ícones semânticos.
- Título opcional.
- Conteúdo personalizável.

### Modal

- Implementação com o elemento nativo dialog.
- Controle de abertura pelo estado da aplicação.
- Fundo escurecido.
- Fechamento por botão ou tecla Esc.
- Restrição do foco ao conteúdo modal.
- Retorno do foco ao elemento anterior.
- Conteúdo e rodapé personalizáveis.
- Tamanhos pequeno, médio e grande.
- Bloqueio de fechamento durante processamento.

### ConfirmDialog

- Reutilização do componente Modal.
- Variante principal.
- Variante de perigo.
- Confirmação explícita.
- Cancelamento da ação.
- Estado de processamento.
- Foco inicial na opção de voltar.

### Regras de utilização

Os componentes de feedback não executam
diretamente regras de negócio.

As operações deverão ser coordenadas pelos
serviços dos módulos responsáveis.

O fechamento por clique externo não será
habilitado inicialmente, evitando o descarte
acidental de informações.

### Demonstração

FeedbackComponentsDemo, disponível na rota
/dev/design-system.

Os dados e operações da demonstração são
exclusivamente fictícios.

## 22. Componentes compartilhados

| Componente | Responsabilidade |
|---|---|
| Avatar | Identificação visual de usuários |
| PageHeader | Padronização dos cabeçalhos |
| EmptyState | Apresentação da ausência de registros |
| Loading | Indicação de carregamento |

### Avatar

- Quatro tamanhos disponíveis.
- Geração automática de iniciais.
- Suporte a fotografias.
- Alternativa para imagens indisponíveis.
- Identificação acessível.

### PageHeader

- Título e descrição.
- Identificação contextual.
- Área de ações.
- Hierarquia semântica configurável.
- Organização responsiva.

### EmptyState

- Ícone personalizável.
- Título e descrição.
- Ação opcional.

### Loading

- Três tamanhos.
- Indicador animado.
- Apresentação vertical ou compacta.
- Mensagem personalizável.

## 23. Estados de interface

As interfaces de consulta devem distinguir:

- Carregamento.
- Ausência de registros.
- Erro.
- Dados disponíveis.

A responsabilidade pela consulta e persistência
dos dados pertence às camadas funcionais,
não aos componentes visuais.

### Demonstração

SharedComponentsDemo, disponível na rota
/dev/design-system.