# ☁️ Cloud Functions - Guia Básico

## 🎯 O que são Cloud Functions?

Cloud Functions são funções JavaScript/TypeScript que rodam no servidor do Firebase (Google Cloud). Elas são executadas automaticamente quando eventos acontecem (ex: quando um documento é criado no Firestore).

## 💰 Custo

**Plano Spark (Gratuito):**
- 2 milhões de invocações/mês
- 400.000 GB-segundos de tempo de computação
- 200.000 GB-segundos de tempo de CPU

**Para seu projeto:** Provavelmente ficará no plano gratuito! 🎉

## 🚀 Quando Usar?

### ✅ Use Cloud Functions quando:
- Precisa executar código no servidor (não no navegador)
- Quer processar dados antes de salvar
- Precisa fazer operações que não podem ser feitas no frontend
- Quer enviar emails, notificações, etc.
- Precisa validar dados de forma mais segura

### ❌ NÃO precisa usar quando:
- Apenas CRUD básico (criar, ler, atualizar, deletar)
- Operações que já funcionam bem no frontend
- Validações simples

## 📋 Exemplo Prático para Seu Projeto

### Cenário: Validar URL do YouTube antes de salvar

**Sem Cloud Functions (atual):**
- Frontend valida a URL
- Qualquer um pode burlar a validação

**Com Cloud Functions:**
- Frontend envia a URL
- Cloud Function valida no servidor
- Só salva se for válida

## 🛠️ Como Configurar (Passo a Passo)

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Fazer Login

```bash
firebase login
```

### 3. Inicializar Functions no Projeto

```bash
firebase init functions
```

Isso vai criar uma pasta `functions/` no seu projeto.

### 4. Estrutura Criada

```
functions/
  ├── index.js (ou index.ts)
  ├── package.json
  └── node_modules/
```

### 5. Exemplo de Function

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Exemplo: Validar vídeo antes de salvar
exports.validateVideo = functions.firestore
  .document('videos/{videoId}')
  .onCreate(async (snap, context) => {
    const video = snap.data();

    // Validar URL do YouTube
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
    if (!youtubeRegex.test(video.youtubeUrl)) {
      // Deletar o documento se URL inválida
      await snap.ref.delete();
      throw new functions.https.HttpsError('invalid-argument', 'Invalid YouTube URL');
    }

    return null;
  });
```

### 6. Deploy

```bash
firebase deploy --only functions
```

## 📝 Para Seu Projeto Específico

### Opções de Cloud Functions Úteis:

1. **Validar URLs do YouTube** - Garantir que só URLs válidas sejam salvas
2. **Enviar email quando feedback é criado** - Notificar você de novos feedbacks
3. **Gerar thumbnails automaticamente** - Extrair thumbnail do YouTube automaticamente
4. **Backup automático** - Fazer backup dos dados periodicamente

## ⚠️ Importante

- Cloud Functions rodam no servidor, então você paga por execução
- Para começar, o plano gratuito é suficiente
- Só crie functions se realmente precisar (não é obrigatório!)

## 🔗 Links Úteis

- [Documentação Oficial](https://firebase.google.com/docs/functions)
- [Preços](https://firebase.google.com/pricing)
- [Exemplos](https://github.com/firebase/functions-samples)

---

**Resumo:** Cloud Functions são úteis, mas não são obrigatórias. Para seu projeto atual, você pode continuar sem elas. Mas se quiser adicionar validações mais robustas ou notificações, elas são perfeitas!

