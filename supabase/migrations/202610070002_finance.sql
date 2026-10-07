-- Execute uma vez no SQL Editor do projeto Supabase existente.
-- Esta migração adiciona somente o módulo financeiro; não execute a migração initial.
begin;
create table public.finance_reserves (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (length(trim(name)) between 1 and 120),
 target_amount numeric(12,2) not null check (target_amount > 0),
 created_at timestamptz not null default now(),
 unique (id,user_id), unique(user_id,name)
);
create table public.finance_transactions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 source text not null check (source in ('airbnb','uber','inorpel','personal')),
 kind text not null check (kind in ('income','expense','allocation','release')),
 description text not null check (length(trim(description)) between 1 and 300),
 category text not null default 'Outros' check (length(category) <= 120),
 property_name text check (length(property_name) <= 120),
 amount numeric(12,2) not null check (amount > 0),
 transaction_date date not null,
 status text not null check (status in ('pending','settled')),
 settled_date date,
 reserve_id uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 foreign key (reserve_id,user_id) references public.finance_reserves(id,user_id) on delete no action deferrable initially deferred,
 check ((status='settled' and settled_date is not null) or (status='pending' and settled_date is null)),
 check ((kind in ('allocation','release') and reserve_id is not null and source='personal' and status='settled') or (kind in ('income','expense') and reserve_id is null)),
 check (not (source='uber' and kind='income'))
);
create index finance_transactions_user_date on public.finance_transactions(user_id,transaction_date);
create index finance_transactions_reserve on public.finance_transactions(reserve_id);
alter table public.finance_reserves enable row level security;
alter table public.finance_transactions enable row level security;
revoke all on public.finance_reserves,public.finance_transactions from anon;
grant select,insert,update,delete on public.finance_reserves,public.finance_transactions to authenticated;
create policy own_finance_reserves on public.finance_reserves for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_finance_transactions on public.finance_transactions for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create function public.finance_check_reserve_balance() returns trigger
language plpgsql set search_path='' as $$
declare old_reserve uuid; new_reserve uuid; old_id uuid; goal record; balance numeric;
begin
 if TG_OP='DELETE' and pg_trigger_depth()>1 then return OLD; end if;
 if TG_OP <> 'INSERT' then old_reserve:=OLD.reserve_id; old_id:=OLD.id; end if;
 if TG_OP <> 'DELETE' then new_reserve:=NEW.reserve_id; end if;
 -- Bloqueios na mesma ordem serializam movimentos concorrentes da reserva.
 for goal in select id from public.finance_reserves where id in (old_reserve,new_reserve) order by id for update loop
  select coalesce(sum(case kind when 'allocation' then amount when 'release' then -amount else 0 end),0)
  into balance from public.finance_transactions
  where reserve_id=goal.id and (old_id is null or id<>old_id);
  if TG_OP <> 'DELETE' and NEW.reserve_id=goal.id then
   balance:=balance+case NEW.kind when 'allocation' then NEW.amount when 'release' then -NEW.amount else 0 end;
  end if;
  if balance<0 then raise exception 'O movimento deixaria a reserva com saldo negativo.' using errcode='23514'; end if;
 end loop;
 if TG_OP='DELETE' then return OLD; end if;
 NEW.updated_at:=clock_timestamp();
 return NEW;
end $$;
revoke all on function public.finance_check_reserve_balance() from public;
create trigger finance_check_reserve_balance before insert or update or delete on public.finance_transactions
 for each row execute function public.finance_check_reserve_balance();
commit;
