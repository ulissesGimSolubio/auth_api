
# 🚀 Agendei Back API

API REST para autenticação e agendamento, com suporte a autenticação em dois fatores (2FA), reset de senha, tokens JWT e envio de e-mails.

---

## 🧰 Tecnologias

- Node.js
- Express
- PostgreSQL + Prisma ORM
- JWT e Refresh Token
- 2FA com Speakeasy + QRCode
- Bcrypt
- Nodemailer com Gmail (senha de app)
- Estrutura modular: controllers, services e middlewares

---

## 📦 Instalação

```bash
git clone https://github.com/seuusuario/agendei_back_api.git
cd agendei_back_api
npm install
```

---

## ⚙️ Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Banco de Dados
DATABASE_URL=postgresql://usuario_do_banco:senha_do_banco@localhost:5432/agendei_api

# Porta da API
PORT=3000

# JWT Principal
JWT_SECRET=senha_secreta
JWT_EXPIRES_IN=15m

# Refresh Token
JWT_REFRESH_SECRET=outra_senha_secreta
JWT_REFRESH_EXPIRES_IN=7d

# SMTP (usado para recuperação de senha)
SMTP_USER=email_de_envio@gmail.com
SMTP_PASS=senha_app_gmail
```

---

## ✅ Funcionalidades Implementadas

```yaml
🔐 Autenticação de Usuários:
  - Registro (/api/auth/register)
  - Login (/api/auth/login)
  - Logout (/api/auth/logout)
  - Refresh Token (/api/auth/refresh-token)

🔐 2FA (Autenticação em dois fatores):
  - Ativar (/api/auth/enable-2fa)
  - Verificar (/api/auth/verify-2fa)

🔑 Redefinição de Senha:
  - Solicitar token (/api/password/forgot)
  - Validar token (/api/password/reset/:token)
  - Redefinir senha (/api/password/reset/:token)

🛡️ Proteção de rotas com JWT:
  - Middleware: Authorization: Bearer <token>
```

---

## 📁 Estrutura de Pastas

```text
src/
  config/
    dbConnection.js
  modules/
    auth/
      controllers/
      services/
      routes/
middlewares/
prisma/
.env
server.js
```


---

## 🧪 Banco de Dados e SMTP Utilizados

Esta API foi implementada utilizando:

```yaml
Banco de Dados:
  - PostgreSQL (recomendado)
    Exemplo de conexão:
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/agendei_api

SMTP (envio de e-mails):
  - Gmail com senha de app
    Exemplo:
    SMTP_USER=seu_email@gmail.com
    SMTP_PASS=sua_senha_de_app
```

### 🔄 Exemplos de outros bancos de dados com Prisma

```yaml
MySQL:
  DATABASE_URL="mysql://usuario:senha@localhost:3306/agendei_api"

SQLite:
  DATABASE_URL="file:./dev.db"

SQL Server:
  DATABASE_URL="sqlserver://usuario:senha@localhost:1433;database=agendei_api"
```
