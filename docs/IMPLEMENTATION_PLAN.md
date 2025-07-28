# Plano de Implementação: 2 APIs

## 🎯 **Decisão Final: auth_api + operations_api**

### 📋 **Divisão de Responsabilidades:**

```
🔐 auth_api:3001        🏢 operations_api:3002
├── Autenticação        ├── Perfis de usuário
├── Autorização         ├── Lógica de negócio  
├── Controle admin      ├── Agendamentos
├── Segurança           ├── Relatórios
└── Gestão de roles     └── Dashboard
```

---

## 🚀 **FASE 1: Preparar auth_api (Agora)**

### 1. **Adicionar endpoints de perfil temporariamente:**
```javascript
// Em src/modules/users/controllers/user.controller.js
+ getMyProfile()     // GET /api/users/profile
+ updateMyProfile()  // PUT /api/users/profile
+ uploadAvatar()     // POST /api/users/profile/avatar
```

### 2. **Organizar estrutura para separação futura:**
```
src/modules/users/
├── controllers/
│   ├── user.controller.js      (admin functions)
│   └── profile.controller.js   (user profile - mover depois)
└── routes/
    ├── user.routes.js          (admin routes)
    └── profile.routes.js       (profile routes - mover depois)
```

### 3. **Definir contratos de API bem claros:**
```javascript
// Padronizar respostas JSON
// Definir estrutura de erros
// Documentar endpoints no Swagger
```

---

## 🏗️ **FASE 2: Criar operations_api (Futuro)**

### 1. **Setup inicial:**
```bash
mkdir operations_api
cd operations_api
npm init -y
# Copiar estrutura base da auth_api
```

### 2. **Mover funcionalidades:**
```javascript
// Mover de auth_api para operations_api:
- profile.controller.js
- profile.routes.js
- Lógica de upload de arquivos
- Validações específicas de perfil
```

### 3. **Implementar lógica de negócio:**
```javascript
// Novos módulos em operations_api:
src/modules/
├── profiles/     (movido da auth_api)
├── appointments/ (novo)
├── services/     (novo)
├── reports/      (novo)
└── dashboard/    (novo)
```

---

## 🔗 **Comunicação entre APIs**

### 1. **JWT Token compartilhado:**
```bash
# Mesmo .env nas duas APIs
JWT_SECRET=sua-chave-secreta-compartilhada
JWT_REFRESH_SECRET=sua-refresh-secret-compartilhada
```

### 2. **Middleware reutilizado:**
```javascript
// Criar package npm privado ou copiar arquivo
// auth-middleware.js (mesmo código nas 2 APIs)
```

### 3. **Validação de usuário:**
```javascript
// operations_api verifica se user.active && !user.blocked
// Consulta auth_api ou banco compartilhado
```

---

## 📊 **Configuração de Deploy**

### **Desenvolvimento:**
```bash
# Terminal 1
cd auth_api && npm run dev      # porta 3001

# Terminal 2  
cd operations_api && npm run dev  # porta 3002
```

### **Produção:**
```bash
# Docker ou PM2
auth_api      -> servidor:3001
operations_api -> servidor:3002
nginx         -> proxy reverso
```

---

## ✅ **Checklist de Implementação**

### **Auth API (Manter):**
- [x] Login/logout/register
- [x] JWT tokens e refresh
- [x] 2FA e reset senha
- [x] Controle administrativo (block/unblock)
- [x] Gestão de roles
- [ ] Endpoints de perfil (temporário)

### **Operations API (Criar depois):**
- [ ] Setup projeto
- [ ] Copiar middleware de auth
- [ ] Mover endpoints de perfil
- [ ] Implementar upload de avatar
- [ ] Lógica de agendamentos
- [ ] Sistema de relatórios
- [ ] Dashboard do usuário

---

## 💡 **Próximos Passos**

1. **Você quer que eu implemente os endpoints de perfil na auth_api agora?**
2. **Definir estrutura de dados para perfis?**
3. **Preparar a migração futura para operations_api?**
