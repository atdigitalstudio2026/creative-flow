-- ==============================================================================
-- CREATIVE TASK FLOW - Supabase PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
CREATE TYPE user_role_type AS ENUM ('SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR', 'REQUESTER');

CREATE TYPE task_status_type AS ENUM (
  'REQUESTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'SUBMITTED',
  'UNDER_REVIEW',
  'REVISION_REQUIRED',
  'RESUBMITTED',
  'APPROVED',
  'COMPLETED',
  'ARCHIVED',
  'ON_HOLD',
  'CANCELLED'
);

CREATE TYPE task_priority_type AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

CREATE TYPE audit_action_type AS ENUM (
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
  'ASSIGN', 'REASSIGN', 'HANDOVER', 'STATUS_CHANGE',
  'DEADLINE_CHANGE', 'PRIORITY_CHANGE', 'FILE_UPLOAD',
  'REVISION_REQUEST', 'RESUBMISSION', 'APPROVAL', 'USER_PERMISSION_CHANGE'
);

-- 3. CORE MASTER TABLES
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name user_role_type NOT NULL UNIQUE,
  label VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES roles(id),
  department_id UUID REFERENCES departments(id),
  position VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECTS & CAMPAIGNS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  department_id UUID REFERENCES departments(id),
  client_name VARCHAR(150),
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SEQUENCE & TRIGGER FOR TASK ID: CR-YYYY-XXXXX
CREATE SEQUENCE IF NOT EXISTS task_id_seq START WITH 1;

-- 7. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(80) NOT NULL,
  project_id UUID REFERENCES projects(id),
  campaign_id UUID REFERENCES campaigns(id),
  department_id UUID REFERENCES departments(id),
  requester_id UUID NOT NULL REFERENCES profiles(id),
  manager_id UUID REFERENCES profiles(id),
  current_assignee_id UUID REFERENCES profiles(id),
  original_assignee_id UUID REFERENCES profiles(id),
  priority task_priority_type NOT NULL DEFAULT 'NORMAL',
  deadline TIMESTAMPTZ NOT NULL,
  estimated_effort VARCHAR(50),
  progress_percentage INT NOT NULL DEFAULT 0,
  status task_status_type NOT NULL DEFAULT 'REQUESTED',
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_current_assignee ON tasks(current_assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_requester ON tasks(requester_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- 8. CREATIVE BRIEFS TABLE
CREATE TABLE IF NOT EXISTS task_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
  objective TEXT,
  target_audience TEXT,
  key_message TEXT,
  design_direction TEXT,
  mandatory_elements TEXT,
  do_list TEXT,
  dont_list TEXT,
  reference_links JSONB DEFAULT '[]'::jsonb,
  additional_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TASK ASSIGNMENT HISTORY
CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  assigned_from UUID REFERENCES profiles(id),
  assigned_to UUID NOT NULL REFERENCES profiles(id),
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task ON task_assignments(task_id);

-- 10. TASK HANDOVER (Explicit transfer with handover notes and progress)
CREATE TABLE IF NOT EXISTS task_handovers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  previous_assignee_id UUID NOT NULL REFERENCES profiles(id),
  new_assignee_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  progress_summary TEXT NOT NULL,
  handover_notes TEXT NOT NULL,
  current_version VARCHAR(20) NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_handovers_task ON task_handovers(task_id);

-- 11. VERSION CONTROL (Never overwrite previous files)
CREATE TABLE IF NOT EXISTS task_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  version_number VARCHAR(20) NOT NULL, -- V1, V2, V3, FINAL
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  description TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_versions_task ON task_versions(task_id);

-- 12. REVISION MANAGEMENT
CREATE TABLE IF NOT EXISTS task_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  revision_number INT NOT NULL,
  requested_by UUID NOT NULL REFERENCES profiles(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, RESOLVED
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_task_revisions_task ON task_revisions(task_id);

-- 13. APPROVAL RECORD
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL UNIQUE REFERENCES tasks(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES profiles(id),
  approved_version VARCHAR(20) NOT NULL,
  approval_note TEXT,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. COMMENTS & DISCUSSIONS (With @mentions)
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  comment TEXT NOT NULL,
  attachment_url TEXT,
  mentions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);

-- 15. ACTIVITY TIMELINE (Immutable event log for task story)
CREATE TABLE IF NOT EXISTS task_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_activity_task ON task_activity_logs(task_id);

-- 16. AUDIT LOGS (Immutable system changes: before/after values)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES profiles(id),
  action audit_action_type NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  before_value JSONB,
  after_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  entity_id VARCHAR(100),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(recipient_id, is_read);

-- 18. CHECKLISTS
CREATE TABLE IF NOT EXISTS task_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_task_checklists_task ON task_checklists(task_id);

-- 19. TASK DEPENDENCIES
CREATE TABLE IF NOT EXISTS task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  predecessor_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependent_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_dependency UNIQUE (predecessor_task_id, dependent_task_id)
);

-- 20. TASK TEMPLATES
CREATE TABLE IF NOT EXISTS task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  task_type VARCHAR(80) NOT NULL,
  description TEXT,
  default_priority task_priority_type NOT NULL DEFAULT 'NORMAL',
  default_sla_hours INT NOT NULL DEFAULT 24,
  default_brief JSONB,
  default_checklist JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. RECURRING TASKS
CREATE TABLE IF NOT EXISTS recurring_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  task_type VARCHAR(80) NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- DAILY, WEEKLY, MONTHLY
  template_id UUID REFERENCES task_templates(id),
  department_id UUID REFERENCES departments(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role_type AS $$
  SELECT r.name 
  FROM profiles p
  JOIN roles r ON p.role_id = r.id
  WHERE p.id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: Anyone authenticated can read profiles; Users can update own profile (except role)
CREATE POLICY "Allow authenticated read profiles"
  ON profiles FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Allow super admin update profiles"
  ON profiles FOR ALL TO authenticated
  USING (get_current_user_role() = 'SUPER_ADMIN');

-- Tasks: Super Admin & Manager have full access; Designers read assigned or requested tasks
CREATE POLICY "Tasks read policy"
  ON tasks FOR SELECT TO authenticated
  USING (
    get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER')
    OR current_assignee_id = auth.uid()
    OR original_assignee_id = auth.uid()
    OR requester_id = auth.uid()
    OR id IN (SELECT task_id FROM task_assignments WHERE assigned_to = auth.uid())
  );

CREATE POLICY "Tasks insert policy"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (
    get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER', 'REQUESTER')
  );

CREATE POLICY "Tasks update policy"
  ON tasks FOR UPDATE TO authenticated
  USING (
    get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER')
    OR (current_assignee_id = auth.uid() AND status IN ('ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'REVISION_REQUIRED', 'RESUBMITTED'))
  );

-- Approvals: ONLY Managers and Super Admins can insert/update approvals
CREATE POLICY "Approvals read policy"
  ON approvals FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approvals write policy"
  ON approvals FOR ALL TO authenticated
  USING (get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER'));

-- Task Versions: Designers and Managers can upload versions
CREATE POLICY "Versions read policy"
  ON task_versions FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Versions insert policy"
  ON task_versions FOR INSERT TO authenticated
  WITH CHECK (
    get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR')
  );

-- Audit logs: Read only for Admin & Manager; NEVER delete
CREATE POLICY "Audit logs read policy"
  ON audit_logs FOR SELECT TO authenticated
  USING (get_current_user_role() IN ('SUPER_ADMIN', 'MANAGER'));

CREATE POLICY "Audit logs insert policy"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (TRUE);

-- Notifications: Users only see their own notifications
CREATE POLICY "Notifications read policy"
  ON notifications FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Notifications update policy"
  ON notifications FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());
