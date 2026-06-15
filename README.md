# App Reminder

API RESTful desenvolvida com NestJS para cadastro de usuarios, autenticacao com JWT e gestao de lembretes pessoais.

## Tecnologias

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Passport
- bcryptjs
- class-validator
- Helmet
- @nestjs/throttler
- Docker

## Funcionalidades

- Cadastro de usuarios
- Login com geracao de JWT
- Hash de senha com bcryptjs
- Rotas protegidas com JWT
- Rate limiting nas rotas de autenticacao
- Criacao de lembretes
- Listagem de lembretes do usuario autenticado
- Edicao de lembretes
- Marcacao de lembrete como concluido
- Remocao de lembretes
- Relacionamento entre usuarios e lembretes

## Requisitos

- Node.js 22+
- npm
- Docker
- Docker Compose

## Configuracao

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Preencha o `.env` com seus valores reais:

```env
# ======= app =======
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
PORT=3000

# ======= jwt =======
JWT_SECRET=troque_por_um_valor_secreto_longo
JWT_EXPIRES_IN=1d

# ======= database =======
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=troque_por_uma_senha_forte
DB_DATABASE=app_reminder
```

> O arquivo `.env` esta no `.gitignore` e nunca deve ser commitado. Use `.env.example` como referencia.

## Rodando Apenas o Banco com Docker

Use esta opcao durante o desenvolvimento local da API:

```bash
docker compose up -d postgres
```

Depois rode a aplicacao em modo desenvolvimento:

```bash
npm run start:dev
```

A API ficara disponivel em:

```
http://localhost:3000/api
```

## Rodando API e Banco com Docker

Para subir a aplicacao completa em containers:

```bash
docker compose up --build
```

Nesse caso, o Docker Compose carrega as variaveis do `.env` automaticamente via `env_file`.

## Scripts

```bash
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run format
npm run test
```

## Endpoints

Todas as rotas usam o prefixo:

```
/api
```

## Autenticacao

### Cadastro

```
POST /api/auth/register
```

Body:

```json
{
  "name": "Ryu Sakazaki",
  "email": "sakazaki@email.com",
  "password": "123456"
}
```

### Login

```
POST /api/auth/login
```

Body:

```json
{
  "email": "sakazaki@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "access_token": "jwt-token"
}
```

> Rate limiting ativo: maximo de 5 tentativas por minuto nesta rota.

### Perfil

```
GET /api/auth/profile
Authorization: Bearer <token>
```

Resposta:

```json
{
  "userId": 1,
  "email": "sakazaki@email.com"
}
```

## Lembretes

Todas as rotas de lembretes exigem autenticacao:

```
Authorization: Bearer <token>
```

### Criar Lembrete

```
POST /api/reminders
```

Body:

```json
{
  "title": "Estudar NestJS",
  "description": "Criar API de lembretes com TypeORM",
  "dueDate": "2026-06-20T10:00:00.000Z"
}
```

### Listar Lembretes

```
GET /api/reminders
```

### Marcar Como Concluido

```
PATCH /api/reminders/:id/complete
```

### Editar Lembrete

```
PUT /api/reminders/:id
```

Body:

```json
{
  "title": "Estudar NestJS e PostgreSQL",
  "description": "Atualizar lembrete",
  "dueDate": "2026-06-21T10:00:00.000Z"
}
```

### Deletar Lembrete

```
DELETE /api/reminders/:id
```

## Validacoes

A API utiliza `class-validator` e `ValidationPipe` global para validar os dados de entrada.

Exemplos de validacao:

- `name` e obrigatorio no cadastro
- `email` deve ser valido e unico
- `password` deve ter no minimo 6 caracteres
- `title` e obrigatorio ao criar lembrete
- `dueDate` deve ser uma data valida
- Campos nao permitidos sao rejeitados

## Seguranca

- Senhas armazenadas com hash via `bcryptjs`
- Autenticacao via JWT com expiracao configuravel
- Rotas privadas protegidas por `JwtAuthGuard`
- Usuarios so podem acessar, editar ou remover os proprios lembretes
- A senha nao e retornada nas respostas da API
- Email com constraint `unique` no banco de dados
- Rate limiting nas rotas de autenticacao via `@nestjs/throttler`
- Headers HTTP de seguranca via `helmet`
- CORS configurado para permitir apenas origens definidas em `ALLOWED_ORIGINS`
- Variaveis de ambiente sensiveis isoladas no `.env` (fora do controle de versao)
- `synchronize` do TypeORM desativado automaticamente em `NODE_ENV=production`

## Banco de Dados

O projeto utiliza PostgreSQL com TypeORM.

O `synchronize` esta habilitado apenas em ambiente de desenvolvimento (`NODE_ENV=development`), criando e atualizando tabelas automaticamente a partir das entities.

Em producao, o recomendado e substituir essa configuracao por migrations.

## Estrutura Principal

```
src/
  auth/
    decorators/
    dto/
    types/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    jwt-auth.guard.ts
    jwt.strategy.ts

  users/
    user.entity.ts
    users.module.ts
    users.service.ts

  reminders/
    dto/
    reminder.entity.ts
    reminders.controller.ts
    reminders.module.ts
    reminders.service.ts

  app.module.ts
  main.ts
```

## Observacoes

Este projeto foi desenvolvido como uma API de estudo e pratica com NestJS, aplicando conceitos como modulos, controllers, services, DTOs, guards, strategies, entities, repositories, autenticacao JWT e boas praticas de seguranca.
