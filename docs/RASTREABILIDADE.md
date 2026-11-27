# Matriz inicial de rastreabilidade

As rotas abaixo são referências de planejamento. A linha de RF001, RU001 e US-001 registra a validação funcional no escopo demonstrativo da Etapa 08. As demais linhas orientam testes de aceitação futuros. Requisitos novos não recebem IDs definitivos até revisão da documentação.

| Referências | Perfil | Fluxo | Telas | Rota proposta | Teste de aceitação futuro |
|---|---|---|---|---|---|
| RF001, RU001, US-001, RN002, DEC-039 | Todos | RF001, RU001 e US-001 atendidos no escopo demonstrativo da Etapa 08. | T02–T05 (T06 parcialmente implementada, A23 implementada na Etapa 09.5) | /login, /cadastro, /recuperar-senha, /redefinir-senha | Cadastro, login, recarga da sessão, logout, recuperação e redefinição por token verificados. |
| RN002, DEC-001.1–5, DEC-040 | Conta comum/admin | Contexto cliente automático, administração exclusiva, sessão e seleção por aba (09.1–09.2) | T06 | /cliente, /admin | Conta nova e legada, seleção revalidada e sincronização de sessão verificadas. Alternância e guardas em 09.3–09.4. Conta canônica em 09.5. |
| RF002, RU008,RU012,US-016,RN004, DEC-041, DEC-042 | Prestador/admin | RF002 parcialmente implementado. Cadastros autônomo e organizacional, responsabilidade e contextos de preparação. Regiões e autorização pendentes. | T03,T06,T39,A20 | /prestador/autonomo/cadastro, /prestador/autonomo/perfil, /prestador/empresa/perfil, /prestador/cooperativa/perfil | Titularidade, CNH e CNPJ únicos, seleção explícita e ausência de autorização automática. |
| RF003,RU009,US-010,RN005 | Gestor/motorista | Vínculo | T28,T29,A21 | /prestador/motoristas | Aceite, verificação por organização |
| RF004,RU009,US-009,RN012 | Prestador | Veículos | T20,T23,T24,A26 | /prestador/veiculos | Placa duplicada, capacidade, inativação |
| RF005,RU002,US-002 | Cliente | Pesquisa | T08,T09,A01,A02 | /cliente/prestadores | Compatibilidade por modalidade, região e condições; apenas elegíveis, filtros e estado vazio |
| US-003,RN001,RN006–008,DEC-038 (RF a formalizar) | Cliente | Criar e encerrar solicitação direcionada | T07,A03,A05 | /cliente/solicitar, /cliente/solicitacoes/:id | Prestador único antes do envio, encerramento após recusa, nova solicitação com histórico preservado, bloqueio de simultaneidade e ausência de reenvio automático |
| RF006,RU010,US-006 | Prestador | Consultar solicitações direcionadas | T25,T26,A06 | /prestador/solicitacoes | Somente solicitações destinadas ao prestador; incluir as que aguardam resposta |
| RF007,RN009,US-007,RU010 | Prestador | Propostas | T25,T27,A07,A08 | /prestador/solicitacoes/:id | Autorização, resposta exclusiva do prestador escolhido, concordância, contraproposta justificada ou recusa |
| DEC-003.6, DEC-003.9, DEC-003.15, DEC-038.3 (RF a formalizar) | Prestador/cliente | Tarifas | A25,T08 | /prestador/tarifas | Mínimo, km e categoria; tarifas do prestador selecionado |
| RF008,RN010,RU003,US-008 | Cliente | Contratação | T12,T14 | /cliente/solicitacoes/:id/propostas | Confirmar uma vez e criar um frete, ou recusar e encerrar a solicitação |
| RF009,RN011–013,US-011,RU011 | Prestador | Designação e substituição | T30,T31,A15,A16 | /prestador/fretes/:id | Recursos aptos, acordo e bloqueios |
| RF010,RN015,US-012,RU011 | Motorista/gestor | Execução | T32–T34,A09–A14 | /motorista/fretes/:id, /prestador/fretes/:id | Transições válidas, ocorrência não interrompe |
| RF011,RN014,RU005,US-005 | Cliente/prestador | Cancelar | T15 | /cliente/fretes/:id, /prestador/fretes/:id | Justificativa, somente pré-início |
| RF012,RN016,US-013 | Motorista | Concluir | T35,T36 | /motorista/fretes/:id | Dados de recebedor, sem confirmação do cliente |
| RF013,US-004,RU004 | Envolvidos | Notificações | T16 | /notificacoes | Destinatários, leitura e links autorizados |
| RF014,RN017,RU006,US-014 | Envolvidos | Histórico | T17 | /cliente/historico, /prestador/historico | Isolamento, filtros, linha do tempo |
| RF015 | Prestador/motorista | Achados e perdidos | T37,T38,A22 | /prestador/achados-perdidos, /motorista/achados-perdidos | Foto, data, veículo e devolução |
| US-015,RU012 (RF a formalizar) | Cliente/prestador/admin | Contestação | A17–A19 | /admin/contestacoes, detalhes do frete | Uma por concluído, sem mudar estado |
| DEC-035.1–4 (RF a formalizar) | Cliente | Avaliação | Nova | /cliente/fretes/:id | Uma por concluído, média correta |
| DEC-040.10 (P09-10), RN002 | Conta comum/admin | Consulta e edição de nome e telefone da própria conta | T06,A23 | /conta | Retorno após login, preservação de dados e atualização da identidade entre abas. |
| DEC-040.1–10, RN002 | Conta comum/admin | Conta única, cadastro compartilhado, cliente automático, alternância sem novo login, administração exclusiva e navegação por sessão no protótipo | T03,T06,A23,A24 | /, /conta e ambientes protegidos | Contexto ativo por aba, retorno interno, restrição comercial da administração e edição da própria conta. |
| DEC-040.4–11 | Todos | Alternância, guardas e controle demonstrativo | T06,A24 | /cliente, /prestador, /motorista, /admin | Contexto ativo, retorno interno, 403/404 e política de escopo isolada. |
| RNF001–004 | Todos | Transversal | Todas,A24 | Todas | Responsividade, desempenho, limites de segurança e disponibilidade |

## Divergências com o PDF original após a DEC-038

Referência preservada: Documento - Figma, Modelos e Arquitetura do
Software, versão 1.0, 38 páginas. Os IDs abaixo continuam sendo usados
para rastreabilidade. A revisão do PDF permanece pendente.

| Referência original | Divergência e leitura vigente |
|---|---|
| US-003 (p. 6), US-006 e US-007 (pp. 8–9) | A publicação aberta, o painel de oportunidades e propostas de vários prestadores dão lugar ao envio a um prestador e à consulta das solicitações recebidas por ele. A possibilidade de responder enquanto a solicitação está pendente continua sujeita à autorização. |
| US-008 (p. 9), RN010 (p. 17), RU003 (p. 18), RF008 (p. 19) | A comparação de propostas da mesma solicitação dá lugar à confirmação ou recusa das condições do prestador previamente selecionado. Continua valendo a confirmação única do frete. |
| RU010 (p. 18), RF006 e RF007 (p. 19) | O painel aberto é descontinuado. A restrição original do RF007 ao prestador escolhido passa a valer para todas as solicitações. RF005 e RU002 permanecem alinhados à pesquisa por modalidade e região, complementada pela compatibilidade com o serviço. |
| Diagramas de atividades RF006–RF008 (pp. 31–32) | Retirar a busca no painel aberto e a comparação de propostas. Representar concordância, contraproposta ou recusa do destinatário, decisão final do cliente e encerramento por recusa. O diagrama RF005 (p. 30) já prevê iniciar solicitação direcionada. |
| Diagrama de classes e seção 10.5 (pp. 22–24), módulo de solicitações (p. 37) | Revisar o modelo que permite solicitação sem prestador definido e propostas de vários prestadores. Cada solicitação encaminhada tem um único destinatário, com histórico preservado em novas tentativas. O critério técnico para correlacionar as tentativas permanece pendente. |
