export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'DESIGNER' | 'CONTENT_CREATOR' | 'REQUESTER';

export type TaskStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUIRED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'ON_HOLD'
  | 'CANCELLED';

export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ASSIGN'
  | 'REASSIGN'
  | 'HANDOVER'
  | 'STATUS_CHANGE'
  | 'DEADLINE_CHANGE'
  | 'PRIORITY_CHANGE'
  | 'FILE_UPLOAD'
  | 'REVISION_REQUEST'
  | 'RESUBMISSION'
  | 'APPROVAL'
  | 'USER_PERMISSION_CHANGE';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  position: string;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  client_name?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  department_id?: string;
}

export interface Campaign {
  id: string;
  project_id: string;
  name: string;
  code: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface TaskBrief {
  id?: string;
  task_id?: string;
  objective: string;
  target_audience: string;
  key_message?: string;
  keyMessage?: string;
  design_direction?: string;
  designDirection?: string;
  mandatory_elements?: string;
  mandatoryElements?: string;
  do_list?: string;
  doList?: string;
  dont_list?: string;
  dontList?: string;
  reference_links: any[];
  additional_notes?: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  assigned_from?: string;
  assigned_from_name?: string;
  assigned_to: string;
  assigned_to_name: string;
  assigned_by: string;
  assigned_by_name: string;
  reason?: string;
  assigned_at: string;
  ended_at?: string;
}

export interface TaskHandover {
  id: string;
  task_id: string;
  previous_assignee_id: string;
  previous_assignee_name: string;
  new_assignee_id: string;
  new_assignee_name: string;
  reason: string;
  progress_summary: string;
  handover_notes: string;
  current_version: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface TaskVersion {
  id: string;
  task_id: string;
  version_number: string; // V1, V2, V3, FINAL
  uploaded_by: string;
  uploaded_by_name: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description?: string;
  is_approved: boolean;
  created_at: string;
}

export interface TaskRevision {
  id: string;
  task_id: string;
  revision_number: number;
  requested_by: string;
  requested_by_name: string;
  requested_at: string;
  feedback: string;
  status: 'OPEN' | 'RESOLVED';
  resolved_at?: string;
  resolved_by?: string;
  resolved_by_name?: string;
}

export interface Approval {
  id: string;
  task_id: string;
  approved_by: string;
  approved_by_name: string;
  approved_version: string;
  approval_note?: string;
  approved_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  comment: string;
  attachment_url?: string;
  mentions: string[];
  created_at: string;
}

export interface TaskChecklistItem {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  completed_by?: string;
  completed_at?: string;
  sort_order: number;
}

export interface TaskDependency {
  id: string;
  predecessor_task_id: string;
  dependent_task_id: string;
  predecessor_title?: string;
  predecessor_status?: TaskStatus;
}

export interface TaskActivityLog {
  id: string;
  task_id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  description: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  before_value?: any;
  after_value?: any;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string;
  entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  task_type: string;
  description?: string;
  default_priority: TaskPriority;
  default_sla_hours: number;
  estimated_effort?: string;
  default_brief: Partial<TaskBrief>;
  default_checklist: string[];
}

export interface Task {
  id: string;
  task_id: string; // e.g. CR-2026-00001
  title: string;
  description?: string;
  task_type: string;
  project_id?: string;
  project_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  department_id?: string;
  department_name?: string;
  requester_id: string;
  requester_name: string;
  manager_id?: string;
  manager_name?: string;
  current_assignee_id?: string;
  current_assignee_name?: string;
  current_assignee_avatar?: string;
  original_assignee_id?: string;
  original_assignee_name?: string;
  priority: TaskPriority;
  deadline: string;
  estimated_effort?: string;
  progress_percentage: number;
  status: TaskStatus;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;

  // Associated details
  brief?: TaskBrief;
  checklists: TaskChecklistItem[];
  versions: TaskVersion[];
  revisions: TaskRevision[];
  approval?: Approval;
  comments: TaskComment[];
  handovers: TaskHandover[];
  assignments: TaskAssignment[];
  activity_logs: TaskActivityLog[];
  dependencies: TaskDependency[];
}

export interface TeamWorkloadStats {
  user: UserProfile;
  totalActiveTasks: number;
  tasksUnderReview: number;
  tasksRevision: number;
  tasksOverdue: number;
  tasksDueToday: number;
}
