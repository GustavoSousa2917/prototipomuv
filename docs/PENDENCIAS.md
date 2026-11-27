# Pendências

## Revisões documentais
- IN-001/002: ajustar conta e campos do cadastro; formalizar CPF e campos profissionais/comerciais necessários.
- IN-003: RF dedicado à criação/encerramento da solicitação (RF016 provisório); revisar lacuna RU007.
- IN-004/005/006: refletir tarifas, pesquisa de prestadores compatíveis e fluxo exclusivamente direcionado da DEC-038 no PDF original e nas referências mapeadas em RASTREABILIDADE.md. Manter o RF de tarifas sem ID definitivo.
- IN-007/008/009: nomenclatura Cliente/Passageiro, organização/gestor/cooperativa, restringir AMBOS a veículos.
- IN-010/011: separar ocorrência/interrupção, acordos e substituições; revisão da exceção do autônomo (fora do MVP).
- IN-012: RF de contestação (RF017 provisório), RU012, entidade e atividades.
- IN-013: formalizar avaliações; IN-014: notificações de autorizações e vínculos; IN-015: padronizar menus; IN-016: convites e credenciais; IN-017: trajetos e regiões.
- Atualizar modelo de classes e diagramas de atividades para refletir as 91 decisões; manter IDs novos provisórios até revisão formal.

## Detalhamento necessário por módulo (não bloqueia a configuração)
- Campos obrigatórios adicionais de CNH, endereço comercial, termos de uso; detalhes de edição de conta.
- Catálogo final de categorias, critérios de compatibilidade de carga/volume, regiões e origem/destino, tarifas ausentes, estimativa de distância e precisão monetária.
- Definir critérios técnicos para identificar solicitações da mesma necessidade de frete, inclusive quando os dados forem reaproveitados ou alterados, e para impedir negociações simultâneas. A DEC-038 estabelece a regra de negócio.
- Janela temporal de disponibilidade: duração estimada, conflitos entre organizações e recursos, alteração aceita que invalida designações. Resolver sem adicionar estado de frete sem aprovação.
- Retirada de alteração de acordo pendente, permissões em vínculos encerrados, acesso do motorista substituído ao histórico, possibilidade de revogação de autorização.
- Política de devolução por motorista, critérios de visibilidade de ocorrências, comentários públicos e moderação de avaliações.
- Validar navegação exata, tokens de cor, tipografia, logotipo e componentes a partir das capturas; não assumir que estilos aproximados são oficiais.
- Verificar requisitos não funcionais: responsividade, acessibilidade, desempenho e limites do LocalStorage. Dados fictícios apenas; sem garantias reais de segurança.

## Pendências técnicas da Etapa 06.5

- O navegador requisita `/favicon.ico` e recebe HTTP 404. Definir o
  favicon em tarefa própria.

## Pendências técnicas da Etapa 06.6

- O tratamento de acesso negado (403) permanece previsto no item A24.

## Pendências da Etapa 07

- A T01 usa painéis gráficos com tokens e ícones porque os recursos
  locais não incluem fotografias adequadas. A inclusão de fotografias
  depende de recursos com origem e uso autorizados.

## Pendências após as Etapas 09.1 e 09.2

- Seleção e alternância de contexto, entrada de prestadores, guardas,
  página 403, conta canônica e contas demonstrativas permanecem para
  incrementos seguintes. Cadastros profissionais e organizacionais,
  autorizações e prontidão ficam nos módulos próprios.
- As páginas de termos e privacidade continuam provisórias. O registro
  de aceite é demonstrativo e não comprova conformidade com a LGPD.
- A sessão usa eventos nativos entre abas. O contexto ativo é local à
  aba. A chave de sessão por ID distingue contas, mas não identifica
  logins sucessivos da mesma conta.
- LocalStorage não oferece atomicidade entre chaves. Sem Web Locks,
  a serialização das mutações de autenticação é restrita à aba.
- A caixa demonstrativa permite distinguir contas existentes. Um
  canal de recuperação real e segurança de produção ficam para a
  futura integração com backend.
- Versionamento das Etapas 09.1 e 09.2 aguarda autorização.

## Futuro
Ver exclusões em ESCOPO.md. Não implementar sem aprovação de escopo.
