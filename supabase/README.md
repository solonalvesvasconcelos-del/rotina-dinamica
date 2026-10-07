# Integração Supabase

## Banco existente verificado

O relatório fornecido pelo usuário em 07/10/2026 confirma as oito tabelas, RLS habilitado e políticas de propriedade por usuário. Os campos gravados pelo frontend existem e os campos adicionais obrigatórios têm defaults. `routine_settings.user_id` é chave primária e permite o upsert usado na aplicação. O frontend foi ajustado para folgas com horários nulos, horários obrigatórios em dias de trabalho e limites numéricos do banco.

Não execute a migração inicial neste projeto existente. Login e operações autenticadas ainda precisam de validação prática; o relatório não inclui grants nem triggers. Não há evidência suficiente para afirmar que o cadastro cria o perfil automaticamente.


`migrations/202610070001_initial.sql` propõe o esquema das oito tabelas usadas pelo frontend. Não foi executado nem validado em um servidor PostgreSQL nesta sessão.

## Aplicação

1. No Supabase, inspecione as tabelas e políticas existentes no projeto. O README original menciona tabelas existentes, mas o ZIP não inclui seu esquema.
2. Execute esta migração apenas em um banco novo ou após confirmar que as oito tabelas ainda não existem. O script usa uma transação e não remove tabelas; conflitos exigem uma migração adaptada ao esquema real.
3. Habilite autenticação por e-mail e senha. Configure Site URL e Redirect URLs para o endereço real da aplicação.
4. Configure `.env.local` com a URL e a chave publicável do projeto. Nunca coloque `service_role` no frontend.
5. Execute `npm test`, `npm run build` e `npm run dev`.

## Validação remota pendente

Com dois usuários de teste autorizados, confirme cadastro/login, salvamento de preferências, turno, planejamento, conclusão de atividades, sessões Uber e estudos e metas semanais. Confirme que cada usuário só consegue consultar e alterar seus próprios registros e que requisições anônimas não acessam as tabelas. A referência composta de atividades impede associar uma atividade ao plano de outro usuário.

O trigger cria perfil e preferências para novos usuários; a migração também prepara usuários existentes. As políticas exigem autenticação e propriedade tanto na leitura quanto na escrita.

O frontend ainda salva plano e atividades em requisições separadas; uma falha na segunda requisição pode deixar um plano sem atividades. Uma operação transacional via RPC exige implementação e validação adicionais.
