# Fluxos e regras centrais

## Conta e autorização
Cadastro único (nome, CPF, telefone, e-mail, senha; confirmação como validação) → cliente por padrão → opção de oferecer serviços → perfil autônomo ou organização → regiões e modalidade → análise administrativa independente por modalidade. Pendentes/rejeitados podem preparar recursos e tarifas, mas não oferecer serviços na modalidade. Rejeição justificada permite nova análise, mantendo histórico. Campos adicionais de cadastro ficam sujeitos a detalhamento.

## Recursos
Veículos ativos, capacidades reais, categoria, modalidade e disponibilidade; preservar histórico por inativação. Motorista compartilhado → convite simulado → aceite → vínculo ativo → verificação independente da organização. Designação requer recursos compatíveis e disponíveis, motorista apto e veículo pertencente ao prestador. Verificar conflitos básicos; duração e critério de sobreposição ainda precisam de definição.

## Solicitação direcionada
Dados e modalidade → categoria compatível → pesquisa de prestadores elegíveis → valor base individual → selecionar prestador → enviar → concordância com base ou contraproposta justificada (ou recusa) → cliente aceita ou recusa. Recusa encerra sem contratação. Aceite cria exatamente um frete. Cliente pode encerrar antes da contratação.

## Solicitação aberta
Dados e modalidade → categoria compatível → publicar → prestadores autorizados e operacionalmente elegíveis consultam → valor base individual = max(mínimo, km estimados × tarifa/km) → uma proposta por prestador → cliente compara/aceita/recusa. Recusar uma proposta não encerra a solicitação. Aceitar uma bloqueia as demais; encerrar impede novas propostas. Não misturar direcionadas com abertas. Guardar estimativa original; distância simulada.

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
Prestador: /prestador, /prestador/solicitacoes/:id, /prestador/propostas, /prestador/fretes/:id, /prestador/veiculos/:id, /prestador/motoristas/:id (gestor), /prestador/perfil, /prestador/tarifas, /prestador/autorizacoes, /prestador/achados-perdidos, /prestador/contestacoes, /prestador/historico; respectivas listagens.
Motorista: /motorista, /motorista/fretes/:id (e listagem), /motorista/achados-perdidos, /motorista/historico, vínculos em conta.
Admin: /admin, /admin/prestadores, /admin/autorizacoes/:id e /admin/contestacoes/:id, respectivas listagens.
