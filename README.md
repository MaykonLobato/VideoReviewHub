# Curaçao Video Reviews Platform

Plataforma multilíngue de avaliação de vídeos com React 19, Firebase/Firestore e Google Maps.

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta Firebase configurada

### Instalação

```bash
# Instalar dependências
npm install
```

### Configuração Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Firestore Database e Authentication
3. Copie as credenciais do Firebase
4. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_GOOGLE_MAPS_API_KEY=sua_google_maps_key_aqui
```

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta padrão do Vite)

> **Nota**: Se quiser usar a porta 3000, execute: `vite --port 3000`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📋 Funcionalidades

- ✅ Avaliação de vídeos do YouTube (1-5 estrelas)
- ✅ Sistema de tags dinâmico (Tourist/Resident)
- ✅ Vídeos patrocinados com faixas coloridas (Gold/Silver/Bronze)
- ✅ Fixar vídeos importantes
- ✅ Controle de visibilidade (público/oculto) - apenas admin
- ✅ Integração Google Maps com autocomplete mundial
- ✅ Player de vídeo integrado com play ao passar o mouse
- ✅ Multilíngue (EN, PT-BR, ES, NL, PAP)
- ✅ Sistema de feedback para usuários
- ✅ Painel administrativo completo
- ✅ Firebase Authentication

## 👨‍💼 Admin

Email configurado como admin: `maykon.clobato@gmail.com`

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase/Firestore
- **Maps**: Google Maps JavaScript API
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod

## 📁 Estrutura

```
client/
  src/
    components/     # Componentes React
    contexts/       # Context providers (Auth, App)
    lib/           # Utilitários e configurações
    pages/         # Páginas da aplicação
    types/         # TypeScript types
attached_assets/   # Assets estáticos
```

## 🔑 Variáveis de Ambiente

Todas as variáveis de ambiente devem ter o prefixo `VITE_` para serem acessíveis no frontend:

- `VITE_FIREBASE_API_KEY` - Firebase API Key
- `VITE_FIREBASE_APP_ID` - Firebase App ID
- `VITE_FIREBASE_PROJECT_ID` - Firebase Project ID
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API Key

## 📝 Licença

MIT
