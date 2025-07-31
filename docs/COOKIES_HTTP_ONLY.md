# 🍪 Configuração de Cookies HTTP Only

Esta API suporta dois modos de autenticação:

## 🔐 Modo Cookie HTTP Only (Recomendado)

### Configuração
No arquivo `.env`, defina:
```bash
COOKIE_HTTP_ONLY=true
```

### Como Funciona
- ✅ Tokens são enviados como cookies `httpOnly`
- ✅ Maior segurança contra ataques XSS
- ✅ Cookies são automaticamente incluídos nas requisições
- ✅ Configurações automáticas de `secure` e `sameSite` baseadas no ambiente

### Endpoints Afetados

#### 🔑 Login (`POST /api/auth/login`)
**Request:**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante!
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "roles": ["USER"]
  },
  "message": "Login realizado com sucesso. Tokens enviados como cookies HTTP Only."
}
```

**Cookies Definidos:**
- `accessToken` (HttpOnly, 15 minutos)
- `refreshToken` (HttpOnly, 7 dias)

#### 👤 Perfil do Usuário (`GET /api/auth/me`)
**Request:**
```javascript
fetch('/api/auth/me', {
  method: 'GET',
  credentials: 'include' // Importante!
});
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "roles": ["USER"],
  "status": "ACTIVE",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

#### 🔄 Renovar Token (`POST /api/auth/refresh`)
**Request:**
```javascript
fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include' // Importante!
});
```

**Response:**
```json
{
  "message": "Token renovado com sucesso."
}
```

#### 🚪 Logout (`POST /api/auth/logout`)
**Request:**
```javascript
fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include' // Importante!
});
```

## 🔑 Modo Bearer Token (Compatibilidade)

### Configuração
No arquivo `.env`, defina:
```bash
COOKIE_HTTP_ONLY=false
```

### Como Funciona
- ⚠️ Tokens são retornados no corpo da resposta
- ⚠️ Cliente deve gerenciar os tokens manualmente
- ⚠️ Deve incluir `Authorization: Bearer <token>` nos headers

### Endpoints Afetados

#### 🔑 Login (`POST /api/auth/login`)
**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "roles": ["USER"]
  }
}
```

#### 👤 Perfil do Usuário (`GET /api/auth/me`)
**Request:**
```javascript
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
});
```

## 🧪 Como Testar

### 1. Via Script de Teste
```bash
node test-cookies.js
```

### 2. Via Frontend
Certifique-se de incluir `credentials: 'include'` em todas as requisições:

```javascript
// React/JavaScript Example
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true // Para cookies
});

// Fetch API Example
fetch('/api/auth/me', {
  credentials: 'include'
});
```

### 3. Configuração CORS
Para funcionar com cookies, certifique-se de que o CORS está configurado corretamente:

```javascript
// No backend (já configurado)
app.use(cors({
  origin: 'http://localhost:3001', // URL do frontend
  credentials: true
}));
```

## 🔒 Configurações de Segurança

### Desenvolvimento
```javascript
{
  httpOnly: true,
  secure: false,      // HTTP permitido
  sameSite: 'lax'    // Menos restritivo
}
```

### Produção
```javascript
{
  httpOnly: true,
  secure: true,       // Apenas HTTPS
  sameSite: 'strict' // Mais restritivo
}
```

## ❗ Pontos Importantes

1. **Frontend deve incluir `credentials: 'include'`** em todas as requisições
2. **CORS deve permitir credentials** com `credentials: true`
3. **Em produção, usar apenas HTTPS** para cookies seguros
4. **Tokens em cookies não são acessíveis via JavaScript** (proteção XSS)
5. **Logout limpa automaticamente os cookies**

## 🐛 Troubleshooting

### Erro: "Token de acesso não encontrado nos cookies"
- Verifique se `credentials: 'include'` está sendo usado
- Confirme se o login foi feito com sucesso
- Verifique se os cookies não expiraram

### Erro: CORS
- Configure `withCredentials: true` no cliente
- Configure `credentials: true` no servidor CORS
- Verifique se a origem está permitida

### Cookies não são salvos
- Verifique se está usando `credentials: 'include'`
- Em desenvolvimento, certifique-se que está usando HTTP (secure: false)
- Verifique se o domínio/porta estão corretos
