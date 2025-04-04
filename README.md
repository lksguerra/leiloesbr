# Sistema de Leilões

Sistema administrativo para visualização e acompanhamento de leilões judiciais e extrajudiciais.

## Tecnologias Utilizadas

- React
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Autenticação e Banco de Dados)

## Funcionalidades

- Interface moderna e responsiva
- Autenticação segura
- Visualização de leilões em grid
- Filtros avançados para busca de imóveis
- Detalhes completos dos imóveis
- Sistema de favoritos
- Atualizações em tempo real
- Integração com plataformas de leilão

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd admin-auctions
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Banco de Dados

### Tabela: auctions

```sql
create table auctions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type text not null check (type in ('judicial', 'extrajudicial')),
  starting_price decimal(10,2) not null,
  current_price decimal(10,2) not null,
  end_date timestamp with time zone not null,
  status text not null check (status in ('active', 'ended', 'cancelled')),
  location text not null,
  category text not null,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  images text[],
  image_url text,
  address text,
  area numeric,
  bedrooms integer,
  bathrooms integer,
  parking_spots integer,
  is_favorite boolean default false,
  link_acesso text
);

-- Trigger para atualizar o updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_auctions_updated_at
  before update on auctions
  for each row
  execute function update_updated_at_column();
```

## Estrutura do Projeto

```
admin-auctions/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── auctions/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── AuctionFilters.tsx
│   │       ├── Loading.tsx
│   │       ├── Pagination.tsx
│   │       ├── PropertyPlaceholder.tsx
│   │       └── Toast.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   └── supabase/
│   │       └── config.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── package.json
└── README.md
```

## Uso

1. Faça login no sistema usando suas credenciais
2. Na página principal, você verá uma lista de leilões disponíveis
3. Use os filtros para encontrar imóveis específicos
4. Clique no ícone de olho para ver detalhes completos do imóvel
5. Marque seus leilões favoritos clicando no ícone de coração
6. Acesse o leilão na plataforma externa através do botão "Tenho Interesse"

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.
