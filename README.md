# Site de Casamento

Site mobile-first para convite de casamento, confirmação de presença por família e lista de presentes com InfinitePay.

## Stack

- Next.js (App Router)
- Supabase (dados, storage e RLS)
- InfinitePay Checkout Integrado (Pix e cartão)
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

3. Preencha `.env.local` com as chaves do Supabase e o `INFINITEPAY_HANDLE` (InfiniteTag, sem `$`).

4. Execute as migrations em [`supabase/migrations/`](supabase/migrations/) no Supabase Dashboard (SQL Editor), na ordem.

5. Inicie o projeto:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração do Supabase

### Tabelas

Após rodar as migrations, cadastre manualmente:

1. **`families`**: uma linha por família/convite
2. **`guests`**: convidados ligados ao mesmo `family_id`
3. **`gift_items`**: presentes com `name`, `price_cents` e opcionalmente `image_path`

Ou use [`supabase/seed_guests.sql`](supabase/seed_guests.sql) para a lista de convidados.

### Telefones

Salve telefones normalizados, preferencialmente no formato `55DDDNUMERO` (ex.: `5511999999999`).

### Fotos

1. Crie/use o bucket `wedding-photos`
2. Envie arquivos para:
   - `hero/cover.jpg`
   - `gallery/photo-1.jpg`
   - `gallery/photo-2.jpg`
   - `gifts/...`
   - `locations/ceremony.jpg`
   - `locations/party.jpg`
3. Atualize os caminhos em [`lib/content.ts`](lib/content.ts) e `gift_items.image_path`

## Configuração do InfinitePay

1. No app InfinitePay (ou [web](https://app.infinitepay.io/external-checkout#configuracoes)), habilite o **Checkout Integrado**
2. Copie sua InfiniteTag (handle) **sem** o `$` inicial para `INFINITEPAY_HANDLE`
3. O webhook é enviado automaticamente para:

```text
https://SEU-DOMINIO/api/infinitepay/webhook
```

(definido em cada link criado via API)

4. O convidado escolhe Pix ou cartão na página hospedada da InfinitePay

## Deploy na Vercel

1. Envie o repositório para o GitHub
2. Importe o projeto na Vercel
3. Configure as mesmas variáveis de `.env.example`
4. Atualize `NEXT_PUBLIC_SITE_URL` para a URL de produção (ex.: `https://marina-e-bruno.vercel.app`)

## Conteúdo do site

Edite textos, nomes, data e caminhos de fotos em [`lib/content.ts`](lib/content.ts).

## Fluxo do convidado

1. Percorre o convite (capa → detalhes → confirmação)
2. Informa o telefone
3. Confirma presença de cada membro da família
4. É redirecionado para `/gifts`
5. Monta o carrinho e paga via InfinitePay (Pix ou cartão)

## Cores

- Fundos: `#FAF6EF`, `#F0E9DC`, `#DDD3C2`
- Mulheres: `#F12385`
- Homens: `#003817`
