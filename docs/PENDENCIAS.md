# Pendências

## Revisões documentais
- IN-001/002: ajustar conta e campos do cadastro; formalizar CPF e campos profissionais/comerciais necessários.
- IN-003: RF dedicado à criação/encerramento da solicitação (RF016 provisório); revisar lacuna RU007.
- IN-004/005/006: refletir tarifas, pesquisa de prestadores compatíveis e fluxo exclusivamente direcionado da DEC-038 no PDF original e nas referências mapeadas em RASTREABILIDADE.md. Manter o RF de tarifas sem ID definitivo.
- IN-007/008/009: nomenclatura Cliente/Passageiro, organização/gestor/cooperativa, restringir AMBOS a veículos.
- IN-010/011: separar ocorrência/interrupção, acordos e substituições; revisão da exceção do autônomo (fora do MVP).
- IN-012: RF de contestação (RF017 provisório), RU012, entidade e atividades.
- IN-013: formalizar avaliações; IN-014: notificações de autorizações e vínculos; IN-015: padronizar menus; IN-016: convites e credenciais; IN-017: unidade territorial definida pela DEC-043. Compatibilidade por origem, destino e trajetos permanece pendente.
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

- O tratamento visual de acesso negado (403) do item A24 foi entregue
  em 09.4. A futura API continua responsável pelo controle real.

## Pendências da Etapa 07

- A T01 usa painéis gráficos com tokens e ícones porque os recursos
  locais não incluem fotografias adequadas. A inclusão de fotografias
  depende de recursos com origem e uso autorizados.

## Pendências após a Etapa 09

- Cadastros profissionais e organizacionais,
  autorizações, prontidão e proteção efetiva dos registros ficam nos
  módulos próprios e na futura API.
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
- A conta canônica permite editar nome e telefone. CPF, e-mail,
  alteração autenticada de senha e exclusão de conta exigem definição
  posterior. A recuperação de senha continua disponível.
- Edições simultâneas dos mesmos campos seguem a última gravação.
  Sem Web Locks, a fila protege apenas operações da mesma aba.
  Sessões sucessivas de uma mesma conta continuam indistinguíveis.
## Pendências após 10.1–10.2

- A checagem de CNH é estrutural e EAR é autodeclarada. Verificação e
  upload de documentos, exclusão, inativação e efeitos de edição sobre
  autorização ficam para módulos futuros.
- Sem Web Locks, a serialização é local à aba. Registros inconsistentes
  precisam de correção explícita antes de novas gravações. A validação
  do cadastro profissional não substitui segurança de backend.
## Pendências após 10.3–10.4

- A declaração de responsabilidade é simulada. Convites, transferência,
  múltiplos responsáveis, inativação e exclusão ficam para análise futura.
- CNPJ e tipo organizacional permanecem imutáveis. Verificação externa,
  regiões, autorização e prontidão ficam fora deste incremento.
- A gravação conjunta vale para a chave organizacional. Sem Web Locks,
  a serialização é local à aba. Sessões sucessivas da mesma conta
  permanecem indistinguíveis e RNF003 continua pendente.
## Pendências após 10.5

- Persistência, controle de acesso e responsabilidade continuam
  demonstrativos. A gravação conjunta se restringe à chave
  organizacional. Permanecem as limitações de concorrência e
  identificação de sessões descritas acima.

## Futuro
Ver exclusões em ESCOPO.md. Não implementar sem aprovação de escopo.

## Pendências após 11.2

- Uma futura edição do catálogo precisa tratar códigos descontinuados antes da adoção para preservar a leitura da cobertura existente.

## Pendências da Etapa 11

- RF002 tem fluxo demonstrativo de cadastro, regiões e autorizações. A cobertura original permanece parcial, inclusive quanto às notificações.
- RF005 permanece pendente. IN-017 define o município como unidade territorial e mantém em aberto a compatibilidade por origem, destino e trajetos.
- RNF003 depende de autenticação, autorização e garantias de integridade no backend.
- IN-014 mantém pendentes as notificações internas de autorizações e vínculos. A DEC-044 recomenda uma notificação por decisão.
- Retirada, revogação, suspensão e recurso administrativo permanecem adiados.
- Os efeitos operacionais da expiração da CNH, a prontidão e a elegibilidade permanecem pendentes.
- LocalStorage não oferece transações entre chaves. O fallback sem Web Locks serializa apenas na própria aba. A sessão simulada é identificada apenas pelo `userId`.

## Pendências após 12.2

- RF003 tem perfil e identidade profissional. IN-016 permanece
  pendente quanto aos convites e vínculos. P12-06 a P12-17 seguem em
  discussão, incluindo verificações e encerramento.
- RF002 permanece parcial. RNF003, IN-014 e os critérios de
  compatibilidade territorial de IN-017 permanecem pendentes.
- O aplicativo novo detecta alterações no legado em telas
  profissionais por assinatura diagnóstica. Escritas de abas
  antigas não podem ser impedidas pelo aplicativo novo.

### Após 12.4

IN-016 passou a ter convite interno por e-mail exato para conta comum existente, sem expiração automática. Convites sem conta e códigos permanecem adiados. Senhas e credenciais continuam sob responsabilidade do titular. IN-014 permanece pendente para notificações gerais. P12-12, P12-13, P12-14 e P12-16 seguem sem aprovação. RF003 e RF002 continuam parciais; RNF003 e a compatibilidade territorial de IN-017 permanecem pendentes.

### Após 12.6

P12-12, P12-13, P12-14 e P12-16 foram aprovadas na DEC-047. IN-016 inclui convites internos e encerramento; convites sem conta e códigos permanecem adiados. IN-014 permanece pendente quanto a notificações gerais e IN-017 quanto à compatibilidade territorial. RF002 e RF003 permanecem parciais; RF005 e RNF003 seguem pendentes.

Ainda precisam ser definidos os efeitos de verificação e vigência na aptidão, prontidão e designação. Antes de integrar a operação de fretes, definir as condições para encerramento com motorista designado ou em execução, substituição e acesso ao histórico operacional.

### Pendências preservadas na validação integrada de 12.7

- IN-014 mantém notificações gerais pendentes. IN-016 registra convites internos para contas existentes; convites sem conta e códigos continuam adiados. A lista de convites permite inferir a existência de conta elegível.
- RNF003 depende de segurança e privacidade no backend. O protótipo persiste em LocalStorage, sem transações entre chaves. Sem Web Locks, a fila é restrita à aba. A sessão simulada usa `userId`. Versões antigas podem não entender a fonte ativa de habilitação ou a coleção com vínculos encerrados.
- IN-017 mantém a compatibilidade territorial de origem, destino e trajetos pendente.
- RN012, RF009 e US-011 dependem de critérios futuros de aptidão, disponibilidade e prontidão, da compatibilidade entre motorista, veículo e modalidade e das regras de designação e substituição.
- Antes da execução de fretes, definir regras de encerramento de vínculos com motorista designado ou em execução e o acesso posterior ao histórico operacional. RF002 e RF003 permanecem parciais.

### Pendências preservadas na Etapa 13.5

- Ampliar o catálogo veicular e definir fotos, documentos veiculares,
  verificação documental real, compartilhamento e transferência de veículos.
- Definir disponibilidade temporal, compatibilidade dimensional e
  compatibilidade entre motorista, veículo e modalidade. Combinação de
  capacidades e transporte simultâneo de passageiros e carga seguem pendentes.
- Definir prontidão operacional, designação e substituição de recursos,
  inativação de veículos durante fretes designados ou em execução e
  retratos dos recursos efetivamente utilizados.
- IN-005 mantém pendente a busca de prestadores compatíveis. IN-017 mantém
  pendente a compatibilidade territorial por origem, destino e trajetos.
  IN-009 mantém a revisão documental de AMBOS, com duas modalidades
  individuais no cadastro veicular. IN-014 mantém notificações gerais
  pendentes. IN-016 conserva as pendências de convites.
- RF004 cobre o gerenciamento cadastral demonstrativo. RF002 e RF003
  permanecem parciais. RF005 e RNF003 continuam pendentes.
- A frota usa LocalStorage. O protótipo tem segurança demonstrativa no
  frontend, sessão simulada por `userId` e compatibilidade limitada entre
  versões. A fila sem Web Locks se limita à aba atual. A gravação da
  frota reúne veículo e eventos na mesma chave. Transações entre chaves e
  garantias de segurança e integridade de produção dependem do backend.

### Após 14.1–14.4

- IN-004 permanece aberto para formalização documental de tarifas.
  Hora, diária, franquia, pedágios e demais componentes precisam de
  definição e aprovação.
- Definir quando o cliente escolhe a categoria, como apresentar
  múltiplas categorias, como selecionar a tarifa comercial e quando
  vence uma estimativa. Definir revalidação antes do envio, fixação do
  valor base e retratos comerciais.
- Preservar IN-005 e IN-017 para busca e compatibilidade territorial.
  Prontidão, disponibilidade, compatibilidade operacional, designação
  de tipo distinto, alteração de acordo, solicitações direcionadas,
  negociação, contratação, pagamentos e notificações seguem fora da
  entrega.
- Segurança definitiva, transações entre chaves e concorrência entre
  versões dependem da evolução para o backend. A validação integrada
  e o encerramento da Etapa 14 ficam para 14.5.
