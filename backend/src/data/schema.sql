-- 1. Habilita a extensão para gerar UUIDs (caso não esteja habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. Tabela de EMPRESAS (Companies)
-- ==========================================
CREATE TABLE public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('bronze', 'prata', 'ouro')), -- Validação no banco
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. Tabela de USUÁRIOS (Users)
-- ==========================================
-- Esta tabela estende os dados do 'auth.users' nativo do Supabase.
-- O 'id' aqui TEM que ser igual ao 'id' gerado no Auth.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. Tabela de PONTOS (Pointers)
-- ==========================================
CREATE TABLE public.pointers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL, -- Redundância útil para performance e segurança
  type TEXT NOT NULL, -- Ex: 'ENTRADA', 'SAIDA', 'INTERVALO'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. Índices de Performance (Opcional mas Recomendado)
-- ==========================================
-- Acelera buscas de usuários por empresa
CREATE INDEX idx_users_company ON public.users(company_id);

-- Acelera buscas de pontos por usuário e por data
CREATE INDEX idx_pointers_user ON public.pointers(user_id);
CREATE INDEX idx_pointers_company ON public.pointers(company_id);
CREATE INDEX idx_pointers_created_at ON public.pointers(created_at DESC);

-- ==========================================
-- 6. Segurança (Row Level Security - RLS)
-- ==========================================
-- Habilita RLS para que ninguém acesse dados de outras empresas via Client-Side
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pointers ENABLE ROW LEVEL SECURITY;

-- Políticas BÁSICAS (Permite leitura para usuários autenticados da mesma empresa)
-- Nota: Como você está fazendo um Backend em Node.js, seu servidor terá acesso total
-- mas essas regras protegem caso você use o Supabase Client direto no Frontend futuramente.

-- Política: Usuários só veem dados da sua própria empresa
CREATE POLICY "Users can view data from own company" ON public.users
  FOR SELECT USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can view pointers from own company" ON public.pointers
  FOR SELECT USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));