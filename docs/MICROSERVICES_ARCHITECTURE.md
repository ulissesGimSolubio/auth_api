# Arquitetura Final: 2 APIs

## 🔐 **auth_api** (API atual)
**Responsabilidade:** Segurança, autenticação e controle administrativo

### Endpoints mantidos:
- POST /api/auth/register (registro inicial)
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/enable-2fa
- POST /api/auth/verify-2fa
- POST /api/auth/invite

### Endpoints administrativos:
- PATCH /api/users/{id}/block
- PATCH /api/users/{id}/unblock
- PATCH /api/users/{id}/enable
- PATCH /api/users/{id}/disable
- POST /api/users/{id}/roles (gerenciar permissões)
- GET /api/users (listar usuários - admin)
- GET /api/users/{id} (ver usuário - admin)

---

## 🏢 **operations_api** (Futura API)
**Responsabilidade:** Regras de negócio + perfis de usuários

### Endpoints de Perfil:
- GET /api/profile (ver perfil próprio)
- PUT /api/profile (atualizar perfil próprio)
- POST /api/profile/avatar (upload foto)
- PUT /api/profile/preferences (configurações pessoais)

### Endpoints de Arquivos:
- POST /api/files/upload (upload geral)
- GET /api/files/{id} (download arquivo)
- DELETE /api/files/{id} (remover arquivo)
- GET /api/files/user/{userId} (listar arquivos do usuário)

### Endpoints de Negócio:
- GET /api/appointments (agendamentos)
- POST /api/appointments (criar agendamento)
- PUT /api/appointments/{id} (atualizar agendamento)
- DELETE /api/appointments/{id} (cancelar agendamento)
- GET /api/services (serviços disponíveis)
- GET /api/reports (relatórios)
- GET /api/dashboard (dashboard do usuário)

### Dados gerenciados:
- Informações pessoais (nome, telefone, endereço)
- Configurações de perfil e preferências
- **Armazenamento de arquivos (avatars, documentos, anexos)**
- Lógica de agendamentos e operações
- Relatórios e analytics
- Histórico de atividades do usuário

---

## � **Comunicação entre as 2 APIs**

### 1. **Token JWT compartilhado:**
```javascript
// auth_api: gera e valida tokens
// operations_api: só valida tokens (middleware reutilizado)

// Mesmo JWT_SECRET nas duas APIs
JWT_SECRET=sua-chave-secreta-compartilhada
```

### 2. **Middleware de autenticação reutilizado:**
```javascript
// Mesmo código de validação JWT nas duas APIs
// operations_api importa e usa o mesmo middleware
const authMiddleware = require('shared-auth-middleware');
```

### 3. **Banco de dados:**
```javascript
// Opção A: Banco compartilhado (mais simples)
auth_api ──┐
           ├── PostgreSQL (mesmo banco)
operations_api ──┘

// Opção B: Bancos separados (futuro)
auth_api ──── auth_db (users, roles, tokens)
operations_api ──── operations_db (profiles, business)
```

### 4. **Validação de usuários:**
```javascript
// operations_api valida se usuário existe/ativo
// Pode consultar auth_api ou cache local
```

---

## 📊 **Benefícios desta arquitetura:**

### ✅ **Separação clara de responsabilidades:**
- **auth_api**: Cuida da segurança (alta disponibilidade)
- **operations_api**: Cuida do negócio (escalabilidade)

### ✅ **Custo controlado:**
- Apenas 2 servidores para gerenciar
- Complexidade reduzida vs microserviços
- Facilidade de deploy e monitoramento

### ✅ **Escalabilidade independente:**
- Auth geralmente precisa menos recursos
- Operations pode escalar conforme demanda do negócio

### ✅ **Times independentes:**
- Time de infraestrutura cuida da auth_api
- Time de produto cuida da operations_api

---

## 🚀 **Plano de Implementação:**

### **Fase 1 (Agora):** Preparar auth_api
- Manter estrutura atual
- Adicionar endpoints de perfil temporariamente
- Definir contratos de API bem claros

### **Fase 2 (Futuro):** Criar operations_api
- Mover endpoints de perfil para operations_api
- Implementar lógica de negócio
- Configurar comunicação entre APIs

### **Fase 3 (Otimização):** Refinar
- Otimizar comunicação entre APIs
- Implementar cache quando necessário
- Monitoramento e alertas
