-- ==============================================================================
-- STEP 1: CLIENT PORTAL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- The Gravity Studios Client Portal
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLES DEFINITION
-- ------------------------------------------------------------------------------

-- profiles: Extends Supabase auth.users (1 row per user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'team', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- clients: One company/brand
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- client_members: Links users to a client company (multi-user per client support)
CREATE TABLE IF NOT EXISTS public.client_members (
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, user_id)
);

-- projects: Client projects & status
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL CHECK (phase IN ('strategy', 'pre_production', 'production', 'post_production', 'marketing', 'analysis')),
  status TEXT NOT NULL CHECK (status IN ('on_track', 'at_risk', 'delayed', 'completed')),
  start_date DATE,
  target_end_date DATE,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- project_team: Internal team/freelancer assignment to a project
CREATE TABLE IF NOT EXISTS public.project_team (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_on_project TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- documents: Storage path references for project documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- videos: Review copy videos & delivery links
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  master_file_url TEXT,
  revision_round INTEGER NOT NULL DEFAULT 1,
  max_revisions INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL CHECK (status IN ('pending_review', 'changes_requested', 'approved')),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- video_comments: Timestamped comments on videos
CREATE TABLE IF NOT EXISTS public.video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  timestamp_seconds NUMERIC NOT NULL,
  comment_text TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- invoices: Project invoices & billing status
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('unpaid', 'paid')),
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- activity_log: Audit trail of project actions
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. AUTOMATIC PROFILE CREATION TRIGGER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. RLS HELPER FUNCTIONS
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin_or_team()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'team')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_has_project_access(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT public.is_admin_or_team() OR EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.client_members cm ON cm.client_id = p.client_id
    WHERE p.id = p_project_id AND cm.user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile or admins/team can update any" ON public.profiles;
CREATE POLICY "Users can update own profile or admins/team can update any" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin_or_team());

-- CLIENTS
DROP POLICY IF EXISTS "Clients viewable by admin/team or client members" ON public.clients;
CREATE POLICY "Clients viewable by admin/team or client members" ON public.clients
  FOR SELECT TO authenticated USING (
    public.is_admin_or_team() OR id IN (SELECT client_id FROM public.client_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Clients manageable by admin/team only" ON public.clients;
CREATE POLICY "Clients manageable by admin/team only" ON public.clients
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- CLIENT_MEMBERS
DROP POLICY IF EXISTS "Client members viewable by admin/team or self" ON public.client_members;
CREATE POLICY "Client members viewable by admin/team or self" ON public.client_members
  FOR SELECT TO authenticated USING (
    public.is_admin_or_team() OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Client members manageable by admin/team only" ON public.client_members;
CREATE POLICY "Client members manageable by admin/team only" ON public.client_members
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- PROJECTS
DROP POLICY IF EXISTS "Projects viewable by admin/team or project client" ON public.projects;
CREATE POLICY "Projects viewable by admin/team or project client" ON public.projects
  FOR SELECT TO authenticated USING (
    public.is_admin_or_team() OR client_id IN (SELECT client_id FROM public.client_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Projects manageable by admin/team only" ON public.projects;
CREATE POLICY "Projects manageable by admin/team only" ON public.projects
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- PROJECT_TEAM
DROP POLICY IF EXISTS "Project team viewable by project access" ON public.project_team;
CREATE POLICY "Project team viewable by project access" ON public.project_team
  FOR SELECT TO authenticated USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Project team manageable by admin/team only" ON public.project_team;
CREATE POLICY "Project team manageable by admin/team only" ON public.project_team
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- DOCUMENTS
DROP POLICY IF EXISTS "Documents viewable by project access" ON public.documents;
CREATE POLICY "Documents viewable by project access" ON public.documents
  FOR SELECT TO authenticated USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Documents manageable by admin/team only" ON public.documents;
CREATE POLICY "Documents manageable by admin/team only" ON public.documents
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- VIDEOS
DROP POLICY IF EXISTS "Videos viewable by project access" ON public.videos;
CREATE POLICY "Videos viewable by project access" ON public.videos
  FOR SELECT TO authenticated USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Videos insertable by admin/team only" ON public.videos;
CREATE POLICY "Videos insertable by admin/team only" ON public.videos
  FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_team());

DROP POLICY IF EXISTS "Videos updatable by admin/team or client status update" ON public.videos;
CREATE POLICY "Videos updatable by admin/team or client status update" ON public.videos
  FOR UPDATE TO authenticated
  USING (public.user_has_project_access(project_id))
  WITH CHECK (
    public.is_admin_or_team() OR (
      public.user_has_project_access(project_id) AND status IN ('changes_requested', 'approved')
    )
  );

DROP POLICY IF EXISTS "Videos deletable by admin/team only" ON public.videos;
CREATE POLICY "Videos deletable by admin/team only" ON public.videos
  FOR DELETE TO authenticated USING (public.is_admin_or_team());

-- VIDEO_COMMENTS
DROP POLICY IF EXISTS "Video comments viewable by video project access" ON public.video_comments;
CREATE POLICY "Video comments viewable by video project access" ON public.video_comments
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.videos v WHERE v.id = video_id AND public.user_has_project_access(v.project_id))
  );

DROP POLICY IF EXISTS "Video comments insertable by video project access" ON public.video_comments;
CREATE POLICY "Video comments insertable by video project access" ON public.video_comments
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.videos v WHERE v.id = video_id AND public.user_has_project_access(v.project_id))
  );

DROP POLICY IF EXISTS "Video comments updatable by author or admin/team" ON public.video_comments;
CREATE POLICY "Video comments updatable by author or admin/team" ON public.video_comments
  FOR UPDATE TO authenticated USING (
    user_id = auth.uid() OR public.is_admin_or_team()
  );

DROP POLICY IF EXISTS "Video comments deletable by author or admin/team" ON public.video_comments;
CREATE POLICY "Video comments deletable by author or admin/team" ON public.video_comments
  FOR DELETE TO authenticated USING (
    user_id = auth.uid() OR public.is_admin_or_team()
  );

-- INVOICES
DROP POLICY IF EXISTS "Invoices viewable by project access" ON public.invoices;
CREATE POLICY "Invoices viewable by project access" ON public.invoices
  FOR SELECT TO authenticated USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Invoices manageable by admin/team only" ON public.invoices;
CREATE POLICY "Invoices manageable by admin/team only" ON public.invoices
  FOR ALL TO authenticated USING (public.is_admin_or_team()) WITH CHECK (public.is_admin_or_team());

-- ACTIVITY_LOG
DROP POLICY IF EXISTS "Activity log viewable by project access" ON public.activity_log;
CREATE POLICY "Activity log viewable by project access" ON public.activity_log
  FOR SELECT TO authenticated USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Activity log insertable by project access" ON public.activity_log;
CREATE POLICY "Activity log insertable by project access" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Activity log manageable by admin/team only" ON public.activity_log;
CREATE POLICY "Activity log manageable by admin/team only" ON public.activity_log
  FOR UPDATE TO authenticated USING (public.is_admin_or_team());

DROP POLICY IF EXISTS "Activity log deletable by admin/team only" ON public.activity_log;
CREATE POLICY "Activity log deletable by admin/team only" ON public.activity_log
  FOR DELETE TO authenticated USING (public.is_admin_or_team());
