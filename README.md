# Stock.io — Back-end

API do back-end da plataforma Stock.io, construída em **NestJS** com **Prisma ORM** e **PostgreSQL**.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 
- [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando localmente
- Uma conta gratuita no [Resend](https://resend.com) (usada para envio de emails, ex: recuperação de senha)

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
# Conexão com o banco de dados PostgreSQL local
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

#stringpara assinar os tokens JWT de autenticação
JWT_SECRET=uma_string_segura

# Tempo de expiração do token JWT (ex: 1h, 7d, 30m)
JWT_EXPIRES_IN=1h

# Chave de API do Resend, usada para envio de emails 
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# URL do front-end, usada para montar links enviados por email
FRONTEND_URL=http://localhost:3000
```


> **Sobre o Resend em modo de testes:** enquanto nenhum domínio próprio for verificado no painel do Resend, o envio de emails só funciona para o endereço de email cadastrado na sua conta Resend. Para enviar para qualquer destinatário, é necessário verificar um domínio próprio, nosso time optou por não hospedar o servidor. Portanto para testar a recuperação de senha, use o mesmo email cadastrado no Resend

## Configurando o banco de dados

Com o PostgreSQL rodando e o `.env` configurado, rode as migrations do Prisma para criar as tabelas:

```bash
npx prisma migrate dev
```

Caso der erro dizendo que o PrismaClient não foi gerado, você pode rodar npx prisma generate para o TypeScript reconhecer os tipos do banco.

```bash
npx prisma generate
```

### Populando o banco com dados de teste (opcional)

O projeto possui um script de seed que popula o banco com categorias, lojas, produtos e usuários de exemplo:

```bash
npx prisma db seed
```

## Rodando o projeto em desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em **http://localhost:3001**.

