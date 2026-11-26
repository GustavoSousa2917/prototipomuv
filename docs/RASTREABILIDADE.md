# Matriz inicial de rastreabilidade

Todas as rotas são propostas. Implementação e validação executável: não iniciadas em todas as linhas. Requisitos novos não recebem IDs definitivos até revisão da documentação.

| Referências | Perfil | Fluxo | Telas | Rota proposta | Teste de aceitação futuro |
|---|---|---|---|---|---|
| RF001, RU001, US-001, RN002 | Todos | Conta e login | T02–T06,A23 | /login, /cadastro, /conta | CPF/e-mail duplicado, alternância legítima |
| RF002, RU008,RU012,US-016,RN004 | Prestador/admin | Autorização | T03,T06,T39,A20 | /prestador/autorizacoes, /admin/autorizacoes | Aprovação independente, rejeição justificada |
| RF003,RU009,US-010,RN005 | Gestor/motorista | Vínculo | T28,T29,A21 | /prestador/motoristas | Aceite, verificação por organização |
| RF004,RU009,US-009,RN012 | Prestador | Veículos | T20,T23,T24,A26 | /prestador/veiculos | Placa duplicada, capacidade, inativação |
| RF005,RU002,US-002 | Cliente | Pesquisa | T08,T09,A01,A02 | /cliente/prestadores | Apenas elegíveis, filtros e estado vazio |
| US-003,RN001,RN006–008 (RF a formalizar) | Cliente | Criar/encerrar | T07,A03–A05 | /cliente/solicitar, /cliente/solicitacoes/:id | Campos por modalidade e encerramento |
| RF006,RU010,US-006 | Prestador | Consultar solicitações | T25,T26,A06 | /prestador/solicitacoes | Direcionadas isoladas |
| RF007,RN009,US-007,RU010 | Prestador | Propostas | T25,T27,A07,A08 | /prestador/solicitacoes/:id | Autorização, proposta única, contraproposta justificada |
| DEC-003.6–15 (RF a formalizar) | Prestador/cliente | Tarifas | A25,T08 | /prestador/tarifas | Mínimo, km e categoria; estimativa individual |
| RF008,RN010,RU003,US-008 | Cliente | Contratação | T12–T14 | /cliente/solicitacoes/:id/propostas | Apenas um aceite, criar frete |
| RF009,RN011–013,US-011,RU011 | Prestador | Designação e substituição | T30,T31,A15,A16 | /prestador/fretes/:id | Recursos aptos, acordo e bloqueios |
| RF010,RN015,US-012,RU011 | Motorista/gestor | Execução | T32–T34,A09–A14 | /motorista/fretes/:id, /prestador/fretes/:id | Transições válidas, ocorrência não interrompe |
| RF011,RN014,RU005,US-005 | Cliente/prestador | Cancelar | T15 | /cliente/fretes/:id, /prestador/fretes/:id | Justificativa, somente pré-início |
| RF012,RN016,US-013 | Motorista | Concluir | T35,T36 | /motorista/fretes/:id | Dados de recebedor, sem confirmação do cliente |
| RF013,US-004,RU004 | Envolvidos | Notificações | T16 | /notificacoes | Destinatários, leitura e links autorizados |
| RF014,RN017,RU006,US-014 | Envolvidos | Histórico | T17 | /cliente/historico, /prestador/historico | Isolamento, filtros, linha do tempo |
| RF015 | Prestador/motorista | Achados e perdidos | T37,T38,A22 | /prestador/achados-perdidos, /motorista/achados-perdidos | Foto, data, veículo e devolução |
| US-015,RU012 (RF a formalizar) | Cliente/prestador/admin | Contestação | A17–A19 | /admin/contestacoes, detalhes do frete | Uma por concluído, sem mudar estado |
| DEC-035.1–4 (RF a formalizar) | Cliente | Avaliação | Nova | /cliente/fretes/:id | Uma por concluído, média correta |
| RNF001–004 | Todos | Transversal | Todas,A24 | Todas | Responsividade, desempenho, limites de segurança e disponibilidade |
