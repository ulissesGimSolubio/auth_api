# 🧪 **PLANO COMPLETO DE TESTES - AUTH_API**

## 📋 **ANÁLISE ATUAL - O QUE FALTA DE TESTES**

### ❌ **Status Atual:**
- **0 testes implementados**
- Jest configurado no package.json mas sem estrutura de testes
- Nenhum arquivo de teste encontrado
- Cobertura: **0%**

---

## 🎯 **ESTRUTURA DE TESTES A IMPLEMENTAR**

```
tests/
├── setup/
│   ├── testSetup.js          # Configuração global de testes
│   ├── testDatabase.js       # Database em memória para testes
│   └── testHelpers.js        # Funções auxiliares
├── unit/
│   ├── controllers/
│   │   ├── auth.controller.test.js
│   │   ├── password.controller.test.js
│   │   ├── invite.controller.test.js
│   │   └── user.controller.test.js
│   ├── services/
│   │   ├── twoFactor.service.test.js
│   │   ├── email.service.test.js
│   │   ├── token.service.test.js
│   │   └── inviteEmail.service.test.js
│   ├── middlewares/
│   │   ├── authMiddleware.test.js
│   │   ├── roleMiddleware.test.js
│   │   └── limitLoginAttempts.test.js
│   └── utils/
│       ├── jwt.utils.test.js
│       └── password.utils.test.js
├── integration/
│   ├── auth.routes.test.js
│   ├── password.routes.test.js
│   ├── user.routes.test.js
│   └── database.test.js
├── e2e/
│   ├── auth.flow.test.js
│   ├── user.flow.test.js
│   └── 2fa.flow.test.js
└── mocks/
    ├── email.mock.js
    ├── database.mock.js
    └── jwt.mock.js
```

---

## 📝 **CASOS DE TESTE DETALHADOS**

### 🔐 **1. AUTH CONTROLLER**

#### **1.1 Register (auth.controller.js)**
```javascript
describe('Register', () => {
  test('✅ Registrar usuário com dados válidos')
  test('✅ Registrar com token de convite válido')
  test('❌ Falhar com email já existente')
  test('❌ Falhar sem token de convite (quando obrigatório)')
  test('❌ Falhar com token de convite inválido')
  test('❌ Falhar com token de convite expirado')
  test('❌ Falhar com token de convite usado')
  test('❌ Falhar com email não correspondente ao convite')
  test('❌ Falhar com senha fraca')
  test('❌ Falhar com dados faltantes')
})
```

#### **1.2 Login (auth.controller.js)**
```javascript
describe('Login', () => {
  test('✅ Login com credenciais válidas (sem 2FA)')
  test('✅ Login com 2FA habilitado - retornar 2faRequired')
  test('❌ Falhar com email inexistente')
  test('❌ Falhar com senha incorreta')
  test('❌ Falhar com usuário bloqueado')
  test('❌ Falhar com usuário inativo')
  test('✅ Registrar tentativa de login no banco')
  test('✅ Gerar accessToken e refreshToken válidos')
})
```

#### **1.3 2FA (auth.controller.js)**
```javascript
describe('Two Factor Authentication', () => {
  test('✅ Habilitar 2FA - gerar QR code')
  test('✅ Verificar código 2FA válido')
  test('❌ Falhar com código 2FA inválido')
  test('❌ Falhar com usuário sem 2FA configurado')
  test('✅ Gerar tokens após verificação 2FA')
})
```

#### **1.4 Tokens (auth.controller.js)**
```javascript
describe('Token Management', () => {
  test('✅ Refresh token válido')
  test('❌ Falhar com refresh token inválido')
  test('❌ Falhar com refresh token expirado')
  test('❌ Falhar com refresh token revogado')
  test('✅ Logout - revogar refresh token')
  test('❌ Falhar logout sem refresh token')
})
```

#### **1.5 Convites (auth.controller.js)**
```javascript
describe('Invite System', () => {
  test('✅ Enviar convite (role ADMIN)')
  test('✅ Enviar convite (role COORDENADOR)')
  test('❌ Falhar convite sem permissão')
  test('✅ Gerar token único de convite')
  test('✅ Definir data de expiração')
})
```

---

### 🔑 **2. PASSWORD CONTROLLER**

```javascript
describe('Password Controller', () => {
  test('✅ Solicitar reset - email válido')
  test('❌ Falhar reset - email inexistente')
  test('✅ Validar token de reset válido')
  test('❌ Falhar token de reset inválido/expirado')
  test('✅ Redefinir senha com token válido')
  test('❌ Falhar redefinição com token inválido')
  test('✅ Deletar token após uso')
})
```

---

### 👥 **3. USER CONTROLLER**

```javascript
describe('User Controller - Admin Actions', () => {
  test('✅ Bloquear usuário (ADMIN)')
  test('✅ Desbloquear usuário (ADMIN)')
  test('✅ Inativar usuário (ADMIN)')
  test('✅ Ativar usuário (ADMIN)')
  test('✅ Atribuir role (ADMIN)')
  test('✅ Remover role (ADMIN)')
  test('✅ Listar usuários com paginação')
  test('✅ Buscar usuário por ID')
  test('❌ Falhar ações sem permissão ADMIN')
  test('❌ Falhar com usuário inexistente')
})
```

---

### 🛡️ **4. MIDDLEWARES**

#### **4.1 Auth Middleware**
```javascript
describe('Auth Middleware', () => {
  test('✅ Aceitar token JWT válido')
  test('❌ Rejeitar sem token')
  test('❌ Rejeitar token inválido')
  test('❌ Rejeitar token expirado')
  test('✅ Extrair userId e roles corretamente')
})
```

#### **4.2 Role Middleware**
```javascript
describe('Role Middleware', () => {
  test('✅ Permitir acesso com role autorizada')
  test('❌ Bloquear acesso sem role')
  test('❌ Bloquear acesso com role insuficiente')
  test('✅ Permitir múltiplas roles')
})
```

#### **4.3 Rate Limiting**
```javascript
describe('Rate Limiting', () => {
  test('✅ Permitir requisições dentro do limite')
  test('❌ Bloquear após exceder limite')
  test('✅ Reset do contador após janela de tempo')
  test('✅ Limite específico para login')
})
```

---

### 🔧 **5. SERVICES**

#### **5.1 Two Factor Service**
```javascript
describe('Two Factor Service', () => {
  test('✅ Gerar segredo 2FA válido')
  test('✅ Gerar QR code válido')
  test('✅ Verificar token válido')
  test('❌ Rejeitar token inválido')
  test('✅ Verificar com janela de tempo')
})
```

#### **5.2 Email Services**
```javascript
describe('Email Services', () => {
  test('✅ Enviar email de reset de senha')
  test('✅ Enviar email de convite')
  test('❌ Falhar com configuração SMTP inválida')
  test('✅ Formatar template corretamente')
})
```

#### **5.3 Token Service**
```javascript
describe('Token Service', () => {
  test('✅ Gerar token de reset único')
  test('✅ Validar formato UUID')
  test('✅ Definir expiração correta')
})
```

---

### 🌐 **6. ROTAS (INTEGRATION TESTS)**

#### **6.1 Auth Routes**
```javascript
describe('POST /api/auth/register', () => {
  test('✅ 201 - Registro bem-sucedido')
  test('❌ 409 - Email já existe')
  test('❌ 400 - Dados inválidos')
})

describe('POST /api/auth/login', () => {
  test('✅ 200 - Login bem-sucedido')
  test('❌ 401 - Credenciais inválidas')
  test('❌ 429 - Rate limit excedido')
})

describe('POST /api/auth/logout', () => {
  test('✅ 200 - Logout bem-sucedido')
  test('❌ 401 - Sem autorização')
})
```

#### **6.2 User Routes**
```javascript
describe('PATCH /api/users/:id/block', () => {
  test('✅ 200 - Usuário bloqueado (ADMIN)')
  test('❌ 403 - Sem permissão')
  test('❌ 404 - Usuário não encontrado')
})

describe('GET /api/users', () => {
  test('✅ 200 - Lista com paginação')
  test('✅ 200 - Filtrar por status')
  test('❌ 403 - Sem permissão ADMIN')
})
```

---

### 🎭 **7. E2E TESTS (FLUXOS COMPLETOS)**

#### **7.1 Fluxo de Registro e Login**
```javascript
describe('Complete Auth Flow', () => {
  test('✅ Registro → Login → Acesso a rota protegida')
  test('✅ Registro com convite → Login → Verificar role')
  test('✅ Login → Habilitar 2FA → Login com 2FA')
})
```

#### **7.2 Fluxo de Reset de Senha**
```javascript
describe('Password Reset Flow', () => {
  test('✅ Solicitar reset → Validar token → Redefinir senha → Login')
})
```

#### **7.3 Fluxo Administrativo**
```javascript
describe('Admin Management Flow', () => {
  test('✅ Admin bloqueia usuário → Usuário não consegue login')
  test('✅ Admin atribui role → Usuário ganha acesso')
})
```

---

## 📊 **MÉTRICAS DE COBERTURA ALVO**

### **🎯 Metas de Cobertura:**
- **Statements:** 90%+
- **Branches:** 85%+
- **Functions:** 95%+
- **Lines:** 90%+

### **📈 Cobertura por Módulo:**
```yaml
Controllers: 95%+    # Lógica crítica de negócio
Services: 90%+       # Serviços essenciais
Middlewares: 95%+    # Segurança crítica
Routes: 85%+         # Integração
Utils: 90%+          # Funções auxiliares
```

---

## 🛠️ **DEPENDÊNCIAS NECESSÁRIAS**

```bash
npm install --save-dev \
  jest \
  supertest \
  @jest/globals \
  sqlite3 \
  jest-environment-node \
  nodemailer-mock \
  jsonwebtoken \
  bcryptjs
```

---

## ⚙️ **CONFIGURAÇÃO JEST**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testSetup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 95,
      lines: 90
    }
  }
};
```

---

## 📝 **SCRIPTS DE TESTE**

```json
{
  "scripts": {
    "test": "NODE_ENV=test jest --runInBand",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "test:unit": "NODE_ENV=test jest tests/unit",
    "test:integration": "NODE_ENV=test jest tests/integration",
    "test:e2e": "NODE_ENV=test jest tests/e2e"
  }
}
```

---

## 🚀 **PRÓXIMOS PASSOS**

### **Fase 1: Setup Básico (Semana 1)**
1. ✅ Instalar dependências de teste
2. ✅ Configurar Jest
3. ✅ Criar setup de banco de teste
4. ✅ Implementar helpers básicos

### **Fase 2: Testes Unitários (Semana 2-3)**
1. ✅ Controllers (auth, password, user)
2. ✅ Services (2FA, email, token)
3. ✅ Middlewares (auth, role, rate limit)

### **Fase 3: Testes de Integração (Semana 4)**
1. ✅ Rotas auth
2. ✅ Rotas user
3. ✅ Database operations

### **Fase 4: Testes E2E (Semana 5)**
1. ✅ Fluxos completos
2. ✅ Cenários de erro
3. ✅ Performance tests

### **Fase 5: CI/CD (Semana 6)**
1. ✅ GitHub Actions
2. ✅ Coverage reports
3. ✅ Quality gates

---

## 📋 **RESUMO EXECUTIVO**

| Categoria | Quantidade | Status | Prioridade |
|-----------|------------|--------|------------|
| **Unit Tests** | 47 casos | ❌ | 🔥 Alta |
| **Integration Tests** | 15 casos | ❌ | 🔥 Alta |
| **E2E Tests** | 8 fluxos | ❌ | 🟡 Média |
| **Setup & Config** | 5 arquivos | ❌ | 🔥 Alta |

**TOTAL: 75+ casos de teste a implementar**

**🎯 Começar por:** Setup básico → Unit tests (controllers) → Integration tests

**Quer que eu comece implementando alguma parte específica?** 🚀
