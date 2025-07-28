# 🔄 Planos de Implementação Detalhados

## 📋 **PLANO A: Criar operations_api AGORA**

### **🏗️ Estrutura do Projeto operations_api**

```
operations_api/
├── package.json
├── server.js
├── .env.development
├── .env.production
├── prisma/
│   └── schema.prisma (extensão do auth_api)
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── environment.js
│   │   ├── dbConnection.js
│   │   ├── cors.js
│   │   └── rateLimiting.js
│   ├── middlewares/
│   │   ├── authMiddleware.js (copiado da auth_api)
│   │   ├── fileUpload.js
│   │   └── validation.js
│   ├── modules/
│   │   ├── profiles/
│   │   │   ├── controllers/profile.controller.js
│   │   │   ├── routes/profile.routes.js
│   │   │   └── services/profile.service.js
│   │   ├── files/
│   │   │   ├── controllers/file.controller.js
│   │   │   ├── routes/file.routes.js
│   │   │   └── services/
│   │   │       ├── upload.service.js
│   │   │       └── image.service.js
│   │   ├── appointments/
│   │   │   ├── controllers/appointment.controller.js
│   │   │   ├── routes/appointment.routes.js
│   │   │   └── services/appointment.service.js
│   │   └── reports/
│   │       ├── controllers/report.controller.js
│   │       └── routes/report.routes.js
│   └── utils/
│       ├── fileValidation.js
│       └── imageProcessing.js
├── uploads/
│   ├── avatars/
│   ├── documents/
│   └── temp/
└── docs/
    └── api-documentation.md
```

### **⚙️ Configuração Inicial**

#### **package.json**
```json
{
  "name": "operations_api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "NODE_ENV=development nodemon server.js",
    "start": "NODE_ENV=production node server.js",
    "test": "NODE_ENV=test jest"
  },
  "dependencies": {
    "express": "^5.1.0",
    "prisma": "^6.12.0",
    "@prisma/client": "^6.12.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "helmet": "^8.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^8.0.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^17.2.1",
    "winston": "^3.17.0"
  }
}
```

#### **.env.development**
```bash
# Configuração operations_api
PORT=3002
NODE_ENV=development

# Banco de dados (mesmo da auth_api)
DATABASE_URL=postgresql://postgres:password@localhost:5432/agendei_api

# JWT (mesmo da auth_api)
JWT_SECRET=dev-9b8f7e6d-4c3b-11ec-81d3-0242ac130003
JWT_REFRESH_SECRET=dev-QAbNBQk2TwSJn8HvSy+B3i9dYCeFxgq05Fkex5A9p4A=

# APIs de comunicação
AUTH_API_URL=http://localhost:3001

# Upload settings
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=25000000
ALLOWED_AVATAR_TYPES=image/jpeg,image/png,image/webp

# Logs
LOG_LEVEL=debug
DEBUG=true
```

### **🗃️ Schema Prisma (Extensão)**

```prisma
// Adições ao schema existente
model UserProfile {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  bio         String?
  website     String?
  location    String?
  dateOfBirth DateTime?
  preferences Json?    // Configurações personalizadas
  
  user        User     @relation(fields: [userId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model File {
  id        String   @id @default(uuid())
  filename  String
  originalName String
  mimeType  String
  size      Int
  path      String
  category  String   // 'avatar', 'document', 'attachment'
  
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Appointment {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  status      String   @default("scheduled") // scheduled, confirmed, cancelled
  
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  
  serviceId   Int?
  service     Service? @relation(fields: [serviceId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Service {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  duration    Int      // minutos
  price       Decimal?
  active      Boolean  @default(true)
  
  appointments Appointment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Relacionamentos adicionais no modelo User
model User {
  // ... campos existentes
  profile      UserProfile?
  files        File[]
  appointments Appointment[]
}
```

---

## 📋 **PLANO B: Expandir auth_api AGORA**

### **🔧 Modificações na auth_api**

#### **Nova estrutura de módulos**
```
src/modules/
├── auth/ (existente)
├── users/ (existente - só admin)
├── profiles/ (NOVO)
│   ├── controllers/
│   │   ├── profile.controller.js
│   │   └── avatar.controller.js
│   ├── routes/profile.routes.js
│   ├── services/
│   │   ├── profile.service.js
│   │   └── upload.service.js
│   └── validations/profile.validation.js
├── files/ (NOVO)
│   ├── controllers/file.controller.js
│   ├── routes/file.routes.js
│   └── services/
│       ├── storage.service.js
│       └── image.service.js
└── appointments/ (NOVO - futuro)
    ├── controllers/appointment.controller.js
    ├── routes/appointment.routes.js
    └── services/appointment.service.js
```

#### **Endpoints a adicionar**
```javascript
// Perfis de usuário
GET    /api/profile           // Ver perfil próprio
PUT    /api/profile           // Atualizar perfil próprio
POST   /api/profile/avatar    // Upload avatar
DELETE /api/profile/avatar    // Remover avatar

// Arquivos gerais
POST   /api/files/upload      // Upload geral
GET    /api/files/:id         // Download arquivo
DELETE /api/files/:id         // Remover arquivo
GET    /api/files             // Listar arquivos próprios

// Configurações
GET    /api/profile/preferences    // Ver preferências
PUT    /api/profile/preferences    // Atualizar preferências
```

#### **Dependências a adicionar**
```bash
npm install multer sharp mime-types
```

### **🗃️ Modificações no Schema Prisma**
```prisma
// Adicionar os mesmos modelos do Plano A
// UserProfile, File, Appointment, Service
```

---

## ⏱️ **Cronogramas Comparativos**

### **CRONOGRAMA PLANO A (operations_api)**

| Semana | Tarefas | Entregas |
|--------|---------|----------|
| **1** | Setup projeto operations_api | Projeto rodando, middleware auth |
| **2** | Configurar banco, migrations | Schema estendido, conexão OK |
| **3** | Módulo de perfis | GET/PUT /api/profile funcionando |
| **4** | Sistema de upload | POST /api/profile/avatar completo |
| **5** | Processamento de imagens | Redimensionamento automático |
| **6** | Módulo de arquivos | Sistema completo de files |
| **7** | Appointments básico | CRUD appointments |
| **8** | Reports e dashboard | API completa funcionando |

**Total: 8 semanas**

---

### **CRONOGRAMA PLANO B (monólito)**

| Semana | Tarefas | Entregas |
|--------|---------|----------|
| **1** | Módulo profiles na auth_api | GET/PUT /api/profile |
| **2** | Sistema de upload | POST /api/profile/avatar |
| **3** | Módulo de arquivos | Upload files genérico |
| **4** | Appointments básico | CRUD appointments |
| **5** | Reports básicos | Dashboard simples |
| **6** | Refatoração para separar | Preparar extração |

**Total: 6 semanas (+2 semanas futuras para migração)**

---

## 🔧 **Implementações Específicas**

### **Upload de Avatar (Exemplo)**

#### **Plano A - operations_api:**
```javascript
// src/modules/profiles/controllers/profile.controller.js
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    
    // Processar imagem
    const processedImage = await imageService.processAvatar(file);
    
    // Salvar no banco
    const savedFile = await prisma.file.create({
      data: {
        filename: processedImage.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: processedImage.size,
        path: processedImage.path,
        category: 'avatar',
        userId
      }
    });
    
    // Atualizar user.imagePath
    await prisma.user.update({
      where: { id: userId },
      data: { imagePath: processedImage.url }
    });
    
    res.json({ 
      message: 'Avatar atualizado com sucesso',
      avatarUrl: processedImage.url 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **Plano B - auth_api:**
```javascript
// src/modules/profiles/controllers/avatar.controller.js
// Mesmo código, mas dentro da auth_api
```

### **Validação de Usuário entre APIs**

#### **Plano A - operations_api:**
```javascript
// middleware para validar se usuário existe e está ativo
const validateUserStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { active: true, blocked: true }
    });
    
    if (!user || !user.active || user.blocked) {
      return res.status(403).json({ 
        error: 'Usuário inativo ou bloqueado' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar usuário' });
  }
};
```

---

## 💡 **Fatores de Decisão**

### **Escolha PLANO A se:**
- ✅ Tem tempo para setup inicial (8 semanas)
- ✅ Equipe de 2+ desenvolvedores
- ✅ Quer arquitetura escalável desde o início
- ✅ Orçamento para 2 servidores
- ✅ Projeto de longo prazo

### **Escolha PLANO B se:**
- ✅ Precisa de entrega rápida (6 semanas)
- ✅ Equipe pequena (1 desenvolvedor)
- ✅ Orçamento limitado
- ✅ MVP ou validação de produto
- ✅ Flexibilidade para migrar depois

---

## 🎯 **Próximos Passos**

1. **Avaliar** cronogramas e recursos disponíveis
2. **Decidir** qual plano seguir
3. **Configurar** ambiente de desenvolvimento
4. **Implementar** primeira iteração
5. **Testar** e validar funcionalidades
6. **Documentar** APIs e processos

**Qual plano faz mais sentido para seu contexto atual?** 🤔
