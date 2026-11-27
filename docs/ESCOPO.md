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

## Fora do MVP
Pagamentos, carteira, comissões, multas/reembolsos automáticos, GPS em tempo real, chat, WhatsApp, notificações externas, pacotes turísticos, roteiros prontos, agenda completa, tarifação dinâmica, indicadores financeiros avançados, favoritos, cupons, substituição do autônomo, sucessivas contrapropostas, múltiplas paradas e ida/volta.

## Arquitetura
React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React; Context API, serviços e repositórios simulados, LocalStorage. Regras de domínio centralizadas (State, Strategy e Observer simplificados); futura integração Java/Spring Boot/PostgreSQL. Não implementar backend real nesta fase. Controle de acesso e histórico no frontend são simulações, não garantias de segurança ou imutabilidade de produção.

## Referências e precedência
Decisões aprovadas > requisitos e regras > histórias > diagramas de atividades > classes > capturas > boas práticas. PDF de 38 páginas, versão 1.0, e prototipo.zip. Divergências devem ser registradas, nunca corrigidas silenciosamente.
