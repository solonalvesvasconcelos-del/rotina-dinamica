# Ativar Finanças

1. Abra o projeto `rotina-dinamica` no painel Supabase.
2. Em SQL Editor → New query, cole **todo** o conteúdo de `migrations/202610070002_finance.sql` e execute Run uma vez.
3. Aguarde a mensagem de sucesso. Se houver erro, envie a mensagem sem credenciais; não apague tabelas para repetir.
4. No aplicativo, abra Finanças e clique Tentar novamente ou recarregue a página.
5. Registre uma receita pequena de teste em um imóvel, uma despesa e uma reserva; recarregue e confirme a persistência. Apague os lançamentos de teste ao concluir (primeiro a retirada, depois o aporte, se houver).

A migração é aditiva: não recria nem altera as tabelas anteriores. RLS restringe as duas tabelas ao usuário autenticado proprietário. A chave publicável existente é suficiente para a aplicação após a ativação; não coloque service_role no navegador.

O módulo mostra somente os valores informados. Não importa contas bancárias, salários ou reservas Airbnb automaticamente. A receita Uber é integrada às sessões que você já registrou.
