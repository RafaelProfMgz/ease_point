```markdown
# Sistema de Ponto Backend (Multi-tenant)

Este é o backend de uma plataforma SaaS (Software as a Service) para **Controle de Ponto e Frequência**. O sistema é multi-empresa (multi-tenant), permitindo que diferentes organizações gerenciem seus colaboradores e registros de ponto de forma isolada e segura.

Desenvolvido com **Node.js (Express)** seguindo a arquitetura **MVC** e utilizando **Supabase** como BaaS (Backend-as-a-Service) para Banco de Dados e Autenticação.

---

## Objetivos do Projeto

- **Gestão de Empresas:** Cadastro de empresas com diferentes planos (Bronze, Prata, Ouro).
- **Autenticação Segura:** Login via JWT gerenciado pelo Supabase Auth.
- **Hierarquia de Usuários:**
  - **Admin:** Criado automaticamente ao registrar a empresa.
  - **Employee:** Funcionários vinculados à empresa.
- **Registro de Ponto:** Marcação de ponto (Entrada/Saída) com validação de vínculo empregatício.
- **Integridade de Dados:** O sistema garante que um usuário só pode registrar pontos para a empresa a qual pertence.

---

## Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Documentação:** [Swagger / OpenAPI](https://swagger.io/)
- **Arquitetura:** MVC (Model-View-Controller)

---

## Estrutura do Projeto

A organização segue boas práticas de separação de responsabilidades:

```text
/
├── .env                # Variáveis de ambiente (Segredos)
├── package.json        # Dependências do projeto
├── server.js           # Ponto de entrada (Entrypoint)
└── src
    ├── app.js          # Configuração do Express e Middlewares
    ├── config          # Configurações externas
    │   ├── supabase.js # Conexão com o Supabase Client
    │   └── swagger.js  # Configuração da documentação
    ├── controllers     # Lógica de Negócio (Regras)
    │   ├── companyController.js
    │   ├── pointsController.js
    │   └── userController.js
    ├── middlewares     # Interceptadores de requisição
    │   └── authMiddleware.js # Validação de Token JWT
    └── routes          # Definição dos Endpoints
        ├── companies.js
        ├── points.js
        └── users.js
```

---

## Como Rodar o Projeto

### 1. Pré-requisitos
*   Node.js instalado.
*   Uma conta no [Supabase](https://supabase.com/).

### 2. Configuração do Banco de Dados
No painel do Supabase, vá até o **SQL Editor** e execute o seguinte script para criar as tabelas e relacionamentos:

```sql
-- Habilita UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Empresas
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('bronze', 'prata', 'ouro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Usuários (Vinculada ao Auth do Supabase)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'employee',
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Pontos
CREATE TABLE public.pointers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 3. Instalação e Configuração

Clone o repositório e instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais do Supabase:

```env
PORT=3000
SUPABASE_URL=Sua_URL_Do_Supabase
SUPABASE_KEY=Sua_Anon_Key_Do_Supabase
```

### 4. Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com auto-reload):

```bash
npm run start
# ou
node server.js
```

O servidor estará rodando em: `http://localhost:3000`

---

## Documentação da API (Swagger)

A documentação interativa está disponível automaticamente quando o servidor está rodando.

* **Acesse:** `http://localhost:3000/api-docs`

Lá você pode testar todas as rotas, ver os schemas de dados e entender os parâmetros necessários.

---

## 🔄 Fluxo de Uso (Guia Rápido)

Para ver o sistema funcionando, siga esta ordem de chamadas:

### 1 Registrar uma Empresa (Cadastro Inicial)
**POST** `/companies/register`
*   **Objetivo:** Cria a empresa e o primeiro usuário (Admin).
*   **Body:**
    ```json
    {
      "companyName": "Tech Solutions",
      "plan": "ouro",
      "adminName": "João Admin",
      "email": "joao@tech.com",
      "password": "senhaSegura123"
    }
    ```

### 2 Fazer Login
**POST** `/users/login`
*   **Objetivo:** Autenticar e receber o Token de acesso.
*   **Body:**
    ```json
    {
      "email": "joao@tech.com",
      "password": "senhaSegura123"
    }
    ```
*   **Resposta:** Copie o `access_token` retornado.

### 3 Bater Ponto (Registro)
**POST** `/points`
*   **Objetivo:** Registrar entrada ou saída.
*   **Header:** Adicione `Authorization: Bearer SEU_TOKEN_COPIADO`.
*   **Body:**
    ```json
    {
      "type": "ENTRADA",
      "description": "Início do expediente"
    }
    ```
*   *Nota:* O sistema identifica automaticamente quem é o usuário e qual a empresa dele através do Token.

---

##  Segurança e Decisões de Arquitetura

1.  **JWT Middleware:** As rotas de pontos são protegidas. Sem um token válido do Supabase, a requisição é rejeitada.
2.  **Relacionamento Automático:** No registro de ponto, não enviamos o `company_id` no corpo da requisição. O Backend busca essa informação no perfil do usuário logado para evitar fraudes (ex: um funcionário tentar bater ponto em outra empresa).
3.  **Supabase Auth + Public Table:** Utilizamos a autenticação nativa do Supabase (`auth.users`), mas espelhamos os dados de perfil (nome, empresa, cargo) na tabela `public.users` para facilitar as queries relacionais.

---

##  Licença

Este projeto está sob a licença ISC.
```