-- Somente leitura. Execute no SQL Editor do Supabase e exporte o resultado.
select jsonb_pretty(jsonb_build_object(
 'columns', (select jsonb_agg(to_jsonb(c)) from (
  select table_name,column_name,data_type,is_nullable,column_default
  from information_schema.columns where table_schema='public'
  and table_name in ('profiles','routine_settings','work_shifts','daily_plans','activities','weekly_goals','uber_sessions','study_sessions')
  order by table_name,ordinal_position
 ) c),
 'policies', (select jsonb_agg(to_jsonb(p)) from (
  select tablename,policyname,roles,cmd,qual,with_check from pg_policies
  where schemaname='public' and tablename in ('profiles','routine_settings','work_shifts','daily_plans','activities','weekly_goals','uber_sessions','study_sessions')
 ) p),
 'constraints', (select jsonb_agg(to_jsonb(k)) from (
  select r.relname as table_name,c.conname,pg_get_constraintdef(c.oid) as definition
  from pg_constraint c join pg_class r on r.oid=c.conrelid
  join pg_namespace n on n.oid=r.relnamespace
  where n.nspname='public' and r.relname in ('profiles','routine_settings','work_shifts','daily_plans','activities','weekly_goals','uber_sessions','study_sessions')
 ) k),
 'rls', (select jsonb_agg(to_jsonb(r)) from (
  select c.relname as table_name,c.relrowsecurity as enabled,c.relforcerowsecurity as forced
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relname in ('profiles','routine_settings','work_shifts','daily_plans','activities','weekly_goals','uber_sessions','study_sessions')
 ) r)
)) as schema_report;
