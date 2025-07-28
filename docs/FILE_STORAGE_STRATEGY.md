# Estratégia de Armazenamento de Arquivos

## 🎯 **Decisão: operations_api gerencia todos os arquivos**

### 📁 **Por que na operations_api:**

#### ✅ **Vantagens:**
1. **Coesão**: Perfis e arquivos ficam juntos
2. **Validação**: Pode validar permissões antes do upload
3. **Processamento**: Pode redimensionar/otimizar imagens
4. **Backup**: Controle total sobre os dados
5. **Segurança**: Validação de tipos e tamanhos

#### ❌ **Por que NÃO na auth_api:**
- Auth deve ser leve e focada em segurança
- Arquivos podem consumir muito espaço/banda
- Upload não é responsabilidade de autenticação

#### ❌ **Por que NÃO no frontend:**
- Sem validação server-side
- Sem controle de acesso
- Sem backup automático
- Problemas de segurança

---

## 🏗️ **Arquitetura Proposta:**

### **Estrutura de Arquivos:**
```
operations_api/
├── uploads/
│   ├── avatars/           # Fotos de perfil
│   ├── documents/         # Documentos dos usuários
│   ├── attachments/       # Anexos gerais
│   └── temp/             # Uploads temporários
├── src/modules/
│   └── files/
│       ├── controllers/
│       │   └── file.controller.js
│       ├── services/
│       │   ├── upload.service.js
│       │   └── image.service.js
│       └── routes/
│           └── file.routes.js
```

### **Endpoints de Arquivo:**
```javascript
// operations_api
POST /api/files/avatar          # Upload avatar (profile)
POST /api/files/document        # Upload documento
POST /api/files/attachment      # Upload anexo geral
GET  /api/files/{id}           # Download arquivo
DELETE /api/files/{id}         # Remover arquivo
GET  /api/files/user/{userId}  # Listar arquivos do usuário
```

---

## 📊 **Evolução por Fases:**

### **FASE 1: Local Storage (Desenvolvimento)**
```javascript
// Armazenar na operations_api/uploads/
// Servir arquivos diretamente via Express
app.use('/uploads', express.static('uploads'));
```

### **FASE 2: Local + Validação (Produção Inicial)**
```javascript
// Validação de tipos, tamanhos
// Organização por pastas
// Backup manual
```

### **FASE 3: Cloud Storage (Escala)**
```javascript
// Migrar para AWS S3, Google Cloud, Cloudinary
// operations_api vira proxy
// CDN para performance global
```

---

## 🔐 **Segurança e Validação:**

### **Tipos permitidos:**
```javascript
const allowedTypes = {
  avatar: ['image/jpeg', 'image/png', 'image/webp'],
  document: ['application/pdf', 'image/jpeg', 'image/png'],
  attachment: ['image/*', 'application/pdf', '.docx', '.xlsx']
};
```

### **Limites de tamanho:**
```javascript
const sizeLimits = {
  avatar: 5 * 1024 * 1024,      // 5MB
  document: 10 * 1024 * 1024,   // 10MB  
  attachment: 25 * 1024 * 1024  // 25MB
};
```

### **Validação de acesso:**
```javascript
// Usuário só pode acessar seus próprios arquivos
// Admin pode acessar qualquer arquivo
// Validação via JWT token
```

---

## 💰 **Considerações de Custo:**

### **Local Storage:**
- ✅ **Custo baixo** (só disco do servidor)
- ❌ **Backup manual** necessário
- ❌ **Escalabilidade limitada**

### **Cloud Storage:**
- ✅ **Backup automático**
- ✅ **CDN global**
- ✅ **Escalabilidade infinita**
- ❌ **Custo por GB + transfer**

### **Recomendação:**
- **Início**: Local storage
- **Produção**: Cloud quando necessário

---

## 🚀 **Implementação Prática:**

### **1. Estrutura no operations_api:**
```javascript
src/modules/files/
├── controllers/file.controller.js
├── services/
│   ├── upload.service.js      # Lógica de upload
│   ├── validation.service.js  # Validação de arquivos
│   └── storage.service.js     # Abstração do storage
├── middlewares/
│   └── fileUpload.middleware.js
└── routes/file.routes.js
```

### **2. Middleware de upload:**
```javascript
// Usando multer para upload
// Validação de tipo e tamanho
// Organização por pastas
```

### **3. Integração com perfis:**
```javascript
// Ao fazer upload de avatar:
// 1. Validar permissões
// 2. Fazer upload
// 3. Atualizar user.imagePath
// 4. Remover avatar anterior
```
