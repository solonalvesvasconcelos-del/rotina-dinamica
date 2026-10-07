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

A área Estudos inclui trilhas introdutórias com explicações, prática, cartões de memória e quiz autoral. Fortinet é a trilha inicial. Há também material básico de inglês e redes. O modo foco usa um cronômetro de 25 minutos. O resultado é salvo na tabela `study_sessions` existente, com identificador de aula em `topic`, nota e número de questões; não exige migração de banco. A próxima aula considera a data selecionada e a última nota; a meta é 80% e a revisão é sugerida após três dias. O material é inicial e não cobre integralmente uma certificação. PMPE Soldado aguarda edital oficial verificado.
