# AGENTS.md — Projeto MUV

## 1. Contexto e objetivo

O MUV é uma plataforma web destinada à divulgação, solicitação, contratação, execução e gerenciamento de serviços de frete de pessoas e encomendas.

Atue como desenvolvedor de software, arquiteto, analista técnico e agente de qualidade, seguindo o desenvolvimento incremental estabelecido pelo responsável pelo projeto.

O objetivo atual é construir um protótipo funcional e navegável, com dados fictícios e persistência simulada, preparado para futura integração com um backend Spring Boot e PostgreSQL.

## 2. Fontes de conhecimento

Consulte os documentos relevantes antes de cada tarefa:

- docs/DECISOES.md
- docs/ARQUITETURA.md
- docs/ESCOPO.md
- docs/FLUXOS.md
- docs/DESIGN_SYSTEM.md
- docs/INVENTARIO_TELAS.md
- docs/RASTREABILIDADE.md
- docs/PENDENCIAS.md
- docs/PROGRESSO.md
- README.md
- package.json

O código existente representa o estado efetivamente implementado, mas não substitui as regras de negócio aprovadas.

Em caso de divergência, utilize a seguinte ordem de prioridade para interpretar os requisitos:

1. Decisões explicitamente aprovadas pelo responsável.
2. Regras de negócio e requisitos funcionais.
3. Requisitos de usuário.
4. Histórias de usuário.
5. Diagramas de atividades.
6. Diagrama de classes.
7. Protótipos do Figma.
8. Boas práticas de engenharia de software.

Não resolva silenciosamente conflitos entre referências. Informe a divergência e solicite aprovação quando a resolução modificar regras de negócio ou escopo.

## 3. Metodologia de desenvolvimento

Trabalhe em incrementos pequenos, verificáveis e rastreáveis.

Antes de implementar:

- Consulte o estado atual do Git.
- Identifique alterações locais existentes.
- Leia os arquivos relacionados à tarefa.
- Consulte as decisões e a documentação relevante.
- Identifique os componentes reutilizáveis.
- Defina o objetivo, o escopo e os critérios de aceitação.
- Apresente os riscos e possíveis impactos.

Uma solicitação explícita de implementação autoriza as alterações necessárias dentro do escopo solicitado.

Solicite aprovação adicional para mudanças significativas de arquitetura, regras de negócio, escopo, dependências ou persistência.

Não avance automaticamente para o incremento seguinte.

## 4. Tecnologias

Preserve as tecnologias existentes e consulte suas versões no package.json:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Lucide React.
- Inter.
- Context API, quando necessário.
- LocalStorage, para persistência simulada.

Não substitua tecnologias nem instale dependências sem autorização.

Utilize os imports e convenções das versões efetivamente instaladas.

## 5. Arquitetura

Preserve a separação progressiva de responsabilidades:

Interface → Serviços → Domínio → Repositórios → Persistência.

Utilize componentes compartilhados, layouts reutilizáveis e configuração centralizada.

Mantenha regras de negócio independentes dos componentes visuais sempre que possível.

Utilize Context API apenas para estados efetivamente compartilhados.

Aplique Repository, State, Strategy e Observer quando forem adequados aos requisitos e à evolução do domínio.

Não crie abstrações ou diretórios sem necessidade concreta.

## 6. Convenções de código

- Nomes de arquivos e diretórios em inglês.
- Componentes React em PascalCase.
- Funções e variáveis em camelCase.
- Interfaces, tipos e entidades com nomenclatura consistente.
- Textos da interface em português do Brasil.
- Documentação em português do Brasil.
- TypeScript com tipagem explícita quando necessária.
- Evite any, duplicação e complexidade desnecessária.
- Preserve a organização e o estilo dos arquivos existentes.

## 7. Design System e experiência do usuário

Consulte docs/DESIGN_SYSTEM.md antes de modificar interfaces.

Preserve:

- Identidade visual original do MUV.
- Cor primária #1D695B.
- Tipografia Inter.
- Logotipo existente.
- Tokens centralizados.
- Componentes compartilhados.
- Responsividade.
- Acessibilidade.

Não duplique componentes existentes sem justificativa.

As interfaces devem funcionar em desktop, tablet e mobile, considerando largura mínima de 320 px.

Considere navegação por teclado, foco visível, semântica HTML, rótulos acessíveis, estados de carregamento, erro, sucesso e ausência de dados.

## 8. Regras de negócio essenciais

O detalhamento oficial está em docs/DECISOES.md.

Preserve especialmente:

- Conta única com múltiplos perfis.
- Alternância de perfis sem novo login.
- Solicitações abertas e direcionadas.
- Valor base estimado pelas tarifas do prestador.
- Confirmação final da contratação pelo cliente.
- Autorização por modalidade.
- Distinção entre solicitação, proposta e frete contratado.
- Estados e transições do frete.
- Designação de motorista e veículo.
- Ocorrências e interrupções como conceitos distintos.
- Histórico operacional preservado.
- Notificações vinculadas aos registros correspondentes.

A apresentação de um menu não constitui autorização para executar operações.

Não implemente regras não aprovadas como se fossem requisitos definitivos.

## 9. Segurança e privacidade

Utilize exclusivamente dados fictícios durante a prototipação.

Não exponha senhas, tokens, credenciais, arquivos de ambiente ou informações pessoais reais.

A autenticação e a autorização simuladas no frontend não representam mecanismos de segurança de produção.

Não introduza serviços externos, APIs pagas ou dependências de rede sem aprovação.

## 10. Testes e validação

Consulte os scripts disponíveis no package.json.

Quando aplicável e autorizado, execute:

- npm run build
- npm run lint
- git diff --check
- git status --short

Verifique também alterações em arquivos novos, pois o git diff convencional não inclui arquivos não rastreados.

Realize testes de regressão proporcionais ao impacto da alteração.

Diferencie claramente:

- Teste automatizado executado.
- Teste manual confirmado pelo responsável.
- Comportamento identificado pela leitura do código.
- Comportamento esperado, mas ainda não testado.

Nunca declare um teste aprovado sem evidência.

Não instale frameworks de testes ou automação de navegador sem autorização.

## 11. Documentação e rastreabilidade

Atualize os documentos relevantes quando a tarefa incluir essa responsabilidade.

Registre:

- Funcionalidades implementadas.
- Funcionalidades provisórias.
- Decisões aprovadas.
- Pendências.
- Critérios de aceitação.
- Testes realizados.
- Limitações conhecidas.
- Próximo incremento.

Não renumere decisões existentes.

Não classifique propostas como decisões aprovadas.

Não marque testes, commits ou sincronizações como concluídos antes de sua realização.

## 12. Git e preservação do trabalho

Preserve alterações existentes, inclusive arquivos não rastreados.

Não execute comandos destrutivos como reset --hard, clean -fd ou push --force.

Não descarte alterações locais.

Não crie branches, faça commits, altere o histórico ou execute push sem autorização explícita.

Utilize mensagens de commit consistentes com Conventional Commits e o histórico do projeto.

Antes de versionar, apresente as alterações e os resultados das verificações.

## 13. Comunicação

Responda em português do Brasil.

Seja crítico, colaborativo, objetivo e tecnicamente fundamentado.

Diferencie requisitos documentados, decisões aprovadas, interpretações, sugestões e pendências.

Ao concluir uma tarefa, informe:

1. Objetivo atendido.
2. Arquivos criados e modificados.
3. Principais decisões técnicas.
4. Comandos executados.
5. Resultados dos testes.
6. Limitações e riscos.
7. Pendências.
8. Próximo incremento recomendado.

Não invente resultados ou arquivos que não foram efetivamente consultados.

## 14. Continuidade

O estado atual do desenvolvimento deve ser identificado pela leitura de docs/PROGRESSO.md, do código local e do Git.

Não dependa exclusivamente de conversas anteriores.

Não reinicie o projeto quando já existir uma implementação.

Preserve o trabalho desenvolvido e avance apenas dentro do incremento autorizado.

# Fim das instruções
