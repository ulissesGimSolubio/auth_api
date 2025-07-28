# 📋 Documentação Completa: Decisões de Arquitetura

## 🎯 **Situação Atual**

### ✅ **O que temos (auth_api):**
```
auth_api/ (porta 3000)
├── Autenticação completa (login, 2FA, reset senha)
├── Controle administrativo (block/unblock usuários)
├── Gestão de roles e permissões
├── Sistema de convites
├── Rate limiting e segurança
└── Documentação Swagger
```

### ❓ **O que decidir:**
1. Criar `operations_api` agora ou depois?
2. Implementar perfis na `auth_api` temporariamente?
3. Como estruturar o armazenamento de arquivos?
4. Qual banco de dados usar para cada API?

---

## 🏗️ **Opções de Arquitetura**

### **OPÇÃO A: Criar operations_api AGORA**
```
auth_api:3001/          operations_api:3002/
├── /api/auth/*         ├── /api/profile/*
├── /api/users/admin/*  ├── /api/files/*
└── Controle           ├── /api/appointments/*
                       ├── /api/services/*
                       └── /api/reports/*
```

#### ✅ **Vantagens:**
- Separação clara desde o início
- Sem necessidade de migração futura
- Cada API com responsabilidade bem definida
- Facilita trabalho em equipe

#### ❌ **Desvantagens:**
- Mais complexidade inicial
- 2 projetos para manter
- Configuração de comunicação entre APIs
- Possível over-engineering no início

---

### **OPÇÃO B: Expandir auth_api AGORA, migrar DEPOIS**
```
auth_api:3000/ (monólito modular)
├── /api/auth/*
├── /api/users/* (admin + perfils)
├── /api/appointments/*
├── /api/files/*
└── /api/reports/*
```

#### ✅ **Vantagens:**
- Desenvolvimento mais rápido
- Menos complexidade inicial
- 1 projeto para manter
- Fácil debug e desenvolvimento

#### ❌ **Desvantagens:**
- Necessidade de migração futura
- Possível acoplamento indevido
- API única cresce muito

---

## 📊 **Matriz de Decisão**

| Critério | Opção A (2 APIs) | Opção B (Monólito) | Vencedor |
|----------|------------------|-------------------|----------|
| **Tempo de dev inicial** | ⭐⭐ | ⭐⭐⭐⭐⭐ | B |
| **Manutenibilidade futura** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | A |
| **Escalabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | A |
| **Complexidade** | ⭐⭐ | ⭐⭐⭐⭐ | B |
| **Custo infraestrutura** | ⭐⭐ | ⭐⭐⭐⭐⭐ | B |
| **Time to market** | ⭐⭐ | ⭐⭐⭐⭐⭐ | B |

---

## 🗂️ **Estrutura Detalhada das APIs**

### **🔐 auth_api (Segurança)**
```
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/ (login, 2FA, tokens)
│   │   ├── services/ (email, JWT, 2FA)
│   │   └── routes/
│   └── users/
│       ├── controllers/ (admin: block, roles)
│       └── routes/
├── middlewares/ (auth, rate-limit, roles)
├── config/ (cors, db, environment)
└── utils/
```

### **🏢 operations_api (Negócio)**
```
src/
├── modules/
│   ├── profiles/
│   │   ├── controllers/ (getProfile, updateProfile)
│   │   ├── services/ (validation, processing)
│   │   └── routes/
│   ├── files/
│   │   ├── controllers/ (upload, download)
│   │   ├── services/ (storage, image processing)
│   │   └── routes/
│   ├── appointments/
│   │   ├── controllers/ (CRUD agendamentos)
│   │   ├── services/ (business logic)
│   │   └── routes/
│   └── reports/
├── uploads/ (avatars, documents, attachments)
├── middlewares/ (auth compartilhado)
└── config/
```

---

## 🗃️ **Estratégia de Banco de Dados**

### **OPÇÃO 1: Banco Compartilhado (Simples)**
```sql
PostgreSQL Database: agendei_api
├── users, roles, tokens          -- auth_api
├── user_profiles, preferences    -- operations_api
├── appointments, services        -- operations_api
└── files, attachments           -- operations_api
```

#### ✅ **Vantagens:**
- Facilidade de setup
- Transações entre módulos
- Backup único
- Consultas cross-module

#### ❌ **Desvantagens:**
- Acoplamento entre APIs
- Escalabilidade limitada

---

### **OPÇÃO 2: Bancos Separados (Futuro)**
```sql
auth_db:                    operations_db:
├── users                   ├── user_profiles
├── roles                   ├── appointments
├── tokens                  ├── services
└── permissions             ├── files
                           └── reports
```

#### ✅ **Vantagens:**
- Isolamento completo
- Escalabilidade independente
- Backups separados

#### ❌ **Desvantagens:**
- Complexidade de sincronização
- Sem transações cross-API

---

## 📁 **Armazenamento de Arquivos**

### **Estrutura Proposta:**
```
operations_api/uploads/
├── avatars/
│   ├── original/     # 512x512px
│   ├── medium/       # 150x150px
│   └── small/        # 50x50px
├── documents/
│   ├── contracts/
│   ├── reports/
│   └── invoices/
└── temp/            # uploads temporários
```

### **Tipos de Arquivo:**
```javascript
const fileTypes = {
  avatar: {
    allowed: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    resize: [512, 150, 50]
  },
  document: {
    allowed: ['application/pdf', 'image/*'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  attachment: {
    allowed: ['image/*', 'application/pdf', '.docx', '.xlsx'],
    maxSize: 25 * 1024 * 1024 // 25MB
  }
}
```

---

## 🔗 **Comunicação entre APIs**

### **Autenticação Compartilhada:**
```javascript
// .env (mesmo em ambas APIs)
JWT_SECRET=sua-chave-secreta-compartilhada
JWT_REFRESH_SECRET=refresh-secret-compartilhado

// middleware reutilizado
const authMiddleware = require('./shared/authMiddleware');
```

### **Validação de Usuário:**
```javascript
// operations_api verifica se usuário está ativo
const validateUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { active: true, blocked: true }
  });
  
  if (!user || !user.active || user.blocked) {
    throw new Error('Usuário inválido');
  }
};
```

---

## 🚀 **Cronograma de Implementação**

### **Se escolher OPÇÃO A (2 APIs):**
```
SEMANA 1-2: Setup operations_api
├── Estrutura básica do projeto
├── Configuração de ambiente
├── Middleware de autenticação
└── Conexão com banco

SEMANA 3-4: Módulo de Perfis
├── GET /api/profile
├── PUT /api/profile
├── Sistema de validação
└── Testes

SEMANA 5-6: Sistema de Arquivos
├── POST /api/profile/avatar
├── Processamento de imagens
├── Validação de tipos
└── Sistema de storage

SEMANA 7-8: Módulos de Negócio
├── Appointments CRUD
├── Services management
├── Reports básicos
└── Dashboard
```

### **Se escolher OPÇÃO B (Monólito):**
```
SEMANA 1: Perfis na auth_api
├── profile.controller.js
├── profile.routes.js
├── Validações
└── Testes

SEMANA 2: Upload de Avatar
├── Multer setup
├── Image processing
├── Storage management
└── Integration

SEMANA 3-4: Business Logic
├── Appointments module
├── Services module
├── Reports module
└── Integration tests

SEMANA 5: Preparação para Migração
├── Documentar APIs
├── Separar responsabilidades
├── Preparar extraction
└── Testes de isolamento
```

---

## 💰 **Análise de Custos**

### **Desenvolvimento:**
- **Opção A**: +2-3 semanas setup inicial
- **Opção B**: Desenvolvimento mais rápido, +1-2 semanas migração futura

### **Infraestrutura:**
- **Opção A**: 2 servidores (~$40-100/mês)
- **Opção B**: 1 servidor inicial (~$20-50/mês)

### **Manutenção:**
- **Opção A**: 2 deploys, 2 monitoramentos
- **Opção B**: 1 deploy, complexidade interna

---

## 🎯 **Recomendação Final**

### **Para Startups/MVPs (0-6 meses):**
👉 **OPÇÃO B** - Monólito modular

### **Para Produtos Estabelecidos (6+ meses):**
👉 **OPÇÃO A** - 2 APIs separadas

### **Para Sua Situação:**
- ✅ Já tem auth_api funcionando
- ✅ Estrutura bem organizada
- ✅ Conhece as necessidades do negócio

**Sugestão:** Comece com **OPÇÃO B**, implemente perfis na auth_api e migre quando necessário.

---

## ❓ **Questões para Decidir**

1. **Qual o prazo para ter funcionalidades de perfil funcionando?**
2. **Pretende ter quantos desenvolvedores trabalhando?**
3. **Qual o orçamento para infraestrutura nos próximos 6 meses?**
4. **As funcionalidades de negócio já estão bem definidas?**
5. **Prefere entrega rápida ou arquitetura ideal?**

Com base nessas respostas, posso dar uma recomendação mais específica! 🤔
