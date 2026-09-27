# FinTrack

Aplicação web de controle financeiro pessoal. Slogan: **Seu dinheiro. Seu controle. Seu futuro.**

## O que está incluído

- Cadastro, login, recuperação de senha, alteração de senha e sessões
- Painel com saldo, receitas, despesas, economia, período e insights
- Transações reais (receita/despesa), categorias, contas, histórico, pesquisa e filtros
- Gráficos, metas com contribuições, orçamento mensal e notificações
- Exportação CSV/PDF dos dados do próprio usuário
- Área administrativa protegida no servidor, com métricas agregadas e auditoria
- Isolamento de dados por usuário; senhas com hash; administrador inicial com troca obrigatória da senha

## Como executar

1. Instale as dependências (`npm install`).
2. Execute o servidor de desenvolvimento (`npm run dev`).
3. A aplicação escuta na porta 8080.

Não é necessário criar um arquivo `.env` para o preview: o banco local (PGLite) sobe automaticamente e as credenciais de autenticação federada são injetadas no deploy.

## Banco de dados

As migrations em `migrations/` são a fonte do schema.

- `0001_auth.sql` — Better Auth (`user`, `session`, `account`, `verification`)
- `0002_fintrack.sql` — perfis, transações, categorias, contas, orçamentos, metas, notificações, configurações, auditoria

No preview, as migrations aplicam sozinhas na inicialização. No deploy, `npm run build` executa `npm run db:migrate` contra `DATABASE_URL`.

## Variáveis de ambiente (servidor)

Nunca coloque segredos no frontend. No deploy, a plataforma injeta `DATABASE_URL` e as credenciais de autenticação. Variáveis opcionais do administrador inicial:

| Variável | Função | Padrão de bootstrap |
| --- | --- | --- |
| `DATABASE_URL` | Postgres (Neon). Se ausente, usa PGLite local | — |
| `ADMIN_USERNAME` | Nome do administrador inicial | `admin` |
| `ADMIN_EMAIL` | E-mail do administrador inicial | `admin@fintrack.local` |
| `ADMIN_INITIAL_PASSWORD` | Senha inicial (somente bootstrap) | `FinTrack@Admin2026!` |
| `BETTER_AUTH_SECRET` | Segredo de sessão (injetado no deploy) | gerado no preview |
| `BETTER_AUTH_URL` | URL pública da app | origin dinâmico |

A senha inicial existe só para o primeiro acesso. Depois da troca obrigatória, apenas o novo hash permanece.

## Administrador inicial

O administrador é criado automaticamente se ainda não existir (sem duplicar em reinícios). Entre com o e-mail administrativo (ou o usuário `admin`) e a senha inicial. No primeiro acesso a troca de senha é obrigatória.

## Testes

```sh
npm test
```

Cobre cálculo de saldo, período, orçamento, metas, validação de senha, insights e checagens de isolamento/autorização no código servidor.

## Build e deploy

```sh
npm run typecheck
npm run build
```

O deploy provisiona Postgres quando há migrations e autenticação. Segredos não `VITE_` não vão para o navegador.

## Segurança

- Hash de senha via Better Auth
- Toda leitura/escrita financeira é filtrada por `context.userId` no servidor
- Rotas administrativas chamam `requireAdmin`
- Rate limit na recuperação de senha
- Exportação restrita aos dados do usuário autenticado
