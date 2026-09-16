import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskHandover,
  TaskVersion,
  TaskRevision,
  Approval,
  TaskComment,
  TaskChecklistItem,
  AuditLog,
  NotificationItem,
  UserProfile,
  TaskBrief,
  TaskAssignment
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_CAMPAIGNS,
  INITIAL_TEMPLATES
} from '../data/seedData';
import { Project, Campaign } from '../types';

const TASKS_STORAGE_KEY = 'ctf_tasks_data';
const AUDIT_STORAGE_KEY = 'ctf_audit_data';
const NOTIF_STORAGE_KEY = 'ctf_notifications_data';
const PROJECTS_STORAGE_KEY = 'ctf_projects_data';
const CAMPAIGNS_STORAGE_KEY = 'ctf_campaigns_data';

// Helper to load or initialize data
function loadInitialTasks(): Task[] {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading tasks from local storage', e);
  }
  return INITIAL_TASKS;
}

function loadInitialAudit(): AuditLog[] {
  try {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading audit logs', e);
  }
  return INITIAL_AUDIT_LOGS;
}

function loadInitialNotifications(): NotificationItem[] {
  try {
    const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
}

function loadInitialProjects(): Project[] {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading projects', e);
  }
  return INITIAL_PROJECTS;
}

function loadInitialCampaigns(): Campaign[] {
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading campaigns', e);
  }
  return INITIAL_CAMPAIGNS;
}

let tasksCache: Task[] = loadInitialTasks();
let auditLogsCache: AuditLog[] = loadInitialAudit();
let notificationsCache: NotificationItem[] = loadInitialNotifications();
let projectsCache: Project[] = loadInitialProjects();
let campaignsCache: Campaign[] = loadInitialCampaigns();

function saveTasks() {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksCache));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

function saveProjects() {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsCache));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

function saveCampaigns() {
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaignsCache));
  } catch (e) {
    console.error('Failed to save campaigns', e);
  }
}

function saveAudit() {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogsCache));
  } catch (e) {
    console.error('Failed to save audit logs', e);
  }
}

function saveNotifications() {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notificationsCache));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

// Generate sequential task ID: CR-2026-XXXXX
export function generateTaskId(): string {
  const year = new Date().getFullYear();
  const count = tasksCache.length + 1;
  const pad = count.toString().padStart(5, '0');
  return `CR-${year}-${pad}`;
}

export const taskService = {
  // Queries
  getTasks(): Task[] {
    return [...tasksCache];
  },

  getTaskById(id: string): Task | undefined {
    return tasksCache.find((t) => t.id === id || t.task_id === id);
  },

  getAuditLogs(): AuditLog[] {
    return [...auditLogsCache].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getNotifications(userId: string): NotificationItem[] {
    return notificationsCache
      .filter((n) => n.recipient_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  markNotificationAsRead(id: string) {
    notificationsCache = notificationsCache.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    saveNotifications();
  },

  markAllNotificationsAsRead(userId: string) {
    notificationsCache = notificationsCache.map((n) =>
      n.recipient_id === userId ? { ...n, is_read: true } : n
    );
    saveNotifications();
  },

  // Internal log helper
  recordAudit(
    actor: UserProfile,
    action: any,
    entityType: string,
    entityId: string,
    beforeVal: any,
    afterVal: any
  ) {
    const log: AuditLog = {
      id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actor_id: actor.id,
      actor_name: actor.full_name,
      action,
      entity_type: entityType,
      entity_id: entityId,
      before_value: beforeVal,
      after_value: afterVal,
      created_at: new Date().toISOString()
    };
    auditLogsCache.unshift(log);
    saveAudit();
  },

  recordNotification(
    recipientId: string,
    type: string,
    title: string,
    message: string,
    entityId?: string
  ) {
    const notif: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      recipient_id: recipientId,
      type,
      title,
      message,
      entity_id: entityId,
      is_read: false,
      created_at: new Date().toISOString()
    };
    notificationsCache.unshift(notif);
    saveNotifications();
  },

  // Mutation: Create Task
  createTask(
    data: {
      title: string;
      description?: string;
      task_type: string;
      project_id?: string;
      campaign_id?: string;
      department_id?: string;
      priority: TaskPriority;
      deadline: string;
      estimated_effort?: string;
      assignee_id?: string;
      brief: Partial<TaskBrief>;
      checklists?: string[];
    },
    creator: UserProfile
  ): Task {
    const newId = 'task-' + Date.now();
    const taskIdStr = generateTaskId();

    const assignee = data.assignee_id
      ? INITIAL_USERS.find((u) => u.id === data.assignee_id)
      : undefined;

    const project = data.project_id
      ? INITIAL_PROJECTS.find((p) => p.id === data.project_id)
      : undefined;

    const campaign = data.campaign_id
      ? INITIAL_CAMPAIGNS.find((c) => c.id === data.campaign_id)
      : undefined;

    const now = new Date().toISOString();

    const initialAssignments: TaskAssignment[] = [];
    if (assignee) {
      initialAssignments.push({
        id: 'asg-' + Date.now(),
        task_id: newId,
        assigned_to: assignee.id,
        assigned_to_name: assignee.full_name,
        assigned_by: creator.id,
        assigned_by_name: creator.full_name,
        reason: 'Penugasan awal pembuatan task',
        assigned_at: now
      });
    }

    const initialChecklistItems: TaskChecklistItem[] = (data.checklists || []).map((item, idx) => ({
      id: 'chk-' + Date.now() + '-' + idx,
      task_id: newId,
      title: item,
      completed: false,
      sort_order: idx + 1
    }));

    const newTask: Task = {
      id: newId,
      task_id: taskIdStr,
      title: data.title,
      description: data.description,
      task_type: data.task_type,
      project_id: data.project_id,
      project_name: project?.name,
      campaign_id: data.campaign_id,
      campaign_name: campaign?.name,
      department_id: data.department_id,
      requester_id: creator.id,
      requester_name: creator.full_name,
      manager_id: creator.role === 'MANAGER' ? creator.id : undefined,
      manager_name: creator.role === 'MANAGER' ? creator.full_name : undefined,
      current_assignee_id: assignee?.id,
      current_assignee_name: assignee?.full_name,
      current_assignee_avatar: assignee?.avatar_url,
      original_assignee_id: assignee?.id,
      original_assignee_name: assignee?.full_name,
      priority: data.priority,
      deadline: data.deadline,
      estimated_effort: data.estimated_effort || '8 Jam',
      progress_percentage: 0,
      status: assignee ? 'ASSIGNED' : 'REQUESTED',
      is_archived: false,
      created_at: now,
      updated_at: now,

      brief: {
        id: 'brief-' + Date.now(),
        task_id: newId,
        objective: data.brief.objective || '',
        target_audience: data.brief.target_audience || '',
        key_message: data.brief.key_message || data.brief.keyMessage || '',
        keyMessage: data.brief.keyMessage || data.brief.key_message || '',
        design_direction: data.brief.design_direction || data.brief.designDirection || '',
        designDirection: data.brief.designDirection || data.brief.design_direction || '',
        mandatory_elements: data.brief.mandatory_elements || data.brief.mandatoryElements || '',
        mandatoryElements: data.brief.mandatoryElements || data.brief.mandatory_elements || '',
        do_list: data.brief.do_list || data.brief.doList || '',
        doList: data.brief.doList || data.brief.do_list || '',
        dont_list: data.brief.dont_list || data.brief.dontList || '',
        dontList: data.brief.dontList || data.brief.dont_list || '',
        reference_links: data.brief.reference_links || [],
        additional_notes: data.brief.additional_notes || ''
      },
      checklists: initialChecklistItems,
      versions: [],
      revisions: [],
      handovers: [],
      assignments: initialAssignments,
      comments: [],
      activity_logs: [
        {
          id: 'act-' + Date.now(),
          task_id: newId,
          actor_id: creator.id,
          actor_name: creator.full_name,
          action: 'CREATE',
          description: `Membuat task ${taskIdStr}: "${data.title}"`,
          created_at: now
        }
      ],
      dependencies: []
    };

    tasksCache.unshift(newTask);
    saveTasks();

    this.recordAudit(creator, 'CREATE', 'TASK', taskIdStr, null, {
      title: data.title,
      priority: data.priority,
      deadline: data.deadline,
      assignee: assignee?.full_name
    });

    if (assignee) {
      this.recordNotification(
        assignee.id,
        'TASK_ASSIGNED',
        'Tugas Baru Ditugaskan',
        `${creator.full_name} menugaskan "${data.title}" (${taskIdStr}) kepada Anda.`,
        newId
      );
    }

    return newTask;
  },

  // Mutation: Assign or Reassign Task
  assignTask(
    taskId: string,
    newAssigneeId: string,
    reason: string,
    actor: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const newAssignee = INITIAL_USERS.find((u) => u.id === newAssigneeId);
    if (!newAssignee) throw new Error('User tujuan tidak ditemukan');

    const beforeAssignee = task.current_assignee_name;
    const now = new Date().toISOString();

    const previousAssignment = task.assignments.find((a) => !a.ended_at);
    if (previousAssignment) {
      previousAssignment.ended_at = now;
    }

    task.assignments.push({
      id: 'asg-' + Date.now(),
      task_id: task.id,
      assigned_from: task.current_assignee_id,
      assigned_from_name: task.current_assignee_name,
      assigned_to: newAssignee.id,
      assigned_to_name: newAssignee.full_name,
      assigned_by: actor.id,
      assigned_by_name: actor.full_name,
      reason: reason || 'Penugasan oleh Manager',
      assigned_at: now
    });

    if (!task.original_assignee_id) {
      task.original_assignee_id = newAssignee.id;
      task.original_assignee_name = newAssignee.full_name;
    }

    task.current_assignee_id = newAssignee.id;
    task.current_assignee_name = newAssignee.full_name;
    task.current_assignee_avatar = newAssignee.avatar_url;
    if (task.status === 'REQUESTED') {
      task.status = 'ASSIGNED';
    }
    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: actor.id,
      actor_name: actor.full_name,
      action: 'ASSIGN',
      description: `Menugaskan task kepada ${newAssignee.full_name}. Alasan: ${reason}`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(actor, 'ASSIGN', 'TASK', task.task_id, { assignee: beforeAssignee }, {
      assignee: newAssignee.full_name,
      reason
    });

    this.recordNotification(
      newAssignee.id,
      'TASK_ASSIGNED',
      'Penugasan Task Baru',
      `Anda ditugaskan untuk mengerjakan "${task.title}" (${task.task_id}).`,
      task.id
    );

    return task;
  },

  // Mutation: Handover Task (With complete handover record and zero history loss)
  handoverTask(
    taskId: string,
    newAssigneeId: string,
    reason: string,
    progressSummary: string,
    handoverNotes: string,
    actor: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const newAssignee = INITIAL_USERS.find((u) => u.id === newAssigneeId);
    if (!newAssignee) throw new Error('User penerima handover tidak ditemukan');

    const prevAssigneeId = task.current_assignee_id || actor.id;
    const prevAssigneeName = task.current_assignee_name || actor.full_name;
    const now = new Date().toISOString();

    const latestVersion = task.versions.length > 0
      ? task.versions[task.versions.length - 1].version_number
      : 'V0 (Brief)';

    const handoverRecord: TaskHandover = {
      id: 'hnd-' + Date.now(),
      task_id: task.id,
      previous_assignee_id: prevAssigneeId,
      previous_assignee_name: prevAssigneeName,
      new_assignee_id: newAssignee.id,
      new_assignee_name: newAssignee.full_name,
      reason,
      progress_summary: progressSummary,
      handover_notes: handoverNotes,
      current_version: latestVersion,
      created_by: actor.id,
      created_by_name: actor.full_name,
      created_at: now
    };

    task.handovers.push(handoverRecord);

    // End previous assignment and create new assignment
    const activeAssignment = task.assignments.find((a) => !a.ended_at);
    if (activeAssignment) {
      activeAssignment.ended_at = now;
    }

    task.assignments.push({
      id: 'asg-' + Date.now(),
      task_id: task.id,
      assigned_from: prevAssigneeId,
      assigned_from_name: prevAssigneeName,
      assigned_to: newAssignee.id,
      assigned_to_name: newAssignee.full_name,
      assigned_by: actor.id,
      assigned_by_name: actor.full_name,
      reason: `HANDOVER: ${reason}`,
      assigned_at: now
    });

    task.current_assignee_id = newAssignee.id;
    task.current_assignee_name = newAssignee.full_name;
    task.current_assignee_avatar = newAssignee.avatar_url;
    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: actor.id,
      actor_name: actor.full_name,
      action: 'HANDOVER',
      description: `Task dialihkan dari ${prevAssigneeName} ke ${newAssignee.full_name}. Alasan: "${reason}". Basis file: ${latestVersion}`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(actor, 'HANDOVER', 'TASK_HANDOVER', task.task_id, {
      assignee: prevAssigneeName
    }, {
      assignee: newAssignee.full_name,
      reason,
      current_version: latestVersion
    });

    this.recordNotification(
      newAssignee.id,
      'HANDOVER_RECEIVED',
      'Pekerjaan Dialihkan (Handover)',
      `Pekerjaan ${task.task_id} dialihkan kepada Anda dari ${prevAssigneeName}. Catatan: ${handoverNotes}`,
      task.id
    );

    return task;
  },

  // Mutation: Upload Version (Never overwrite previous versions)
  uploadVersion(
    taskId: string,
    data: {
      file_name: string;
      file_url: string;
      file_type: string;
      file_size: number;
      description?: string;
    },
    uploader: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const now = new Date().toISOString();

    const versionNum = task.versions.length + 1;
    const versionLabel = `V${versionNum}`;

    const newVersion: TaskVersion = {
      id: 'ver-' + Date.now(),
      task_id: task.id,
      version_number: versionLabel,
      uploaded_by: uploader.id,
      uploaded_by_name: uploader.full_name,
      file_url: data.file_url,
      file_name: data.file_name,
      file_type: data.file_type,
      file_size: data.file_size,
      description: data.description,
      is_approved: false,
      created_at: now
    };

    task.versions.push(newVersion);
    task.updated_at = now;

    // Advance status to SUBMITTED if in progress or revision
    const prevStatus = task.status;
    if (['IN_PROGRESS', 'REVISION_REQUIRED', 'RESUBMITTED'].includes(task.status)) {
      task.status = 'UNDER_REVIEW';
    }

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: uploader.id,
      actor_name: uploader.full_name,
      action: 'FILE_UPLOAD',
      description: `Mengunggah file versi ${versionLabel}: "${data.file_name}"`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(uploader, 'FILE_UPLOAD', 'TASK_VERSION', `${task.task_id}-${versionLabel}`, null, {
      file_name: data.file_name,
      version: versionLabel,
      size: data.file_size
    });

    // Notify Manager
    if (task.manager_id) {
      this.recordNotification(
        task.manager_id,
        'TASK_SUBMITTED',
        `File ${versionLabel} Diunggah`,
        `${uploader.full_name} telah mengunggah versi baru ${versionLabel} untuk task ${task.task_id}.`,
        task.id
      );
    }

    return task;
  },

  // Mutation: Request Revision
  requestRevision(
    taskId: string,
    feedback: string,
    manager: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const now = new Date().toISOString();

    const revisionRound = task.revisions.length + 1;
    const revision: TaskRevision = {
      id: 'rev-' + Date.now(),
      task_id: task.id,
      revision_number: revisionRound,
      requested_by: manager.id,
      requested_by_name: manager.full_name,
      requested_at: now,
      feedback,
      status: 'OPEN'
    };

    task.revisions.push(revision);
    task.status = 'REVISION_REQUIRED';
    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: manager.id,
      actor_name: manager.full_name,
      action: 'REVISION_REQUEST',
      description: `Meminta revisi putaran #${revisionRound}. Catatan: ${feedback.substring(0, 80)}...`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(manager, 'REVISION_REQUEST', 'TASK_REVISION', `${task.task_id}-REV-${revisionRound}`, null, {
      feedback,
      revision_number: revisionRound
    });

    if (task.current_assignee_id) {
      this.recordNotification(
        task.current_assignee_id,
        'REVISION_REQUESTED',
        `Revisi Diminta (Putaran #${revisionRound})`,
        `${manager.full_name} meminta revisi untuk task "${task.title}".`,
        task.id
      );
    }

    return task;
  },

  // Mutation: Resolve Revision & Submit
  resolveRevision(
    taskId: string,
    revisionId: string,
    actor: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const revision = task.revisions.find((r) => r.id === revisionId);
    if (!revision) throw new Error('Revisi tidak ditemukan');

    const now = new Date().toISOString();
    revision.status = 'RESOLVED';
    revision.resolved_at = now;
    revision.resolved_by = actor.id;
    revision.resolved_by_name = actor.full_name;

    task.status = 'UNDER_REVIEW';
    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: actor.id,
      actor_name: actor.full_name,
      action: 'RESUBMISSION',
      description: `Menandai revisi #${revision.revision_number} selesai dan mengajukan untuk review`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(actor, 'RESUBMISSION', 'TASK_REVISION', `${task.task_id}-REV-${revision.revision_number}`, {
      status: 'OPEN'
    }, {
      status: 'RESOLVED'
    });

    if (task.manager_id) {
      this.recordNotification(
        task.manager_id,
        'REVISION_SUBMITTED',
        'Revisi Telah Disubmit',
        `${actor.full_name} telah menyelesaikan revisi #${revision.revision_number} pada ${task.task_id}.`,
        task.id
      );
    }

    return task;
  },

  // Mutation: Approve Task
  approveTask(
    taskId: string,
    data: {
      approved_version: string;
      approval_note?: string;
    },
    approver: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const now = new Date().toISOString();

    const approvalRecord: Approval = {
      id: 'app-' + Date.now(),
      task_id: task.id,
      approved_by: approver.id,
      approved_by_name: approver.full_name,
      approved_version: data.approved_version,
      approval_note: data.approval_note,
      approved_at: now
    };

    task.approval = approvalRecord;
    task.status = 'APPROVED';
    task.progress_percentage = 100;
    task.completed_at = now;
    task.updated_at = now;

    // Mark the matching version as approved
    const ver = task.versions.find((v) => v.version_number === data.approved_version);
    if (ver) {
      ver.is_approved = true;
    }

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: approver.id,
      actor_name: approver.full_name,
      action: 'APPROVAL',
      description: `Approval final diberikan oleh ${approver.full_name} pada versi ${data.approved_version}. Catatan: "${data.approval_note || 'Approved'}"`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(approver, 'APPROVAL', 'APPROVAL', task.task_id, null, {
      approved_version: data.approved_version,
      approval_note: data.approval_note
    });

    if (task.current_assignee_id) {
      this.recordNotification(
        task.current_assignee_id,
        'TASK_APPROVED',
        'Task Approved!',
        `Selamat! Task ${task.task_id} telah disetujui oleh ${approver.full_name}.`,
        task.id
      );
    }

    return task;
  },

  // Mutation: Update Status (e.g. from Kanban or Action Bar)
  updateStatus(
    taskId: string,
    newStatus: TaskStatus,
    actor: UserProfile,
    reason?: string
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const oldStatus = task.status;
    if (oldStatus === newStatus) return task;

    const now = new Date().toISOString();
    task.status = newStatus;
    task.updated_at = now;

    if (newStatus === 'COMPLETED' && !task.completed_at) {
      task.completed_at = now;
      task.progress_percentage = 100;
    } else if (newStatus === 'IN_PROGRESS' && task.progress_percentage === 0) {
      task.progress_percentage = 25;
    }

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: actor.id,
      actor_name: actor.full_name,
      action: 'STATUS_CHANGE',
      description: `Status diubah dari ${oldStatus} menjadi ${newStatus}${reason ? `. Alasan: ${reason}` : ''}`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(actor, 'STATUS_CHANGE', 'TASK', task.task_id, { status: oldStatus }, {
      status: newStatus,
      reason
    });

    return task;
  },

  // Mutation: Update Progress %
  updateProgress(
    taskId: string,
    percentage: number,
    actor: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const prevVal = task.progress_percentage;
    task.progress_percentage = Math.min(100, Math.max(0, percentage));
    task.updated_at = new Date().toISOString();

    if (task.status === 'ASSIGNED' && percentage > 0) {
      task.status = 'IN_PROGRESS';
    }

    saveTasks();

    this.recordAudit(actor, 'UPDATE', 'TASK_PROGRESS', task.task_id, { progress: prevVal }, {
      progress: task.progress_percentage
    });

    return task;
  },

  // Mutation: Toggle Checklist Item
  toggleChecklist(
    taskId: string,
    checklistItemId: string,
    completed: boolean,
    actor: UserProfile
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const item = task.checklists.find((c) => c.id === checklistItemId);
    if (!item) throw new Error('Checklist item tidak ditemukan');

    item.completed = completed;
    item.completed_by = completed ? actor.id : undefined;
    item.completed_at = completed ? new Date().toISOString() : undefined;
    task.updated_at = new Date().toISOString();

    // Recalculate progress if appropriate
    const total = task.checklists.length;
    if (total > 0 && task.status !== 'APPROVED' && task.status !== 'COMPLETED') {
      const done = task.checklists.filter((c) => c.completed).length;
      task.progress_percentage = Math.round((done / total) * 100);
    }

    saveTasks();
    return task;
  },

  // Mutation: Add Comment with @mentions
  addComment(
    taskId: string,
    commentText: string,
    author: UserProfile,
    attachmentUrl?: string
  ): Task {
    const taskIndex = tasksCache.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task tidak ditemukan');

    const task = tasksCache[taskIndex];
    const now = new Date().toISOString();

    // Extract @mentions
    const mentionRegex = /@([a-zA-Z0-9._]+)/g;
    const matches = commentText.match(mentionRegex) || [];
    const mentions = matches.map((m) => m.substring(1));

    const newComment: TaskComment = {
      id: 'com-' + Date.now(),
      task_id: task.id,
      user_id: author.id,
      user_name: author.full_name,
      user_avatar: author.avatar_url,
      comment: commentText,
      attachment_url: attachmentUrl,
      mentions,
      created_at: now
    };

    task.comments.push(newComment);
    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: author.id,
      actor_name: author.full_name,
      action: 'COMMENT',
      description: `Menambahkan komentar pada diskusi task`,
      created_at: now
    });

    saveTasks();

    // Trigger notifications for mentioned users
    mentions.forEach((mentionName) => {
      const targetUser = INITIAL_USERS.find(
        (u) =>
          u.full_name.toLowerCase().includes(mentionName.toLowerCase()) ||
          u.email.toLowerCase().includes(mentionName.toLowerCase())
      );
      if (targetUser && targetUser.id !== author.id) {
        this.recordNotification(
          targetUser.id,
          'MENTION',
          `Anda disebut oleh ${author.full_name}`,
          `${author.full_name} me-mention Anda di ${task.task_id}: "${commentText.substring(0, 60)}..."`,
          task.id
        );
      }
    });

    return task;
  },

  // Project & Campaign queries & mutations
  getProjects(): Project[] {
    return [...projectsCache];
  },

  createProject(data: { name: string; code?: string; description?: string; client_name?: string }): Project {
    const newProj: Project = {
      id: 'prj-' + Date.now(),
      name: data.name,
      code: data.code || `PRJ-${data.name.substring(0, 3).toUpperCase()}${new Date().getFullYear().toString().slice(-2)}`,
      description: data.description || 'Proyek dibuat manual oleh pengguna',
      client_name: data.client_name || 'Internal',
      status: 'ACTIVE',
      department_id: 'dept-1'
    };
    projectsCache.push(newProj);
    saveProjects();
    return newProj;
  },

  getCampaigns(projectId?: string): Campaign[] {
    if (projectId) {
      return campaignsCache.filter((c) => c.project_id === projectId);
    }
    return [...campaignsCache];
  },

  createCampaign(data: { project_id: string; name: string; code?: string; start_date?: string; end_date?: string }): Campaign {
    const newCamp: Campaign = {
      id: 'cmp-' + Date.now(),
      project_id: data.project_id,
      name: data.name,
      code: data.code || `CMP-${data.name.substring(0, 3).toUpperCase()}`,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };
    campaignsCache.push(newCamp);
    saveCampaigns();
    return newCamp;
  },

  // Mutation: Update Task Details & Brief (Manual override / edit)
  updateTaskDetails(
    taskId: string,
    updates: {
      title?: string;
      task_type?: string;
      project_id?: string;
      project_name?: string;
      campaign_id?: string;
      campaign_name?: string;
      priority?: TaskPriority;
      deadline?: string;
      estimated_effort?: string;
      current_assignee_id?: string;
      current_assignee_name?: string;
      status?: TaskStatus;
      briefUpdates?: Partial<TaskBrief>;
      checklists?: TaskChecklistItem[];
    },
    actor: UserProfile
  ): Task | null {
    const task = tasksCache.find((t) => t.id === taskId || t.task_id === taskId);
    if (!task) return null;

    const beforeSnapshot = {
      title: task.title,
      task_type: task.task_type,
      priority: task.priority,
      deadline: task.deadline,
      project_name: task.project_name
    };

    const now = new Date().toISOString();

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.task_type !== undefined) task.task_type = updates.task_type;
    if (updates.project_id !== undefined) task.project_id = updates.project_id;
    if (updates.project_name !== undefined) task.project_name = updates.project_name;
    if (updates.campaign_id !== undefined) task.campaign_id = updates.campaign_id;
    if (updates.campaign_name !== undefined) task.campaign_name = updates.campaign_name;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.deadline !== undefined) task.deadline = updates.deadline;
    if (updates.estimated_effort !== undefined) task.estimated_effort = updates.estimated_effort;
    if (updates.status !== undefined) task.status = updates.status;

    if (updates.current_assignee_id !== undefined) {
      task.current_assignee_id = updates.current_assignee_id;
      task.current_assignee_name = updates.current_assignee_name;
    }

    if (updates.briefUpdates) {
      task.brief = {
        ...task.brief,
        ...updates.briefUpdates,
        // sync aliases
        keyMessage: updates.briefUpdates.keyMessage || updates.briefUpdates.key_message || task.brief.keyMessage,
        key_message: updates.briefUpdates.key_message || updates.briefUpdates.keyMessage || task.brief.key_message,
        designDirection: updates.briefUpdates.designDirection || updates.briefUpdates.design_direction || task.brief.designDirection,
        design_direction: updates.briefUpdates.design_direction || updates.briefUpdates.designDirection || task.brief.design_direction,
        mandatoryElements: updates.briefUpdates.mandatoryElements || updates.briefUpdates.mandatory_elements || task.brief.mandatoryElements,
        mandatory_elements: updates.briefUpdates.mandatory_elements || updates.briefUpdates.mandatoryElements || task.brief.mandatory_elements,
        doList: updates.briefUpdates.doList || updates.briefUpdates.do_list || task.brief.doList,
        do_list: updates.briefUpdates.do_list || updates.briefUpdates.do_list || task.brief.do_list,
        dontList: updates.briefUpdates.dontList || updates.briefUpdates.dont_list || task.brief.dontList,
        dont_list: updates.briefUpdates.dont_list || updates.briefUpdates.dont_list || task.brief.dont_list,
      };
      if (updates.briefUpdates.reference_links) {
        task.brief.reference_links = updates.briefUpdates.reference_links;
      }
    }

    if (updates.checklists) {
      task.checklists = updates.checklists;
      const completedCount = task.checklists.filter((c) => c.completed).length;
      task.progress_percentage = task.checklists.length > 0
        ? Math.round((completedCount / task.checklists.length) * 100)
        : task.progress_percentage;
    }

    task.updated_at = now;

    task.activity_logs.push({
      id: 'act-' + Date.now(),
      task_id: task.id,
      actor_id: actor.id,
      actor_name: actor.full_name,
      action: 'UPDATE',
      description: `Memperbarui rincian informasi dan creative brief task`,
      created_at: now
    });

    saveTasks();

    this.recordAudit(
      actor,
      'STATUS_CHANGE',
      'TASK',
      task.task_id,
      beforeSnapshot,
      {
        title: task.title,
        task_type: task.task_type,
        priority: task.priority,
        deadline: task.deadline,
        project_name: task.project_name
      }
    );

    return task;
  },

  // Mutation: Delete or Archive Task
  deleteTask(taskId: string, actor: UserProfile): boolean {
    const idx = tasksCache.findIndex((t) => t.id === taskId || t.task_id === taskId);
    if (idx === -1) return false;

    const removed = tasksCache.splice(idx, 1)[0];
    saveTasks();

    this.recordAudit(actor, 'UPDATE', 'TASK', removed.task_id, { title: removed.title }, 'DELETED');
    return true;
  },

  // Reset to initial seed
  resetData() {
    localStorage.removeItem(TASKS_STORAGE_KEY);
    localStorage.removeItem(AUDIT_STORAGE_KEY);
    localStorage.removeItem(NOTIF_STORAGE_KEY);
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
    localStorage.removeItem(CAMPAIGNS_STORAGE_KEY);
    tasksCache = [...INITIAL_TASKS];
    auditLogsCache = [...INITIAL_AUDIT_LOGS];
    notificationsCache = [...INITIAL_NOTIFICATIONS];
    projectsCache = [...INITIAL_PROJECTS];
    campaignsCache = [...INITIAL_CAMPAIGNS];
  }
};
