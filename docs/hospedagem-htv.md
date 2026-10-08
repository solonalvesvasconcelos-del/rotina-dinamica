# Hospedagem estática no HTV Box 5

A aplicação atual pode ser exportada: não possui API routes, Server Actions,
renderização dinâmica no servidor ou processamento de imagens pelo Next.js.
Autenticação, consultas e persistência acontecem no navegador via Supabase.
O HTV serve somente arquivos; o banco continua hospedado no Supabase.

## Gerar a versão estática em um computador atual

Requer Node.js >= 20.9; não execute o build no Android 5.1.1.
Na pasta do projeto, instale as dependências com `npm install`, configure
`.env.local` conforme `.env.example` e execute:

```sh
npm run build:static
tar -czf rotina-dinamica-static.tar.gz -C out .
```

O diretório `out` contém o site completo. Use somente
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no build.
Esses valores são públicos e ficam nos arquivos JavaScript. Nunca use
service_role ou chaves secretas. Não copie `.env.local`, fontes ou node_modules
para a pasta servida pelo Python. Para atualizar o sistema, gere e transfira
novamente os arquivos. Para trocar a conexão Supabase, refaça o build.

`npm run build` e `npm run start` continuam sendo o caminho normal para
Next.js/Vercel. Depois de um build estático, execute um build normal antes de
usar `npm run start`.

## Transferir pela rede local

Baixe o pacote em um computador conectado ao mesmo roteador do HTV. Na pasta
que contém o arquivo, use o SSH já configurado (autenticação existente):

```sh
scp -O -P 8022 rotina-dinamica-static.tar.gz u0_a55@192.168.1.15:~/
ssh -p 8022 u0_a55@192.168.1.15
```

`-O` usa o protocolo SCP tradicional, útil quando o SSH do Termux não oferece
SFTP. O pacote inclui somente arquivos públicos do site.

No Termux, crie uma pasta de teste separada de `~/site`, que já está em uso:

```sh
mkdir -p ~/rotina-dinamica-static
tar -xzf ~/rotina-dinamica-static.tar.gz -C ~/rotina-dinamica-static
cd ~/rotina-dinamica-static
python -m http.server 8081 --bind 0.0.0.0
```

Se seu comando for `python3`, use-o no lugar de `python`. Esse servidor fica
em primeiro plano: Ctrl+C encerra o teste. No celular/computador da mesma rede,
abra `http://192.168.1.15:8081/`. A pasta `~/site` e a porta 8080 permanecem
intactas. O início automático do SSH pelo Termux:Boot não inicia esse servidor
HTTP; a inicialização automática do site deve ser configurada depois do teste.

Teste login com sua conta, troca de telas, leitura de dados, PDF de estudos e
salvamento de um registro descartável. Os dados reais continuam no mesmo banco.
Não crie registros financeiros reais apenas para testar. Sessões de login e
respostas locais de provas são específicas de cada endereço/navegador; não são
copiadas automaticamente da Vercel. As tabelas financeiras ainda dependem da
migração já fornecida se ela não foi aplicada.

## Supabase e confirmação de e-mail

Login existente por e-mail/senha não usa callback no servidor Next.js. Para
cadastros com confirmação, adicione a URL de teste ao Supabase Authentication
> URL Configuration > Redirect URLs. O Site URL atual continua determinando
para onde o e-mail redireciona, pois o cadastro não informa emailRedirectTo.
Mantenha a Vercel como Site URL durante os testes; quando migrar definitivamente,
configure o domínio HTTPS final como Site URL e também como Redirect URL.
Não desative RLS nem conceda acesso anônimo para adaptar a hospedagem.

## Android 5.1.1 e acesso público

Servir HTML/JS pelo Python não requer um Node.js compatível com Android. Mas o
navegador que abre o site precisa executar JavaScript moderno. O teste aqui foi
feito com Chromium atual, não com o navegador/WebView do HTV. A versão antiga
pode mostrar tela vazia ou falhar na conexão TLS com o Supabase. Use um navegador
atual no celular/computador; o Android do servidor não precisa abrir o Supabase.
Internet é necessária nos dispositivos clientes para acessar o Supabase.

O endereço 192.168.1.15 funciona somente na rede local. O teste HTTP não oferece
criptografia e deve ocorrer em rede doméstica confiável; para uso regular,
configure HTTPS. Não encaminhe diretamente as portas SSH/8022 ou Python/8081
para a internet. Para acesso externo, use um gateway/túnel com HTTPS, de
preferência em roteador ou equipamento atualizado. Compatibilidade de clientes
de túnel com Android 5.1.1 precisa ser verificada antes de escolher a solução.
O Python http.server é adequado para validar a cópia local; publicação pública
exige a camada HTTPS e a configuração de funcionamento contínuo.

## Evidência da validação

O build `npm run build:static` gerou `out` com sucesso. Os arquivos foram
servidos com Python, e a navegação mobile, telas, modo foco, manifest e ícones
foram verificados em Chromium com API Supabase simulada. Isso valida o formato
estático; não demonstra acesso SSH ao HTV, compatibilidade do navegador antigo,
login real nesse endereço nem publicação externa.
