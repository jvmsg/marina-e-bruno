# Site de Casamento

Site mobile-first para convite de casamento, confirmação de presença por família e lista de presentes com Stripe.

## Stack

- Next.js (App Router)
- Supabase (dados, storage e RLS)
- Stripe Checkout
- Deploy na Vercel

## Desenvolvimento local

1. Instale dependências:

```bash
npm install
```

2. Copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha `.env.local` com as chaves do Supabase e Stripe.

4. Execute o SQL em [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) no Supabase Dashboard (SQL Editor).

5. Inicie o projeto:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração do Supabase

### Tabelas

Após rodar a migration, cadastre manualmente:

1. **`families`**: uma linha por família/convite
2. **`guests`**: convidados ligados ao mesmo `family_id`
3. **`gift_items`**: presentes com `stripe_price_id` e `price_cents`

### Telefones

Salve telefones normalizados, preferencialmente no formato `55DDDNUMERO` (ex.: `5511999999999`).

### Fotos

1. Crie/use o bucket `wedding-photos`
2. Envie arquivos para:
   - `hero/cover.jpg`
   - `gallery/photo-1.jpg`
   - `gallery/photo-2.jpg`
   - `gifts/...`
3. Atualize os caminhos em [`lib/content.ts`](lib/content.ts) e `gift_items.image_path`

## Configuração do Stripe

1. Crie produtos e preços no Stripe (modo teste)
2. Copie o `price_...` para `gift_items.stripe_price_id`
3. Configure webhook apontando para:

```text
https://SEU-DOMINIO/api/stripe/webhook
```

Eventos recomendados:

- `checkout.session.completed`
- `checkout.session.expired`

## Deploy na Vercel

1. Envie o repositório para o GitHub
2. Importe o projeto na Vercel
3. Configure as mesmas variáveis de `.env.example`
4. Atualize `NEXT_PUBLIC_SITE_URL` para a URL de produção
5. Atualize o webhook do Stripe com a URL final

## Conteúdo do site

Edite textos, nomes, data e caminhos de fotos em [`lib/content.ts`](lib/content.ts).

## Fluxo do convidado

1. Percorre o convite em etapas (capa, história, detalhes, programação)
2. Informa o telefone
3. Confirma presença de cada membro da família
4. É redirecionado para `/gifts`
5. Escolhe um presente e paga via Stripe Checkout

## Cores

- Fundos: `#FAF6EF`, `#F0E9DC`, `#DDD3C2`
- Mulheres: `#F12385`
- Homens: `#003817`
