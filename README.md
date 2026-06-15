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
- Docker

## Funcionalidades

- Cadastro de usuarios
- Login com geracao de JWT
- Hash de senha com bcryptjs
- Rotas protegidas com JWT
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

Exemplo de `.env`:

```env
PORT=3000

JWT_SECRET=dev-secret
JWT_EXPIRES_IN=1d

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=app_reminder
```

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

```txt
http://localhost:3000/api
```

## Rodando API e Banco com Docker

Para subir a aplicacao completa em containers:

```bash
docker compose up --build
```

Nesse caso, dentro do Docker Compose, a API usa `DB_HOST=postgres`, pois `postgres` e o nome do servico do banco na rede interna do Docker.

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

```txt
/api
```

## Autenticacao

### Cadastro

```http
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

```http
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

### Perfil

```http
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

```http
Authorization: Bearer <token>
```

### Criar Lembrete

```http
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

```http
GET /api/reminders
```

### Marcar Como Concluido

```http
PATCH /api/reminders/:id/complete
```

### Editar Lembrete

```http
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

```http
DELETE /api/reminders/:id
```

## Validacoes

A API utiliza `class-validator` e `ValidationPipe` global para validar os dados de entrada.

Exemplos de validacao:

- `name` e obrigatorio no cadastro
- `email` deve ser valido
- `password` deve ter no minimo 6 caracteres
- `title` e obrigatorio ao criar lembrete
- `dueDate` deve ser uma data valida
- Campos nao permitidos sao rejeitados

## Seguranca

- Senhas sao armazenadas com hash usando `bcryptjs`
- O login retorna um JWT
- Rotas privadas exigem token no header `Authorization`
- Usuarios so podem acessar, editar ou remover os proprios lembretes
- A senha nao e retornada nas respostas da API

## Banco de Dados

O projeto utiliza PostgreSQL com TypeORM.

Durante o desenvolvimento, o TypeORM esta configurado com:

```ts
synchronize: true
```

Isso permite criar e atualizar tabelas automaticamente a partir das entities.

Em producao, o recomendado e substituir essa configuracao por migrations.

## Estrutura Principal

```txt
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

Este projeto foi desenvolvido como uma API de estudo e pratica com NestJS, aplicando conceitos como modulos, controllers, services, DTOs, guards, strategies, entities, repositories e autenticacao JWT.
