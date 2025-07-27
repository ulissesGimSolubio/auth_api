# Agendei Back API

API RESTful desenvolvida em Node.js com Express e Prisma ORM, focada em autenticação de usuários, controle de acesso, autenticação em dois fatores (2FA) e funcionalidades de redefinição de senha via e-mail.

## 🚀 Tecnologias

- **Node.js**
- **Express**
- **Prisma (ORM)**
- **PostgreSQL**
- **JWT**
- **bcrypt**
- **nodemailer**
- **speakeasy** (2FA)
- **qrcode**
- **dotenv**

---

## 📦 Instalação

```bash
git clone https://github.com/seuusuario/agendei_back_api.git
cd agendei_back_api
npm install

## ⚙️ Configuração do .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

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

# SMTP (usado para envio de email na recuperação de senha)
SMTP_USER=email_de_envio@gmail.com
SMTP_PASS=senha_app_gmail

## ⚙️ Scripts úteis

- npm run dev                         # inicia com nodemon
- npm run start                       # inicia com node
- npx prisma generate                 # gera o client Prisma
- npx prisma migrate dev --name init # cria/atualiza migracoes
