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