# Rotina Dinâmica

Frontend Next.js App Router com Supabase Auth e persistência nas oito tabelas existentes. Usa apenas chave publicável no navegador, nunca service_role. O banco precisa manter as políticas RLS de propriedade por usuário.

## Desenvolvimento

1. Copie `.env.example` para `.env.local`.
2. Execute `npm install` (gere e versionе o package-lock.json).
3. Execute `npm test`, `npm run build` e `npm run dev`.

## Publicação na Vercel

Importe o repositório GitHub como projeto Next.js. Cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` conforme `.env.example`. Publique e configure no Supabase Auth o Site URL e Redirect URLs para o domínio de produção. Não disponibilize chaves secretas.

## Funcionalidades e limites

Login e cadastro por e-mail/senha; Hoje com conclusão de atividades; calendário de turnos; sugestões considerando energia, deslocamento, metas e sono; registros Uber, estudos e treinos; metas de sessões; histórico; preferências.

O calendário mostra todos os dias do mês, sem alinhamento por dia da semana. Uber apresenta receita bruta sem estimar lucro ou demanda em tempo real. Planejamento não sobrescreve atividades existentes; turnos noturnos exigem ajuste manual. Metas automáticas usam o número de sessões. Escalas e registros podem ser adicionados; edição e exclusão de registros não estão implementadas nesta primeira versão. Perfil e configurações usam valores padrão até o primeiro salvamento.

## Validação desta entrega

Testes do planejador executáveis sem dependências. Build e login remoto devem ser verificados após instalar dependências e liberar os acessos necessários. Nenhuma publicação foi concluída nesta sessão: o navegador bloqueou Vercel, não há ferramenta Vercel conectada e o repositório indicado não foi encontrado na conta GitHub conectada. Não existe URL de produção verificada.

## Estudos guiados

A área Estudos inclui trilhas introdutórias com explicações, prática, cartões de memória e quiz autoral. Fortinet é a trilha inicial. Há também material básico de inglês e redes. O modo foco usa um cronômetro de 25 minutos. O resultado é salvo na tabela `study_sessions` existente, com identificador de aula em `topic`, nota e número de questões; não exige migração de banco. A próxima aula considera a data selecionada e a última nota; a meta é 80% e a revisão é sugerida após três dias. O material é inicial e não cobre integralmente uma certificação. PMPE Soldado inclui o mapa do PDF enviado (Edital 001/2026) e sete aulas iniciais, uma por disciplina e uma de redação. A fonte é o arquivo fornecido pelo usuário, disponível no módulo; sua autenticidade não foi validada de forma independente. A trilha usa subject Other e identificadores próprios em topic, compatíveis com o banco existente. O material inicial não cobre integralmente todos os tópicos do edital.

### Aprofundamento e provas anteriores

Fortinet inclui oito aulas, com referências oficiais do FortiOS 7.4 e cinco cenários adicionais: roteamento, sessões, SNAT, inspeção TLS e diagnóstico. O nome NSE4 é mantido como categoria do banco; consulte o Training Institute para currículo, versão e denominação atuais do exame.

A trilha PMPE inclui resolução com caderno PDF local e gabarito informado pelo usuário, correção, filtro de erros e salvamento de resumo em study_sessions. As anuladas são excluídas do percentual de treino. PDF, alternativas marcadas e gabarito permanecem no estado da página, sem upload; somente o resumo é persistido. As fontes localizadas são o concurso AOCP PMPE edital 2023 e um acervo alternativo; os PDFs de prova/gabarito não puderam ser baixados e nenhuma questão histórica foi importada ou inventada. Os quizzes das aulas são autorais.

O edital 2026 fornecido foi comparado ao PDF publicado em arquivos-site.institutoaocp.org.br/publicacoes/2900b54e-fae0-462e-8a77-58784523dfa0.pdf; os hashes SHA-256 coincidem. Verificação em 07/10/2026.

### Questões encontradas na internet

A trilha PMPE apresenta 18 referências externas de questões reais da AOCP em listagens Qconcursos filtradas por nível médio, verificadas em 07/10/2026. Há busca por assunto/prova e filtro de disciplina (Português, Lógica, Informática e Constitucional). A seleção exclui tópicos sem relação clara com o programa, mas não constitui prova PMPE nem cobre todo o edital. Enunciados, comentários e gabaritos não são reproduzidos; a resolução ocorre na fonte, sujeita a cadastro e limites do provedor. Origem, ID, ano, prova e classificação são salvos no catálogo. Não foi atribuído gabarito sem verificação.

## Finanças

A área Finanças reúne Airbnb (por imóvel), Uber, Inorpel e despesas pessoais. Distingue lançamentos pendentes de recebidos/pagos, usa a data efetiva para o fluxo mensal, mostra vencidos de meses anteriores e permite editar, excluir com confirmação e exportar CSV. Valores são calculados em centavos. O resultado é o movimento registrado, não um saldo bancário nem um cálculo fiscal completo.

As receitas Uber vêm de `uber_sessions`, sem criar cópias no livro financeiro; receitas Uber manuais são bloqueadas também no banco. Custos precisam ser informados. Horários opcionais de início/fim na área Uber permitem calcular receita bruta por hora somente para sessões com duração conhecida. Para Airbnb, use o valor bruto com taxas lançadas separadamente ou o líquido sem repetir as taxas descontadas.

Reservas usam aportes e retiradas: não contam como receita/despesa operacional. Aportes reduzem o livre do mês e retiradas aumentam; o saldo reservado acumula entre meses. O banco bloqueia movimentos, edições ou exclusões que deixariam o saldo total da reserva negativo. Não são transferências bancárias reais. A identificação do imóvel é texto livre; use nomes consistentes.

### Ativação no Supabase

Execute somente `supabase/migrations/202610070002_finance.sql` uma vez no SQL Editor do projeto existente. Há uma cópia para download em `/docs/finance.sql`. Não execute a migração `initial` neste banco. O SQL cria duas tabelas com RLS por usuário, grants para authenticated, bloqueio de anon, restrições de valores e um trigger de saldo de reserva. Não altera as oito tabelas existentes.

Antes da ativação, a área exibe indisponibilidade e oferece nova tentativa, sem impedir Estudos ou as demais áreas. Em 07/10/2026 as duas tabelas não existiam no Supabase (HTTP 404/PGRST205); nenhuma migração foi aplicada ao banco real nesta sessão. O SQL foi executado em PostgreSQL local via PGlite com papéis authenticated/anon e auth.uid simulado, validando isolamento, constraints, vínculo por proprietário, movimentos de reserva e remoção em cascata. O navegador foi validado com API Supabase simulada. Após ativar, validar lançamentos reais em uma sessão autenticada.
