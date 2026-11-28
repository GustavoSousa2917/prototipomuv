# Matriz inicial de rastreabilidade

As rotas abaixo são referências de planejamento. A linha de RF001, RU001 e US-001 registra a validação funcional no escopo demonstrativo da Etapa 08. As demais linhas orientam testes de aceitação futuros. Requisitos novos não recebem IDs definitivos até revisão da documentação.

| Referências | Perfil | Fluxo | Telas | Rota proposta | Teste de aceitação futuro |
|---|---|---|---|---|---|
| RF001, RU001, US-001, RN002, DEC-039 | Todos | RF001, RU001 e US-001 atendidos no escopo demonstrativo da Etapa 08. | T02–T05 (T06 parcialmente implementada, A23 implementada na Etapa 09.5) | /login, /cadastro, /recuperar-senha, /redefinir-senha | Cadastro, login, recarga da sessão, logout, recuperação e redefinição por token verificados. |
| RN002, DEC-001.1–5, DEC-040 | Conta comum/admin | Contexto cliente automático, administração exclusiva, sessão e seleção por aba (09.1–09.2) | T06 | /cliente, /admin | Conta nova e legada, seleção revalidada e sincronização de sessão verificadas. Alternância e guardas em 09.3–09.4. Conta canônica em 09.5. |
| RF002, RU008,RU012,US-016,RN004, DEC-041, DEC-042, DEC-043, DEC-044 | Prestador/admin | RF002 parcialmente implementado. Cadastros autônomo e organizacional, responsabilidade e contextos de preparação. Regiões por modalidade entregues em 11.1–11.2. Solicitação, análise e histórico demonstrativos em 11.3–11.5. Fluxo integrado validado em 11.6. Notificações ainda pendentes em IN-014. | T03,T06,T39,A20 | /prestador/autonomo/cadastro, /prestador/autonomo/perfil, /prestador/empresa/perfil, /prestador/cooperativa/perfil e `/prestador/{autonomo,empresa,cooperativa}/perfil/regioes` | Titularidade, CNH e CNPJ únicos, seleção explícita e ausência de autorização automática. Unicidade, escopo e preservação da cobertura por modalidade. A linha de autorizações detalha a entrega. |
| RF002, US-016, RN004, RU008, RU012, DEC-044 | Prestador/admin | Solicitação, pré-requisitos, análise com ciência de diferenças, decisão, histórico e reenvio. | T06,T39 | /prestador/{autonomo,empresa,cooperativa}/autorizacoes, /admin/autorizacoes e /admin/autorizacoes/:id | Jornadas 1–6 de 11.6 e evidências de concorrência de 11.1–11.5. Independência, escopo, retrato imutável, confirmação, intenção protegida e decisão única. |
| RF003,RU009,US-010,RN005,RN012,DEC-045,DEC-046,DEC-047 | Gestor/motorista | RF003 parcial. Perfil compartilhado, convites, vínculos, verificação e encerramento demonstrativos entregues. Validação integrada concluída em 12.7. Critérios operacionais pendentes. | T28,T29,A21 | /conta/motorista, /conta/motorista/convites, /prestador/{empresa,cooperativa}/motoristas/:linkId e /conta/motorista/vinculos | Titularidade, aceite atômico, isolamento, verificação, histórico e encerramento. |
| RF004,RU009,US-009,DEC-019,DEC-048 | Prestador | Gerenciamento cadastral demonstrativo, com capacidades, correção de placa, histórico, inativação e reativação. Validação integrada em 13.5. | T19,T20,T23,T24,A26 | /prestador/{autonomo,empresa,cooperativa}/veiculos | Jornadas A–F de 13.5. Disponibilidade, compatibilidade e designação pendentes. |
| RF005,RU002,US-002 | Cliente | Pesquisa pendente. A DEC-043 define a unidade territorial. A Etapa 11 prepara cobertura e situação administrativa. Compatibilidade segue em IN-017. | T08,T09,A01,A02 | /cliente/prestadores | Compatibilidade por modalidade, região e condições; apenas elegíveis, filtros e estado vazio |
| US-003,RN001,RN006–008,DEC-038 (RF a formalizar) | Cliente | Criar e encerrar solicitação direcionada | T07,A03,A05 | /cliente/solicitar, /cliente/solicitacoes/:id | Prestador único antes do envio, encerramento após recusa, nova solicitação com histórico preservado, bloqueio de simultaneidade e ausência de reenvio automático |
| RF006,RU010,US-006 | Prestador | Consultar solicitações direcionadas | T25,T26,A06 | /prestador/solicitacoes | Somente solicitações destinadas ao prestador; incluir as que aguardam resposta |
| RF007,RN009,US-007,RU010 | Prestador | Propostas | T25,T27,A07,A08 | /prestador/solicitacoes/:id | Autorização, resposta exclusiva do prestador escolhido, concordância, contraproposta justificada ou recusa |
| DEC-003.2, DEC-003.6, DEC-003.9, DEC-003.14, DEC-003.15, DEC-038.3, DEC-049 | Prestador | Tarifas próprias e simulação manual entregues em 14.1–14.4. Seleção comercial pendente. | A25,T19,T20,T08 | /prestador/{autonomo,empresa,cooperativa}/tarifas | Jornadas A–F de 14.5 e evidências isoladas e concorrentes de 14.1–14.4. RF a formalizar em IN-004. |
| RF008,RN010,RU003,US-008 | Cliente | Contratação | T12,T14 | /cliente/solicitacoes/:id/propostas | Confirmar uma vez e criar um frete, ou recusar e encerrar a solicitação |
| RF009,RN011–013,US-011,RU011 | Prestador | Designação e substituição pendentes. Capacidades cadastrais da Etapa 13 são insumos futuros. | T30,T31,A15,A16 | /prestador/fretes/:id | Recursos aptos, acordo e bloqueios |
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
| RNF003 | Todos | Segurança demonstrativa. Garantias de produção dependem do backend. | A24 | Rotas protegidas | Jornada 6 validou o escopo demonstrativo nos serviços e nas rotas. |
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

## Adaptações da Etapa 11 ao PDF e ao Figma

| Referência original | Leitura vigente |
|---|---|
| `RegiaoAtuacao` (pp. 22–23) e T06/A20 | A cobertura passa de região compartilhada por prestador para municípios do catálogo local do IBGE por prestador e modalidade, conforme DEC-043. Endereço cadastral continua independente. |
| `AutorizacaoModalidade` (pp. 22–24), RN004 e US-016 | Cada tentativa usa uma modalidade individual. A DEC-044 detalha retrato, histórico, reenvio e ciência das diferenças. A aprovação registra situação administrativa e a prontidão segue separada. |
| Atividade RF002 (p. 28), T06 e T39 | O fluxo demonstrativo permite solicitar, analisar, decidir e consultar o histórico. As notificações previstas na atividade seguem em IN-014. Veículo e verificação documental ilustrados nas capturas ficam fora dos pré-requisitos do incremento. |
| RF005 (pp. 19 e 30) | Município e modalidade estruturam os dados da Etapa 11. A pesquisa ainda está pendente, assim como os critérios de origem, destino e trajetos em IN-017. |

## Adaptações da Etapa 12 ao PDF e ao Figma

A DEC-045 adapta o Motorista do diagrama de classes (pp. 22–23), a
atividade RF003 (p. 29) e T28–T29. O perfil exige conta pessoal e
é mantido pelo titular. O cadastro direto pelo gestor, associação
opcional à conta e campos pessoais duplicados das fontes originais
ficam fora desse fluxo. DEC-020 continua vigente para os vínculos.

### Convites e vínculos na DEC-046

US-010, RN005, RN012, RU009 e RF003 têm cobertura ampliada por convites simulados, equipe por organização, aceite explícito e vínculos simultâneos. RF003 permanece parcial. As adaptações em relação ao modelo Motorista/VinculoMotorista, à atividade RF003 e a T28–T29 separam perfil pessoal, convite, vínculo e verificação. A DEC-046 introduz a caixa interna e cria o vínculo somente após aceite, em lugar de cadastro e associação diretos pelo gestor. A21, verificação independente e encerramento seguem pendentes. RF002 segue parcial.

A revisão do PDF confirmou que US-010 inclui empresas e cooperativas; RN005, RU009, RF003 e a atividade descrevem o gestor empresarial cadastrando e verificando. RN012 trata de aptidão para execução e compatibilidade dos recursos, etapas posteriores ao aceite. O diagrama já admite cardinalidade muitos-para-muitos em VinculoMotorista e associa dados de verificação ao vínculo. No Figma, as capturas 52–53 mostram busca por CPF ou e-mail, dados pessoais do resultado e vinculação direta; as 54–55 mostram cadastro e senha pelo gestor. A DEC-046 adota e-mail exato, resposta genérica e caixa própria; o cadastro e as credenciais permanecem com o titular conforme DEC-045.

### DEC-047 e A21

US-010, RN005, RU009 e RF003 ganham verificação simulada e encerramento com histórico. RF003 permanece parcial diante das diferenças do cadastro no original e da validação operacional pendente. RN012 depende de critérios futuros de aptidão e compatibilidade. A21 foi atendida com detalhe do vínculo por organização e consulta pelo motorista.

O PDF e a atividade RF003 concentram cadastro e verificação no gestor; o modelo associa situação de verificação ao vínculo e registra responsável e data. As DEC-045 a DEC-047 mantêm o perfil nas mãos do titular e registram análises em histórico separado, com confirmação da revisão, rejeição fundamentada e encerramento sem reativação. T28–T29 mostram busca com dados pessoais e cadastro direto pelo gestor, enquanto o fluxo aprovado mantém convites, habilitação do titular e acesso organizacional restrito. RF002 continua parcial, RF005 e RNF003 seguem pendentes.

### Validação integrada da Etapa 12

- **US-010, RN005, RU009 e RF003.** Cobertura demonstrativa de identidade profissional, convites, vínculos, verificações independentes e encerramento. RF003 permanece parcial. O cadastro direto pelo gestor e a vinculação direta mostrados nas fontes originais foram substituídos pela habilitação do titular e pelo aceite. A21 materializa a análise e o encerramento com histórico; T28 e T29 seguem implementadas com as adaptações registradas na DEC-045 a DEC-047.
- **DEC-020 e DEC-045 a DEC-047.** A conta mantém uma habilitação compartilhada; a atuação autônoma conserva identidade própria. O convite pode ser aceito com CNH vencida, enquanto a aprovação da verificação exige vigência. O encerramento retira o contexto, mantém os históricos pertinentes e permite outro vínculo por novo aceite.
- **RF002 e IN-017.** A edição de habilitação chega à comparação administrativa, preservando o ID autônomo, as regiões e o retrato já registrado. RF002 segue parcial e a compatibilidade territorial permanece pendente.
- **RN012, RF009 e US-011.** A verificação não concede aptidão, disponibilidade ou compatibilidade operacional. Designação e substituição permanecem dependências futuras.
- **RNF003, IN-014 e IN-016.** A segurança permanece demonstrativa. As notificações gerais seguem pendentes. O convite interno exige conta existente e preserva as decisões concluídas; os casos sem conta e os códigos permanecem adiados.

### Veículos na DEC-048

US-009, RU009 e RF004 têm cobertura demonstrativa de cadastro, consulta, edição e inativação. RF004 ainda não cobre a disponibilização para designação indicada na atividade. RN007 e RN008 fundamentam os dados separados por modalidade, sem implementar solicitações. RN012, RF005, RF009 e US-011 dependem de compatibilidade, disponibilidade e seleção futuras. RF002 e RF003 permanecem parciais, RF005 e RNF003 pendentes.

O PDF (pp. 22–23) modela um prestador por veículo e capacidade de passageiros e carga. A atividade RF004 (p. 29) orienta consulta por responsável e rejeição de placa em outro veículo. A DEC-048 acrescenta tipo padronizado, volume útil obrigatório e dimensões úteis opcionais em trio. T24 marca Renavam como obrigatório e T20 mostra documentos, fotos e tarifas; ficam adiados. T20 explicita que o condutor fica fora da capacidade. T23 e A26 correspondem à lista e edição; T19 fornece a entrada de navegação. A interface separa situação cadastral de disponibilidade, ao contrário da apresentação combinada de T23.

### Validação integrada da Etapa 13

| Referências | Cobertura e evidência |
|---|---|
| US-009, RU009 e RF004 | Jornadas A–E validaram a gestão do veículo pelo responsável, com consulta, edição, capacidades, histórico de correção e transições cadastrais. A parcela de RU009 relativa a motoristas conserva a cobertura da Etapa 12. A disponibilização para designação na atividade RF004 segue pendente. |
| RN007 e RN008 | As jornadas A–C validaram dados distintos de capacidade. Quantidade de pessoas, bagagens e características dos volumes na solicitação seguem em incremento futuro. |
| DEC-019 e DEC-048 | Catálogo inicial padronizado, duas modalidades individuais, capacidades condicionais e preservação por inativação. Jornadas C–F verificaram independência da intenção, histórico, escopo e integridade. Fotos e conflitos entre fretes designados permanecem pendentes. |
| T19, T20, T23, T24 e A26 | A conferência direcionada das capturas originais confirmou T19 como referência de entrada e T20 como fonte dos campos de pessoas, excluindo o condutor. T23, T24 e A26 correspondem à frota, cadastro e edição adaptados. T24 apresenta Renavam, dimensões em metros e capacidade conforme o tipo. O fluxo aprovado adia Renavam, informa as dimensões em centímetros e condiciona os campos à modalidade. |
| RN012, RF005, RF009, US-011 e IN-005 | Capacidades são dados para integração futura. Busca, aptidão, disponibilidade, compatibilidade, designação e substituição continuam pendentes. |
| IN-009 | O veículo pode declarar Pessoas, Encomendas ou as duas modalidades individuais. A revisão documental de AMBOS e os critérios operacionais para transporte simultâneo permanecem pendentes. |

### Tarifas na DEC-049

DEC-003.2, .6, .9, .14 e .15 e DEC-038.3 sustentam a configuração e
o cálculo demonstrativo. T19 indica a entrada, T20 fundamenta mínimo
e preço por km, A25 materializa a gestão compartilhada e T08
permanece referência para comparação futura. A interface separa
Tarifas de Veículos. Hora, diária, franquia e pedágios ilustrados em
T20 ficam adiados. O PDF (pp. 22–24) modela os valores da proposta e
do frete, enquanto a estimativa reproduzível exige futuro retrato.

RF005–RF008 e as atividades das pp. 30–32 permanecem dependências
futuras de pesquisa, solicitação direcionada, negociação e
contratação, conforme a DEC-038. A entrega não formaliza novo RF.
IN-004 segue aberto. IN-005 e IN-017 mantêm pesquisa e compatibilidade
territorial pendentes. RF002 e RF003 permanecem parciais, RF004 tem
cobertura cadastral demonstrativa e RF009 e RNF003 seguem pendentes.

### Validação integrada da Etapa 14

| Referências | Cobertura e pendências |
|---|---|
| DEC-003.2, .6, .9 e .15, DEC-038.3 e DEC-049 | Jornadas A–D confirmaram identidade por prestador, modalidade e categoria, gestão cadastral, histórico, centavos inteiros e cálculo base com mínimo, distância ou empate. E–F confirmaram isolamento, independência dos cadastros e sincronização. DEC-003.14 preserva a escolha comercial da categoria pelo cliente para a implementação futura. |
| T08, T19, T20 e A25 | T08 ilustra estimativas, filtros e mapa na pesquisa do cliente. T19 orienta a navegação do prestador. T20 reúne veículo, mínimo, preço por km, hora, diária, franquia e indicação de pedágios. A25 cobre gestão e simulação de tarifa própria em área separada. Os demais componentes e a pesquisa com estimativas permanecem pendentes. |
| RF005–RF008, US-002, US-003, US-006–008 e RN009–010 | O PDF (requisitos na p. 19 e atividades nas pp. 30–32) fundamenta a pesquisa e modela o painel aberto e a comparação de propostas. A DEC-038 mantém a pesquisa antes do envio e estabelece um único destinatário com concordância, contraproposta justificada ou recusa. Busca, envio, negociação, confirmação e retratos comerciais continuam pendentes. |
| IN-004, IN-005 e IN-017 | IN-004 permanece aberto para formalização documental da gestão tarifária. IN-005 e IN-017 continuam pendentes para busca, compatibilidade e cobertura territorial aplicável. |
| RF002–RF004, RF009 e RNF003 | RF002 e RF003 continuam parciais. RF004 preserva cobertura cadastral demonstrativa. Designação e segurança de produção continuam pendentes. |

### Diagnóstico cadastral na DEC-050

DEC-018, DEC-021 e DEC-040–049 sustentam a separação entre acesso,
autorização e fontes de preparação. O diagnóstico privado usa
cadastro, intenção, autorização, regiões, habilitação, equipe,
frota e tarifas. T06 e T39 aproximam autorização, documentos e
oferta, enquanto a DEC-044 preserva as condições de preparação
em módulos próprios. T19 ilustra estado online, T23 aproxima frota
e disponibilidade, e T28–T29 mostram vinculação e cadastro diretos.
As DEC-019 e DEC-045–048 separam esses conceitos e preservam o aceite
e a verificação no vínculo. T20 contribui com veículo e tarifa.

RF002 e RF003 mantêm cobertura parcial. RF004 preserva cobertura
cadastral demonstrativa. RF005–RF009 e RNF003 permanecem pendentes.
RN012 e US-011 (PDF pp. 11–12 e 17, atividade RF009 na p. 33)
continuam dependentes de compatibilidade e critérios operacionais.
RU009, US-009, US-010 e US-016 rastreiam fontes cadastrais das pp.
10–11, 16 e 18. O diagnóstico deriva da DEC-050 sem atribuir um novo
RF. IN-004 segue aberto, IN-005 e IN-017 continuam pendentes e
IN-009, IN-014 e IN-016 conservam a cobertura vigente.

#### Validação integrada da Etapa 15.5

| Referências | Cobertura verificada |
|---|---|
| DEC-018–024, DEC-043–044, RF002 e US-016 | A preparação e a autorização continuam distintas. Perda de região, recursos ou intenção altera a avaliação derivada e preserva decisões e retratos administrativos. RF002 segue parcial. |
| DEC-045–047, RU009, RF003 e US-010 | Identidade compartilhada, vínculos e verificações forneceram os fatos profissionais. O diagnóstico exige critérios reunidos na mesma pessoa e no mesmo vínculo. RF003 segue parcial. |
| DEC-048–050, RU009, RF004 e US-009 | A correspondência de veículo e tarifa por modalidade e categoria é cadastral. RF004 mantém cobertura cadastral demonstrativa. T06, T19–20, T23, T28–29 e T39 continuam referências das áreas de origem. |
| DEC-038, RN012, US-011, RF005–RF009 e RNF003 | Busca, critérios operacionais, elegibilidade comercial, designação e segurança de produção permanecem pendentes. A DEC-050 fundamenta o diagnóstico sem criar um RF específico. |
| IN-004, IN-005, IN-009, IN-014, IN-016 e IN-017 | IN-004 segue aberto. Busca e compatibilidade territorial continuam pendentes. A cobertura de modalidades, notificações e convites conserva os limites já registrados. |
