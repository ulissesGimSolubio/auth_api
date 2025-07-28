# Configuração de Ambientes

Este projeto usa diferentes arquivos `.env` para cada ambiente.

## Arquivos de Ambiente

- `.env.example` - Template com todas as variáveis necessárias
- `.env.development` - Configurações para desenvolvimento
- `.env.test` - Configurações para testes
- `.env.production` - Configurações para produção
- `.env` - Arquivo local (não commitado)

## Como Usar

### 1. Configuração Inicial
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações locais
nano .env
```

### 2. Scripts por Ambiente

```bash
# Desenvolvimento
npm run dev                # Inicia com nodemon + NODE_ENV=development
npm run start:dev          # Inicia com node + NODE_ENV=development

# Teste
npm run test               # Executa testes com NODE_ENV=test
npm run test:watch         # Testes em modo watch
npm run migrate:test       # Migra database de teste

# Produção
npm start                  # Inicia com NODE_ENV=production
```

## Variáveis de Ambiente

### Essenciais
- `DATABASE_URL` - String de conexão PostgreSQL
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_REFRESH_SECRET` - Chave para refresh tokens

### URLs e CORS
- `FRONTEND_URL` - URL principal do frontend
- `ADMIN_URL` - URL do painel administrativo
- `MOBILE_APP_URL` - URL do app mobile
- `STAGING_URL` - URL do ambiente de staging
- `ALLOWED_ORIGINS` - Lista de domínios separados por vírgula

### Opcionais
- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (development/test/production)
- `SMTP_*` - Configurações de email

## Configuração de Múltiplos Domínios

### Opção 1: Variáveis específicas
```bash
FRONTEND_URL=https://app.seusite.com
ADMIN_URL=https://admin.seusite.com
MOBILE_APP_URL=https://mobile.seusite.com
```

### Opção 2: Lista separada por vírgula
```bash
ALLOWED_ORIGINS=https://app.com,https://admin.app.com,https://mobile.app.com
```

### Opção 3: Combinação (recomendado)
```bash
FRONTEND_URL=https://app.seusite.com
ADMIN_URL=https://admin.seusite.com
ALLOWED_ORIGINS=https://parceiro1.com,https://parceiro2.com
```

## Testando CORS

### Rotas de teste disponíveis:
- `GET /api/cors-test` - Informações detalhadas do CORS
- `GET /api/health/cors` - Status do CORS

### Como testar:
```bash
# Teste local
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/cors-test

# Teste com origem não permitida
curl -H "Origin: http://malicious.com" http://localhost:3000/api/cors-test
```

## Segurança

⚠️ **NUNCA** comite arquivos `.env` com dados sensíveis!

- Arquivos `.env` estão no `.gitignore`
- Use `.env.example` como template
- Em produção, configure as variáveis no servidor/container

## Ordem de Precedência

O sistema carrega os arquivos nesta ordem:
1. `.env.${NODE_ENV}.local` (ex: .env.development.local)
2. `.env.local`
3. `.env.${NODE_ENV}` (ex: .env.development)
4. `.env`

Arquivos carregados depois sobrescrevem os anteriores.
