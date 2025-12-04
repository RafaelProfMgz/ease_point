````markdown
# 🚀 EasePoint - Sistema de Ponto Eletrônico e Gestão de RH

> Segunda Avaliação - Frameworks Modernos para Desenvolvimento de Sistemas

Este repositório contém o código-fonte de uma aplicação web completa para gestão de ponto eletrônico, controle de horas e gerenciamento de colaboradores, desenvolvida como requisito avaliativo da disciplina.

---

## 👥 Integrantes do Grupo

- **Angel Rafael Souza Da Silva**

---

## 📝 Descrição do Sistema

O **EasePoint** é uma aplicação web SaaS (Software as a Service) que permite que empresas gerenciem o registro de ponto de seus funcionários de forma digital e segura.

**Principais Funcionalidades:**

- **Autenticação Social:** Login seguro via conta **Google** (OAuth 2.0).
- **Onboarding de Empresas:** Fluxo inteligente onde novos usuários podem cadastrar suas próprias empresas após o login social.
- **Gestão de Sessão:** Controle de estado global e persistência de login utilizando **Pinia**.
- **Dashboard Interativo:** Visualização rápida de status e dados do usuário.
- **CRUD de Pontos:** Funcionalidade completa para registrar (bater ponto), listar histórico, editar (admin) e excluir registros.
- **Rotas Protegidas:** Sistema de guardas de rota (Navigation Guards) que impede acesso não autorizado.

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Vue.js 3:** Framework reativo principal (Composition API).
- **Vuetify 3:** Biblioteca de componentes de UI (Material Design).
- **Vue Router:** Gerenciamento de rotas e navegação.
- **Pinia:** Gerenciamento de estado global (sessão, usuário, alertas).
- **Axios:** Cliente HTTP para comunicação com a API.

### Backend

- **Node.js & Express:** Servidor API RESTful.
- **Supabase (PostgreSQL):** Banco de dados relacional e serviço de Autenticação.
- **Swagger:** Documentação automática da API.

---

## ⚙️ Pré-requisitos

Para rodar o projeto localmente, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e Execução

Siga os passos abaixo para rodar o projeto em sua máquina.

### 1. Configuração do Backend

1.  Acesse a pasta do backend:

    ```bash
    cd backend
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

    ```env
    PORT=3000
    FRONTEND_URL=http://localhost:3000

    # Configurações do Supabase (Obtenha no painel do projeto)
    SUPABASE_URL=https://SEU_ID_DO_PROJETO.supabase.co
    SUPABASE_KEY=SUA_CHAVE_SERVICE_ROLE (Começa com eyJ...)
    SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE
    ```

4.  Inicie o servidor:
    ```bash
    npm start
    ```
    _O backend rodará em `http://localhost:3001` (ou porta definida)._

### 2. Configuração do Frontend

1.  Em um novo terminal, acesse a pasta do frontend:

    ```bash
    cd frontend
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  (Opcional) Verifique se o arquivo `src/services/api.js` aponta para a URL correta do backend local.

4.  Inicie a aplicação:
    ```bash
    npm run dev
    ```
    _O frontend rodará em `http://localhost:3000` (ou porta indicada pelo Vite)._

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

Para que o sistema funcione, execute o seguinte script SQL no **SQL Editor** do seu painel Supabase:

```sql
-- 1. Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. Tabela de EMPRESAS (Companies) - MELHORADA
-- ==========================================
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE, -- Adicionado: Identificação fiscal
  logo_url TEXT,    -- Adicionado: URL da imagem (armazenada no Supabase Storage)
  plan TEXT NOT NULL CHECK (plan IN ('bronze', 'prata', 'ouro')),

  -- Configurações flexíveis (ex: {"tolerance_minutes": 10, "timezone": "America/Sao_Paulo"})
  settings JSONB DEFAULT '{}'::jsonb,

  active BOOLEAN DEFAULT true, -- Para suspender empresas inadimplentes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. Tabela de USUÁRIOS (Users) - MELHORADA
-- ==========================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT, -- Adicionado: Foto do perfil

  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')), -- Adicionado 'manager'
  job_title TEXT,  -- Adicionado: Cargo (ex: Desenvolvedor)
  department TEXT, -- Adicionado: Setor (ex: TI, RH)

  active BOOLEAN DEFAULT true, -- Adicionado: Soft delete (não apaga histórico)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. Tabela de PONTOS (Pointers) - MELHORADA
-- ==========================================
CREATE TABLE public.pointers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,

  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida_intervalo', 'volta_intervalo', 'saida')),
  description TEXT, -- Observação do funcionário

  -- Dados de Contexto (Geo e Dispositivo)
  latitude NUMERIC(10, 8),  -- Adicionado: Latitude
  longitude NUMERIC(11, 8), -- Adicionado: Longitude
  location_address TEXT,    -- Adicionado: Endereço aproximado (opcional, preenchido via API de mapas)
  ip_address TEXT,          -- Adicionado: IP da rede
  device_info TEXT,         -- Adicionado: User Agent (ex: Chrome Windows, App Android)

  -- Auditoria
  is_manual BOOLEAN DEFAULT false, -- Se foi inserido manualmente pelo RH
  edited_by UUID REFERENCES public.users(id), -- Quem editou/criou manualmente

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. Índices de Performance
-- ==========================================
CREATE INDEX idx_users_company ON public.users(company_id);
CREATE INDEX idx_users_email ON public.users(email); -- Bom para buscas no login
CREATE INDEX idx_pointers_user ON public.pointers(user_id);
CREATE INDEX idx_pointers_company_date ON public.pointers(company_id, created_at); -- Otimiza relatórios por data

-- ==========================================
-- 6. RLS (Segurança)
-- ==========================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pointers ENABLE ROW LEVEL SECURITY;

-- Políticas
-- Usuários veem apenas sua empresa
CREATE POLICY "Users view own company" ON public.companies
  FOR SELECT USING (id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

-- Usuários veem colegas da mesma empresa
CREATE POLICY "Users view colleagues" ON public.users
  FOR SELECT USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

-- Usuários veem seus pontos, Admins veem todos da empresa
CREATE POLICY "View points policy" ON public.pointers
  FOR SELECT USING (
    auth.uid() = user_id -- O próprio dono
    OR
    EXISTS ( -- Ou é admin da mesma empresa
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'manager')
      AND u.company_id = public.pointers.company_id
    )
  );
```
````

---

## 📚 Documentação da API

O backend possui documentação automática via Swagger. Com o servidor rodando, acesse:

- **URL:** `http://localhost:3001/api-docs`

---

## ✅ Checklist de Avaliação

- [x] **Frontend:** Vue 3 + Vuetify + Router + Pinia implementados.
- [x] **Backend:** API REST com Express e Node.js.
- [x] **Banco de Dados:** Persistência no Supabase (PostgreSQL).
- [x] **Autenticação:** Login Social com Google e persistência de sessão.
- [x] **CRUD:** Gestão completa de pontos (Create, Read, Update, Delete).
- [x] **Rotas:** Mínimo de 3 rotas distintas (Login, Dashboard, Cadastro).

---
