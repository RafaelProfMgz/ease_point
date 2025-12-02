Aqui está um modelo de **README.md** profissional e completo para o seu frontend, destacando as tecnologias modernas que utilizamos (Vue 3, Pinia, Vuetify Glassmorphism).

Você pode criar um arquivo chamado `README.md` na raiz da pasta do frontend e colar o conteúdo abaixo.

***

```markdown
# 🕰️ EasyPoint - Frontend

> Interface moderna e intuitiva para gestão de ponto eletrônico, desenvolvida com Vue 3 e design Glassmorphism.

![Badge Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js)
![Badge Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify)
![Badge Pinia](https://img.shields.io/badge/Pinia-State-F1C40F?style=for-the-badge&logo=pinia)
![Badge Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite)

## 📖 Sobre o Projeto

O **EasyPoint Web** é o client-side da solução SaaS de controle de jornada. Focado na experiência do usuário (UX), utiliza um design moderno com tema escuro e efeitos de vidro (Glassmorphism).

O sistema permite que colaboradores registrem seus pontos (Entrada, Intervalo, Saída), visualizem seu histórico e gerenciem seus perfis, tudo conectado a uma API Node.js robusta.

---

## 🎨 Layout e Telas

> *Adicione screenshots do seu projeto na pasta `public/screenshots` ou link externo.*

| Login (Glass) | Dashboard (Dark) |
|:---:|:---:|
| ![Login](./screenshots/login-placeholder.png) | ![Dashboard](./screenshots/dashboard-placeholder.png) |

---

## 🚀 Tecnologias Utilizadas

- **[Vue.js 3](https://vuejs.org/)**: Framework JavaScript progressivo (Composition API).
- **[Vuetify 3](https://vuetifyjs.com/)**: Biblioteca de componentes UI baseada no Material Design.
- **[Pinia](https://pinia.vuejs.org/)**: Gerenciamento de estado intuitivo e modular.
- **[Vue Router](https://router.vuejs.org/)**: Roteamento SPA (Single Page Application).
- **[Axios](https://axios-http.com/)**: Cliente HTTP para comunicação com a API.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build extremamente rápida.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 16 ou superior)
- **NPM** ou **Yarn**
- O **Backend do EasyPoint** rodando (normalmente na porta 3001).

---

## 🔧 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/easypoint-frontend.git
   cd easypoint-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto (baseado no exemplo abaixo) para apontar para o seu backend.

   ```env
   # .env
   VITE_API_URL=http://localhost:3001
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```
   O app estará disponível em `http://localhost:5173` (ou porta similar).

---

## 📂 Estrutura de Pastas

A estrutura do projeto segue as boas práticas do Vue 3 + Pinia:

```
front
├── README.md
├── auto-imports.d.ts
├── components.d.ts
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── logo.png
│   │   └── logo.svg
│   ├── components
│   │   ├── GlobalSnackbar.vue
│   │   └── dashboard
│   │       ├── ActionCard.vue
│   │       ├── Header.vue
│   │       └── HistoryTable.vue
│   ├── main.js
│   ├── pages
│   │   ├── dashboard.vue
│   │   ├── docs.vue
│   │   ├── forgotPassword.vue
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── resetPassword.vue
│   ├── plugins
│   │   ├── index.js
│   │   └── vuetify.js
│   ├── router
│   │   └── index.js
│   ├── services
│   │   └── api.js
│   ├── stores
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── points.js
│   │   └── snackbar.js
│   └── styles
│       └── settings.scss
├── typed-router.d.ts
└── vite.config.mjs
```

---

## ✨ Funcionalidades Principais

- **Autenticação Segura:**
  - Login via E-mail/Senha (JWT).
  - Integração OAuth (Google e GitHub).
  - Recuperação de senha via e-mail.
- **Dashboard Interativo:**
  - Relógio em tempo real.
  - Botões de ação rápida (Entrada, Intervalo, Saída).
  - Resumo de registros do dia.
- **Histórico:**
  - Tabela de últimos registros ordenados.
  - Exclusão de registros (com confirmação).
- **Feedback Visual:**
  - Notificações globais (Toasts) para sucesso/erro.
  - Loading states em botões e tabelas.
  - Validação de formulários em tempo real.

---

## 📦 Scripts Disponíveis

- `npm run dev`: Roda o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção na pasta `dist`.
- `npm run preview`: Visualiza a versão de produção localmente.
- `npm run lint`: Executa o ESLint para verificar erros de código.

