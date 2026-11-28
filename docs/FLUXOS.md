# Fluxos e regras centrais

## Conta e autorização
**Cadastro básico (08.1–08.2).** Informar nome, CPF, telefone,
e-mail, senha e confirmação → validar → selecionar uma finalidade
inicial → aceitar termos de uso e privacidade → criar a conta →
confirmar cadastro e oferecer acesso à página de login. Os links legais
do formulário abrem em outra aba. CPF é verificado estrutural e
matematicamente. O aceite indica a manifestação no protótipo.

**Login e sessão (08.3).** Informar e-mail e senha → verificar a
credencial → gravar a sessão → navegar para `/cliente`, que redireciona
para `/cliente/solicitar-frete`. Recarregar restaura a identidade se o
usuário ainda existir. Sair pelo menu da conta remove a sessão e
retorna a `/login`, com o cadastro preservado. Os ambientes protegidos encaminham visitantes ao login. O retorno
usa apenas um destino interno conhecido e passa novamente pela guarda.

**Contexto de atuação (09.1–09.2).** Contas comuns recebem
automaticamente o contexto cliente, inclusive as cadastradas antes
da Etapa 09. Contas com atribuição administrativa exclusiva iniciam
em `/admin`. A recarga restaura uma seleção válida da mesma conta na
mesma aba e, em caso contrário, utiliza um contexto permitido. Login,
logout e invalidação de sessão são refletidos nas demais abas. A
interface de troca é explícita e local à aba. Quando o destino exige
outro contexto disponível, a guarda oferece seleção. Quando falta
acesso, exibe 403 e preserva a URL. A rota `/prestador` reúne as
atuações profissionais da conta comum, com orientação para cadastro
futuro quando não existem atribuições.

**Minha conta (09.5).** A partir dos cabeçalhos autenticados ou de
`/conta`, a pessoa consulta os próprios dados e contextos. Visitantes
passam pelo login com retorno à página. Em **Editar dados**, nome e
telefone podem ser atualizados. Cancelar descarta o rascunho. Uma
gravação bem-sucedida volta à consulta com confirmação e atualiza o
nome e as iniciais sem novo login. A alternância usa a seleção explícita
já existente. CPF e e-mail são somente leitura.

**Navegação entre site e ambientes (09.6).** O cabeçalho público
apresenta os destinos de conta após resolver a sessão. **Acessar meu
ambiente** leva ao contexto ativo da aba. **Solicitar frete** envia
a conta comum à guarda de `/cliente`. **Oferecer serviços** leva a
`/prestador`, também acessível pelo cabeçalho cliente, onde a conta
escolhe uma atuação disponível ou recebe orientação. Uma conta
administrativa exclusiva vê atalhos para seu ambiente e sua conta.

**Fluxo posterior.** A intenção de oferecer serviços ou atuar como
motorista vinculado abre caminho para processos próprios. Autônomos e
organizações informam regiões e modalidade para análise administrativa.
Pendentes ou rejeitados podem preparar recursos e tarifas, e a oferta
depende de autorização. Rejeição justificada permite nova análise com
histórico preservado.

**Recuperação (08.4).** Em `/recuperar-senha`, informar o e-mail
cadastrado. A mensagem principal é genérica. Quando há conta, a caixa
demonstrativa exibe um link para `/redefinir-senha`, sem envio real.
O link dura 15 minutos e um novo pedido invalida os anteriores daquela
conta. A redefinição valida o link e as duas senhas, consome o token,
encerra a sessão da conta se houver e grava a nova credencial. O
sucesso oferece retorno ao login. Um link inválido ou consumido exige
nova solicitação.

## Recursos
Veículos ativos, capacidades reais, categoria, modalidade e disponibilidade; preservar histórico por inativação. Motorista compartilhado → convite simulado → aceite → vínculo ativo → verificação independente da organização. Designação requer recursos compatíveis e disponíveis, motorista apto e veículo pertencente ao prestador. Verificar conflitos básicos; duração e critério de sobreposição ainda precisam de definição.

## Solicitação direcionada

Dados e modalidade → categoria compatível → pesquisa de prestadores autorizados e compatíveis com a modalidade, a região e as condições → seleção de um único prestador → cálculo do valor base com as tarifas desse prestador → envio direcionado.

O valor base é o maior entre a tarifa mínima e a distância estimada multiplicada pela tarifa por quilômetro. A distância é simulada e a estimativa original é preservada. O prestador escolhido pode concordar com o valor base, apresentar contraproposta justificada ou recusar. Quando houver concordância ou contraproposta, o cliente confirma ou recusa a contratação. O aceite cria exatamente um frete. A contraproposta cabe ao prestador.

A recusa de qualquer parte encerra a solicitação correspondente. O cliente pode reaproveitar os dados para criar outra solicitação, selecionando outro prestador e preservando o histórico original. O cliente também pode encerrar uma solicitação antes da contratação. A DEC-038 veda publicação aberta, negociações simultâneas para a mesma necessidade e encaminhamento automático.

Empresas e cooperativas designam motorista e veículo depois da contratação. Solicitações direcionadas que aguardam resposta continuam disponíveis ao prestador escolhido.

## Frete contratado
| Estado | Ação | Próximo estado |
|---|---|---|
| AGUARDANDO_DESIGNACAO | Prestador designa recursos | PRONTO_INICIO |
| AGUARDANDO_DESIGNACAO / PRONTO_INICIO | Cliente ou prestador cancela com justificativa | CANCELADO |
| PRONTO_INICIO | Motorista inicia após validações | EM_EXECUCAO |
| EM_EXECUCAO | Motorista interrompe com justificativa | INTERROMPIDO |
| INTERROMPIDO | Motorista retoma após revalidação | EM_EXECUCAO |
| INTERROMPIDO | Motorista encerra com justificativa | ENCERRADO_SEM_CONCLUSAO |
| EM_EXECUCAO | Motorista registra conclusão | CONCLUIDO |

Ocorrência em execução/interrompido não muda estado; gestor pode registrar na própria organização. Autônomo é motorista responsável; sem substituição do profissional no MVP. Substituições equivalentes: registrar e notificar. Durante execução, interromper antes de substituições e alterações. Alterações de acordo: uma pendente, justificativa, cliente aceita/recusa; bloquear início/retomada enquanto pendente; preservar condições originais; modalidade e partes não mudam. Revalidar designações quando condições mudarem. Cancelamento apenas pré-início. Liberar recursos nos estados terminais. Encomendas: identificação nominal de quem recebeu e data/hora; documento opcional, sem prova fotográfica ou assinatura obrigatória. Não exigir confirmação da conclusão pelo cliente.

## Pós-serviço
Contestações: uma por frete concluído, cliente abre, prestador responde uma vez, cliente/admin encerra (admin justifica), frete permanece concluído. Sem prazo automático. Avaliação opcional de 1 a 5, uma por frete concluído, comentário opcional, independente da contestação. Achados e perdidos: registro com foto, data e veículo, frete opcional, estados EM_GUARDA e DEVOLVIDO, consulta restrita. Notificações internas por evento e destinatário; links sujeitos a permissões, leitura individual/coletiva. Histórico de atividades separado da linha do tempo operacional, sem edição via interface.

## Rotas propostas (não implementadas)
Público: /, /login, /cadastro, /recuperar-senha, /redefinir-senha. Compartilhadas: /conta, /notificacoes.
Cliente: /cliente/solicitar, /cliente/prestadores/:id (e listagem), /cliente/solicitacoes/:id (e listagem), /cliente/solicitacoes/:id/propostas, /cliente/fretes/:id (e listagem), /cliente/historico.
Prestador: /prestador, /prestador/solicitacoes/:id, /prestador/propostas, /prestador/fretes/:id, /prestador/veiculos/:id, /prestador/motoristas/:id (gestor), /prestador/perfil, /prestador/{autonomo,empresa,cooperativa}/tarifas, /prestador/autorizacoes, /prestador/achados-perdidos, /prestador/contestacoes, /prestador/historico; respectivas listagens.
Motorista: /motorista, /motorista/fretes/:id (e listagem), /motorista/achados-perdidos, /motorista/historico, vínculos em conta.
Admin: /admin, /admin/prestadores, /admin/autorizacoes/:id e /admin/contestacoes/:id, respectivas listagens.

## Cadastro autônomo (10.1–10.2)

Uma conta comum abre `/prestador` e inicia o cadastro em
`/prestador/autonomo/cadastro`. Os dados pessoais vêm da conta.
Após validação e gravação, o seletor oferece o contexto autônomo,
mantendo o contexto ativo. A conta pode continuar no ambiente atual
ou selecionar explicitamente o ambiente de preparação. Empresa e
cooperativa são apresentadas como entregas futuras.

A consulta e edição ficam em `/prestador/autonomo/perfil`, atrás
da guarda de contexto. Contas demonstrativas sem cadastro recebem
estado informativo. A edição preserva ID, titular e data de criação.
O cadastro registra intenção e disponibiliza acesso para preparação,
enquanto autorização, prontidão, elegibilidade e recebimento de
solicitações seguem pendentes.

## Empresas e cooperativas (10.3–10.4)

Uma conta comum abre `/prestador`, escolhe empresa ou cooperativa
e preenche o formulário compartilhado em `/prestador/empresa/cadastro`
ou `/prestador/cooperativa/cadastro`. A criação grava a organização e
a declaração de responsabilidade juntas. Um CNPJ em uso gera erro
sem expor dados do responsável. A confirmação oferece seleção
explícita do novo contexto ou permanência no contexto atual.

`/prestador/empresa/perfil` e `/prestador/cooperativa/perfil` usam
a organização ativa e permitem edição cadastral pelo responsável.
A conta seleciona outra organização pelo seletor. Um contexto
demonstrativo sem registro oferece orientação. Dados e nomes
atualizados são revalidados nas outras abas.

## Configurar regiões de atendimento

Selecionar contexto profissional → abrir o perfil operacional →
Gerenciar regiões de atendimento → escolher modalidade → selecionar
UF e município → adicionar. A remoção pede confirmação e pode deixar
a cobertura vazia. A rota usa o sufixo `/perfil/regioes` nos ambientes
de autônomo, empresa e cooperativa.

Ao retirar uma modalidade das intenções do cadastro, a cobertura
daquela modalidade continua disponível para consulta como regiões
preservadas. Restaurar a intenção reabilita inclusão e remoção. Este
fluxo é de preparação e independe da futura solicitação de autorização.

## Solicitar e decidir autorização por modalidade

Prestador com contexto válido → Autorizações → escolher a modalidade
no cartão correspondente → conferir intenção, cobertura e, para
autônomos, CNH vigente → solicitar. Uma modalidade pendente mantém
os dados enviados para consulta no histórico. A intenção da
modalidade pendente permanece exigida ao editar o cadastro.

Administração → Autorizações → filtrar tentativas → abrir detalhe →
comparar os dados submetidos e atuais. A aprovação requer confirmação,
requisitos vigentes e ciência das diferenças observadas, quando
pertinente. Se a projeção atual mudar antes de gravar, revisar a
nova versão. Para rejeitar, informar e confirmar a justificativa.

O prestador acompanha cada decisão e seu histórico no próprio contexto.
Após rejeição, pode atualizar dados e enviar nova tentativa, sujeita
aos mesmos pré-requisitos. Depois de aprovada, a decisão continua
consultável mesmo que a modalidade saia da intenção, a cobertura
fique vazia ou a CNH expire.

## Perfil profissional antes do vínculo

Em Minha conta, uma conta comum abre `/conta/motorista` para
cadastrar, consultar ou atualizar a habilitação. Os dados pessoais
são consultados na conta. Um autônomo existente já encontra sua
habilitação no perfil. Ao iniciar atuação autônoma com perfil
existente, informe as modalidades e atualize a CNH se estiver
vencida. A conclusão disponibiliza o contexto autônomo para
seleção explícita. Criar somente o perfil mantém os contextos
existentes. Se o formulário estiver desatualizado, revise os
dados atuais antes de editar novamente.

## Convites e vínculos

No contexto de empresa ou cooperativa, abra Motoristas e informe o e-mail exato da conta convidada. A lista reúne pendentes e históricos. Um pendente pode ser cancelado com confirmação. Após recusa ou cancelamento, outro convite pode ser enviado se o par estiver livre.

Em Minha conta, abra o perfil profissional e selecione Convites recebidos. A recusa admite conta sem perfil. Para aceitar, cadastre primeiro a habilitação, se necessário. Um perfil estruturalmente válido com CNH vencida ainda pode aceitar. O aceite cria vínculo, mantém a seleção corrente e disponibiliza novo contexto em Minha conta. O contexto selecionado identifica a organização em Motorista → Vínculos.

### Verificação e encerramento

A organização abre o vínculo em Motoristas, consulta habilitação e histórico e confirma a aprovação ou registra rejeição fundamentada. Nova análise usa os dados correntes; o vencimento bloqueia nova aprovação. O motorista consulta e pode encerrar pelo contexto vinculado ou pelo histórico em Perfil profissional → Meus vínculos.

O encerramento exige justificativa e retira o contexto vinculado, mantendo a sessão e o histórico de ambas as partes. Na organização, os dados disponíveis passam a ser os registros históricos. Novo convite inicia outro vínculo após aceite, com verificação pendente.

### Gerenciamento de veículos

No contexto do prestador, abra Veículos para listar, filtrar e cadastrar. Informe as modalidades e suas capacidades; passageiros excluem o condutor. A declaração pode divergir da intenção do prestador. Desmarcar modalidade preserva o bloco anterior para eventual restauração. A edição de placa exige confirmação; inativação e reativação preservam placa atual, dados e histórico. A situação ativa é cadastral.

### Gerenciamento de tarifas

No contexto do prestador, abra Tarifas para cadastrar, filtrar,
consultar e editar. Selecione modalidade e categoria uma vez no
cadastro e informe o mínimo e o preço por km. Inativação e reativação
exigem confirmação e preservam a combinação. O detalhe registra
autoria, valores e transições. As indicações de intenção e frota são
complementares. No detalhe de uma tarifa ativa, informe distância
em quilômetros e simule o valor base. O cálculo fica na interface
e independe do fluxo de solicitação direcionada.

### Diagnóstico cadastral de prontidão

Selecione o contexto de titular ou responsável e abra Prontidão.
Consulte autorização e condição cadastral por modalidade. Cada
categoria mostra a correspondência entre veículo e tarifa e o
resultado completo, com motivos conhecidos e informação indisponível.
Os links levam aos módulos de origem. A avaliação é atualizada pelos
eventos pertinentes, pelo horário local e pela ação de atualização.
A preparação cadastral preserva as decisões e os registros de origem.
