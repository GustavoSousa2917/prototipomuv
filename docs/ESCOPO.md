# Escopo do protótipo MUV

## Objetivo
Protótipo web responsivo, navegável e funcional para demonstração e validação de intermediação de fretes de pessoas e encomendas. Dados exclusivamente fictícios e interações integradas entre contas.

## Atores
- Cliente: solicitações, propostas, confirmação, acompanhamento, cancelamento anterior ao início, contestação e avaliação.
- Autônomo: perfil de prestador, autorizações, tarifas, veículos, propostas, designação do próprio veículo e execução.
- Gestor de empresa/cooperativa: gestão da organização, vínculos/verificações, frota, propostas, designação, ocorrências e acompanhamento.
- Motorista vinculado: convites, fretes designados e operações de execução autorizadas.
- Administrador: autorização separada por modalidade e acompanhamento de contestações; sem cadastro público.

## Incluído
Página institucional; cadastro, login e recuperação simulados; conta única e contextos de atuação; regiões; autorização independente por modalidade; veículos e motoristas; convites, vínculos e verificações; tarifas por categoria e modalidade; pesquisa de prestadores compatíveis; solicitações exclusivamente direcionadas a um prestador escolhido; valor base pelas tarifas desse prestador, concordância, contraproposta ou recusa do prestador e confirmação ou recusa pelo cliente; reaproveitamento dos dados após recusa com preservação do histórico; designação e substituição equivalente; alterações de acordo; sete estados do frete; execução, ocorrências, interrupção, retomada, cancelamento e conclusão por modalidade; notificações internas; histórico; contestações; achados e perdidos; avaliações e painéis operacionais.

A DEC-038 veda solicitações abertas, negociações simultâneas para a mesma necessidade de frete e encaminhamento automático a outros prestadores. Empresas e cooperativas mantêm a responsabilidade pela designação posterior de motorista e veículo.

## Recorte da Etapa 10

DEC-041 define a Etapa 10 como cadastros de prestadores. 10.1 e 10.2
entregam fundação e cadastro autônomo. 10.3 e 10.4 entregam empresas,
cooperativas e contextos organizacionais conforme DEC-042. A etapa
10.5 encerra a validação integrada desses cadastros no protótipo.
Autorização administrativa, documentos, regiões, veículos, tarifas e
prontidão seguem em módulos próprios.

## Fora do MVP
Pagamentos, carteira, comissões, multas/reembolsos automáticos, GPS em tempo real, chat, WhatsApp, notificações externas, pacotes turísticos, roteiros prontos, agenda completa, tarifação dinâmica, indicadores financeiros avançados, favoritos, cupons, substituição do autônomo, sucessivas contrapropostas, múltiplas paradas e ida/volta.

## Arquitetura
React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React; Context API, serviços e repositórios simulados, LocalStorage. Regras de domínio centralizadas (State, Strategy e Observer simplificados); futura integração Java/Spring Boot/PostgreSQL. Não implementar backend real nesta fase. Controle de acesso e histórico no frontend são simulações, não garantias de segurança ou imutabilidade de produção.

## Referências e precedência
Decisões aprovadas > requisitos e regras > histórias > diagramas de atividades > classes > capturas > boas práticas. PDF de 38 páginas, versão 1.0, e prototipo.zip. Divergências devem ser registradas, nunca corrigidas silenciosamente.

## Etapas 11.1 e 11.2

Preparação territorial por modalidade para autônomos, empresas e
cooperativas com cadastro e contexto válidos. Inclui catálogo nacional
local, consulta, inclusão e remoção de municípios e preservação da
cobertura fora da intenção vigente. A pesquisa de prestadores (RF005),
a compatibilidade territorial e a prontidão seguem em seus respectivos
incrementos.

## Etapas 11.3 a 11.5

Autorização administrativa independente por modalidade e prestador.
Inclui envio, análise, confirmação da aprovação, rejeição fundamentada,
reenvio e histórico demonstrativos. Permanecem pendentes notificações,
retirada, revogação, suspensão, recurso e efeitos operacionais.
A validação integrada de 11.6 confirmou o fluxo demonstrativo de
cadastros, regiões e autorizações. RF002 permanece parcial, inclusive
quanto às notificações. O próximo módulo planejado é motoristas e
vínculos organizacionais.

## Etapas 12.1 e 12.2

Identidade profissional própria da conta comum, cadastro e edição da
habilitação, projeção compartilhada no cadastro autônomo e transição
do legado com preservação das referências existentes. RF003 está
parcialmente implementado. Convites, vínculos, verificações e
notificações permanecem fora desta entrega.

## Etapas 12.3 e 12.4

Convites simulados para contas comuns existentes, caixa pessoal, recusa, cancelamento, aceite com criação de vínculo e seleção explícita do contexto correspondente. Empresas e cooperativas podem preparar equipes sem autorização administrativa aprovada. Verificação, encerramento e prontidão permanecem pendentes.

## Etapas 12.5 e 12.6

Verificação por vínculo ativo, nova análise, histórico imutável, comparação de habilitação e encerramento unilateral com histórico restrito. A verificação organizacional e a autorização administrativa são registros independentes. Aptidão, prontidão, designação e execução seguem pendentes.

## Etapa 12.7 — Encerramento funcional

A validação integrada encerra a Etapa 12 no escopo demonstrativo definido pelas DEC-045, DEC-046 e DEC-047. O módulo cobre identidade profissional compartilhada, convites, vínculos, verificações independentes e encerramento com histórico restrito. RF002 e RF003 mantêm cobertura parcial. Aptidão, disponibilidade, prontidão e operação de fretes permanecem pendentes. O próximo módulo planejado é veículos e capacidades.
