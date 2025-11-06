# Guia de Migração - Replit para Local

## ✅ O que foi removido

### Arquivos e pastas deletadas:
- ❌ `server/` - Backend Express (não necessário com Firebase)
- ❌ `replit.md` - Documentação específica do Replit  
- ❌ `FIRESTORE_RULES_SETUP.md` - Movido para README
- ❌ `FIRESTORE_SAMPLE_DATA.md` - Não mais necessário
- ❌ `GOOGLE_CLOUD_SETUP.md` - Instruções no README
- ❌ `drizzle.config.ts` - Não usa PostgreSQL/Drizzle

### Dependências que permaneceram (mas não são usadas):
Os seguintes pacotes ainda estão no `package.json` mas não são utilizados:
- `express`, `express-session`, `passport`, `passport-local`
- `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`
- `connect-pg-simple`, `memorystore`, `ws`
- `@replit/vite-plugin-*` (carregados condicionalmente, não afetam dev local)

> **Nota**: Estes pacotes podem ser removidos futuramente sem afetar o funcionamento.

## 🔄 O que mudou

### 1. Sistema de Types
**Antes:**
```typescript
import type { Feedback } from '@shared/schema';
```

**Depois:**
```typescript
import type { Feedback } from '@/types/feedback';
```

Os tipos agora estão em `client/src/types/feedback.ts`

### 2. Arquitetura
- **Antes**: Express + Vite (full-stack)
- **Depois**: Apenas Vite + Firebase (frontend-only)

### 3. Backend
- **Antes**: Rotas Express em `server/routes.ts`
- **Depois**: Firebase/Firestore direto no frontend

## 🚀 Como rodar agora

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env` e preencha com suas chaves:
```bash
cp .env.example .env
```

### 3. Executar
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📦 Estrutura Atual

```
curacao-video-reviews/
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── contexts/    # Auth & App contexts
│   │   ├── lib/         # Firebase config, utils
│   │   ├── pages/       # Home, Feedback
│   │   └── types/       # TypeScript types
│   └── index.html
├── attached_assets/     # Imagens geradas
├── shared/             # Tipos compartilhados (compatibilidade)
├── .env.example        # Template de variáveis
├── README.md           # Documentação principal
└── package.json        # Dependências
```

## 🔑 Variáveis de Ambiente Necessárias

Todas começam com `VITE_`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`

## ✨ Funcionalidades Preservadas

Tudo continua funcionando:
- ✅ Autenticação Firebase
- ✅ CRUD de vídeos no Firestore
- ✅ Sistema de feedback
- ✅ Google Maps autocomplete
- ✅ Painel admin
- ✅ Toggle de visibilidade
- ✅ Vídeos patrocinados/fixados
- ✅ Multilíngue (5 idiomas)

## 🛠️ Build para Produção

```bash
npm run build
npm run preview
```

Os arquivos de produção estarão em `dist/`
