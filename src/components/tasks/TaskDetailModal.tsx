import React, { useState } from 'react';
import { Task, TaskVersion, TaskRevision, TaskStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { HandoverModal } from './HandoverModal';
import { formatDateIndo } from '../../utils/dateUtils';
import {
  X,
  FileText,
  Layers,
  Repeat,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  History,
  Upload,
  Sparkles,
  Download,
  Send,
  AtSign,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  Clock,
  ChevronRight,
  Edit3,
  Save,
  Plus,
  Trash2,
  PenTool,
  Image,
  RefreshCw,
  Check
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { taskService } from '../../services/taskService';
import { TaskChecklistItem, TaskBrief } from '../../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUploadVersion: (
    taskId: string,
    data: {
      file_name: string;
      file_url: string;
      file_type: string;
      file_size: number;
      description?: string;
    }
  ) => void;
  onRequestRevision: (taskId: string, feedback: string) => void;
  onResolveRevision: (taskId: string, revisionId: string) => void;
  onApproveTask: (
    taskId: string,
    data: { approved_version: string; approval_note?: string }
  ) => void;
  onSubmitHandover: (
    taskId: string,
    newAssigneeId: string,
    reason: string,
    progressSummary: string,
    handoverNotes: string
  ) => void;
  onToggleChecklist: (taskId: string, checklistId: string, completed: boolean) => void;
  onAddComment: (taskId: string, text: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onUpdateProgress: (taskId: string, percentage: number) => void;
  onUpdateTaskDetails?: (
    taskId: string,
    updates: {
      title?: string;
      task_type?: string;
      project_id?: string;
      project_name?: string;
      campaign_id?: string;
      campaign_name?: string;
      priority?: any;
      deadline?: string;
      estimated_effort?: string;
      current_assignee_id?: string;
      current_assignee_name?: string;
      status?: TaskStatus;
      briefUpdates?: Partial<TaskBrief>;
      checklists?: TaskChecklistItem[];
    }
  ) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onUploadVersion,
  onRequestRevision,
  onResolveRevision,
  onApproveTask,
  onSubmitHandover,
  onToggleChecklist,
  onAddComment,
  onUpdateStatus,
  onUpdateProgress,
  onUpdateTaskDetails,
  onDeleteTask
}) => {
  const { currentUser, currentRole, canApproveTask, canRequestRevision, canUploadVersion, canHandover, allUsers } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'brief' | 'versions' | 'revisions' | 'handover' | 'comments' | 'activity'
  >('brief');

  const [showHandoverModal, setShowHandoverModal] = useState(false);

  // Edit Task & Brief Manual state
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTaskType, setEditTaskType] = useState(task.task_type);
  const [isManualTaskType, setIsManualTaskType] = useState(false);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDeadline, setEditDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
  );
  const [editEffort, setEditEffort] = useState(task.estimated_effort || '');
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);

  // Project & Campaign lists & overrides
  const [projectsList, setProjectsList] = useState(() => taskService.getProjects());
  const [campaignsList, setCampaignsList] = useState(() => taskService.getCampaigns());
  const [selectedProjectId, setSelectedProjectId] = useState(task.project_id || '');
  const [isManualProject, setIsManualProject] = useState(false);
  const [manualProjectName, setManualProjectName] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState(task.campaign_id || '');
  const [isManualCampaign, setIsManualCampaign] = useState(false);
  const [manualCampaignName, setManualCampaignName] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(task.current_assignee_id || '');

  // Brief fields
  const [editObjective, setEditObjective] = useState(task.brief.objective || '');
  const [editTargetAudience, setEditTargetAudience] = useState(task.brief.target_audience || '');
  const [editKeyMessage, setEditKeyMessage] = useState(task.brief.keyMessage || task.brief.key_message || '');
  const [editDesignDirection, setEditDesignDirection] = useState(task.brief.designDirection || task.brief.design_direction || '');
  const [editMandatoryElements, setEditMandatoryElements] = useState(task.brief.mandatoryElements || task.brief.mandatory_elements || '');
  const [editDoList, setEditDoList] = useState(task.brief.doList || task.brief.do_list || '');
  const [editDontList, setEditDontList] = useState(task.brief.dontList || task.brief.dont_list || '');

  // Reference links & Checklists
  const [editRefLinks, setEditRefLinks] = useState<{ title: string; url: string }[]>(() => {
    return (task.brief.reference_links || []).map((l: any) =>
      typeof l === 'string' ? { title: l, url: l } : { title: l?.title || '', url: l?.url || '' }
    );
  });
  const [newRefTitle, setNewRefTitle] = useState('');
  const [newRefUrl, setNewRefUrl] = useState('');

  const [editChecklists, setEditChecklists] = useState<TaskChecklistItem[]>(task.checklists || []);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Synchronize edit fields whenever task updates
  React.useEffect(() => {
    setEditTitle(task.title);
    setEditTaskType(task.task_type);
    setEditPriority(task.priority);
    setEditDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
    setEditEffort(task.estimated_effort || '');
    setEditStatus(task.status);
    setSelectedProjectId(task.project_id || '');
    setSelectedCampaignId(task.campaign_id || '');
    setSelectedAssigneeId(task.current_assignee_id || '');
    setEditObjective(task.brief.objective || '');
    setEditTargetAudience(task.brief.target_audience || '');
    setEditKeyMessage(task.brief.keyMessage || task.brief.key_message || '');
    setEditDesignDirection(task.brief.designDirection || task.brief.design_direction || '');
    setEditMandatoryElements(task.brief.mandatoryElements || task.brief.mandatory_elements || '');
    setEditDoList(task.brief.doList || task.brief.do_list || '');
    setEditDontList(task.brief.dontList || task.brief.dont_list || '');
    setEditRefLinks(
      (task.brief.reference_links || []).map((l: any) =>
        typeof l === 'string' ? { title: l, url: l } : { title: l?.title || '', url: l?.url || '' }
      )
    );
    setEditChecklists(task.checklists || []);
    setProjectsList(taskService.getProjects());
    setCampaignsList(taskService.getCampaigns());
  }, [task]);

  // Upload version form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [customVersionTag, setCustomVersionTag] = useState(`V${task.versions.length + 1}`);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileDesc, setNewFileDesc] = useState('');

  // Revision request form state
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Approval form state
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvedVersionChoice, setApprovedVersionChoice] = useState(
    task.versions.length > 0 ? task.versions[task.versions.length - 1].version_number : 'V1'
  );
  const [approvalNotes, setApprovalNotes] = useState('Desain sesuai dengan standar brand dan brief.');

  // Comment input
  const [commentText, setCommentText] = useState('');

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<{ summary: string; insights: string } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateAiSummary = async () => {
    setLoadingAi(true);
    try {
      const res = await aiService.summarizeTask(task);
      setAiSummary(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFileName(file.name);
    try {
      const previewUrl = URL.createObjectURL(file);
      setNewFileUrl(previewUrl);
    } catch (err) {
      // ignore
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    onUploadVersion(task.id, {
      file_name: newFileName,
      file_url: newFileUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      file_type: newFileName.endsWith('.mp4') ? 'video/mp4' : 'image/png',
      file_size: 2450000,
      description: newFileDesc ? `[${customVersionTag}] ${newFileDesc}` : `Versi ${customVersionTag}`
    });

    setNewFileName('');
    setNewFileUrl('');
    setNewFileDesc('');
    setShowUploadForm(false);
    setActiveTab('versions');
  };

  const REVISION_QUICK_CHIPS = [
    'Perbaiki typo & ejaan copywriting',
    'Sesuaikan warna dengan hex code panduan brand',
    'Ganti ke aset foto resolusi tinggi (tidak pecah)',
    'Ubah aspect ratio sesuai ketentuan penempatan',
    'Perjelas hierarki visual & tombol Call to Action',
    'Perhatikan elemen do & don\'ts pada brief'
  ];

  const handleAppendRevisionChip = (chipText: string) => {
    setRevisionFeedback((prev) => {
      if (!prev.trim()) return chipText;
      return `${prev}\n• ${chipText}`;
    });
  };

  const handleAddRefLink = () => {
    if (!newRefUrl.trim()) return;
    setEditRefLinks([...editRefLinks, { title: newRefTitle.trim() || newRefUrl.trim(), url: newRefUrl.trim() }]);
    setNewRefTitle('');
    setNewRefUrl('');
  };

  const handleRemoveRefLink = (idx: number) => {
    setEditRefLinks(editRefLinks.filter((_, i) => i !== idx));
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: TaskChecklistItem = {
      id: `chk_${Date.now()}`,
      task_id: task.id,
      title: newChecklistText.trim(),
      completed: false,
      sort_order: editChecklists.length + 1
    };
    setEditChecklists([...editChecklists, newItem]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setEditChecklists(editChecklists.filter(c => c.id !== id));
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    let finalProjectId = selectedProjectId;
    let finalProjectName = task.project_name;
    if (isManualProject && manualProjectName.trim()) {
      const newP = taskService.createProject({
        name: manualProjectName.trim(),
        description: 'Dibuat manual saat edit task'
      });
      finalProjectId = newP.id;
      finalProjectName = newP.name;
    } else if (selectedProjectId) {
      const foundP = projectsList.find(p => p.id === selectedProjectId);
      if (foundP) finalProjectName = foundP.name;
    }

    let finalCampaignId = selectedCampaignId;
    let finalCampaignName = task.campaign_name;
    if (isManualCampaign && manualCampaignName.trim()) {
      const newC = taskService.createCampaign({
        name: manualCampaignName.trim(),
        project_id: finalProjectId || 'prj-1'
      });
      finalCampaignId = newC.id;
      finalCampaignName = newC.name;
    } else if (selectedCampaignId) {
      const foundC = campaignsList.find(c => c.id === selectedCampaignId);
      if (foundC) finalCampaignName = foundC.name;
    }

    let finalAssigneeName = task.current_assignee_name;
    if (selectedAssigneeId) {
      const foundU = (allUsers || []).find(u => u.id === selectedAssigneeId);
      if (foundU) finalAssigneeName = foundU.full_name;
    }

    const updates = {
      title: editTitle.trim(),
      task_type: editTaskType.trim(),
      project_id: finalProjectId,
      project_name: finalProjectName,
      campaign_id: finalCampaignId,
      campaign_name: finalCampaignName,
      priority: editPriority,
      deadline: editDeadline ? new Date(editDeadline).toISOString() : task.deadline,
      estimated_effort: editEffort.trim(),
      current_assignee_id: selectedAssigneeId,
      current_assignee_name: finalAssigneeName,
      status: editStatus,
      briefUpdates: {
        objective: editObjective,
        target_audience: editTargetAudience,
        key_message: editKeyMessage,
        design_direction: editDesignDirection,
        mandatory_elements: editMandatoryElements,
        do_list: editDoList,
        dont_list: editDontList,
        reference_links: editRefLinks.filter(l => l.url.trim())
      },
      checklists: editChecklists
    };

    if (onUpdateTaskDetails) {
      onUpdateTaskDetails(task.id, updates);
    }
    setIsEditingTask(false);
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) return;

    onRequestRevision(task.id, revisionFeedback);
    setRevisionFeedback('');
    setShowRevisionForm(false);
    setActiveTab('revisions');
  };

  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApproveTask(task.id, {
      approved_version: approvedVersionChoice,
      approval_note: approvalNotes
    });
    setShowApprovalForm(false);
    setActiveTab('revisions');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText);
    setCommentText('');
  };

  const latestVersion = task.versions.length > 0
    ? task.versions[task.versions.length - 1].version_number
    : 'Belum ada file';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-page-enter">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-indigo-900/40">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700 shadow-2xs">
                {task.task_id}
              </span>
              <StatusBadge status={task.status} size="sm" />
              <PriorityBadge priority={task.priority} />
              {task.handovers.length > 0 && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700 shadow-2xs">
                  Dialihkan ({task.handovers.length}x)
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-1 truncate font-display">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5 truncate">
              <span>Project: {task.project_name || 'Stand-alone'}</span>
              <span>&bull;</span>
              <span>Assignee: {task.current_assignee_name || 'Belum ditugaskan'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canHandover && (
              <button
                onClick={() => setShowHandoverModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer active:scale-95"
                title="Alihkan pengerjaan ke desainer lain secara resmi"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Handover</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Header Banner: Progress & Status Quick Updates */}
        <div className="bg-neutral-50 dark:bg-slate-800/80 px-5 py-3 border-b border-neutral-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-slate-400 font-medium">Batas Waktu:</span>
              <DeadlineBadge deadline={task.deadline} status={task.status} showExact />
            </div>

            {/* Quick Status Override Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 dark:text-slate-400 font-medium">Status:</span>
              <select
                value={task.status}
                onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                className="px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-neutral-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="REQUESTED">Requested</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="REVISION_REQUIRED">Revision Required</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Progress Slider */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-slate-400 font-medium">Progress:</span>
              <span className="font-bold text-neutral-900 dark:text-white font-mono">
                {task.progress_percentage}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={task.progress_percentage}
                onChange={(e) => onUpdateProgress(task.id, parseInt(e.target.value))}
                className="w-20 sm:w-24 h-1.5 bg-neutral-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingTask(!isEditingTask)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-2xs ${
                isEditingTask
                  ? 'bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 dark:bg-slate-700 hover:bg-neutral-800 dark:hover:bg-slate-600 text-white'
              }`}
              title="Edit semua kolom dan keterangan secara manual jika di sistem tidak sesuai"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingTask ? 'Tutup Form Edit' : 'Edit Task & Brief (Manual)'}</span>
            </button>

            <button
              onClick={handleGenerateAiSummary}
              disabled={loadingAi}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{loadingAi ? 'Menganalisis...' : 'AI Ringkasan'}</span>
            </button>
          </div>
        </div>

        {/* AI Summary Banner if generated */}
        {aiSummary && (
          <div className="mx-5 mt-4 p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-amber-900 dark:text-amber-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Ringkasan AI & Insight Status:
              </span>
              <button
                onClick={() => setAiSummary(null)}
                className="text-amber-700 hover:text-amber-900 text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-neutral-700 dark:text-slate-300 leading-relaxed">{aiSummary.summary}</p>
            <p className="text-amber-900 dark:text-amber-300 font-medium">{aiSummary.insights}</p>
          </div>
        )}

        {/* Navigation Tabs (Only shown when not in edit mode) */}
        {!isEditingTask ? (
          <div className="flex border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('brief')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'brief'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Creative Brief & Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('versions')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'versions'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Versi Deliverable</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 font-bold">
                {task.versions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revisions')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'revisions'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revisi & Approval</span>
              {task.revisions.length > 0 && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                  {task.revisions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('handover')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'handover'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>Traceability & Handover</span>
              {task.handovers.length > 0 && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                  {task.handovers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Aktivitas</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Diskusi</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-slate-800 text-neutral-700 dark:text-slate-300 font-bold">
                {task.comments.length}
              </span>
            </button>
          </div>
        ) : (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 flex items-center justify-between text-xs shrink-0">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-amber-600" />
              Mode Pengeditan Rincian Task & Creative Brief (Manual Input Aktif)
            </span>
            <button
              type="button"
              onClick={() => setIsEditingTask(false)}
              className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs cursor-pointer"
            >
              Batalkan Edit & Kembali
            </button>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-6">
          {isEditingTask ? (
            <form onSubmit={handleSaveEditSubmit} className="space-y-6 animate-in fade-in">
              {/* Header Info */}
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">
                    Mode Pengeditan & Input Bebas Manual
                  </h3>
                  <p className="text-neutral-600 text-xs mt-0.5">
                    Anda dapat mengubah seluruh kolom task, status alur, prioritas, penugasan, serta rincian creative brief secara leluasa. Jika ada opsi sistem yang tidak sesuai, Anda dapat mengetikkan teks kustom secara manual.
                  </p>
                </div>
              </div>

              {/* Grid 2 Columns: Informasi Task & Creative Brief */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1: Info Pekerjaan */}
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-4">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-neutral-600" />
                    Informasi Utama Pekerjaan
                  </h4>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Judul Task / Pekerjaan <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900 focus:ring-1 focus:ring-neutral-900"
                      required
                    />
                  </div>

                  {/* Task Type with Manual Override */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-neutral-800">
                        Jenis Desain / Task Type <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsManualTaskType(!isManualTaskType)}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                      >
                        {isManualTaskType ? 'Pilih dari Dropdown' : '+ Ketik Manual'}
                      </button>
                    </div>
                    {isManualTaskType ? (
                      <input
                        type="text"
                        value={editTaskType}
                        onChange={(e) => setEditTaskType(e.target.value)}
                        placeholder="Contoh: 3D Render Blender, Banner E-Commerce 1200x628, Video Tiktok..."
                        className="w-full p-2.5 rounded-lg border border-amber-400 bg-amber-50/30 text-neutral-900 font-medium focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    ) : (
                      <select
                        value={editTaskType}
                        onChange={(e) => setEditTaskType(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium"
                      >
                        <option value="Feed Instagram">Feed Instagram</option>
                        <option value="Story / Reels / TikTok Video">Story / Reels / TikTok Video</option>
                        <option value="Key Visual Campaign">Key Visual Campaign</option>
                        <option value="Banner Ads Display">Banner Ads Display</option>
                        <option value="Print & Packaging">Print & Packaging</option>
                        <option value="Motion Graphic">Motion Graphic</option>
                        <option value="Logo & Brand Identity">Logo & Brand Identity</option>
                        <option value="Website & App UI Design">Website & App UI Design</option>
                        <option value="Katalog & E-Book Layout">Katalog & E-Book Layout</option>
                        <option value={editTaskType}>{editTaskType}</option>
                      </select>
                    )}
                  </div>

                  {/* Project with Manual Override */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-neutral-800">
                        Proyek (Project)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsManualProject(!isManualProject)}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                      >
                        {isManualProject ? 'Pilih dari Dropdown' : '+ Proyek Baru (Manual)'}
                      </button>
                    </div>
                    {isManualProject ? (
                      <input
                        type="text"
                        value={manualProjectName}
                        onChange={(e) => setManualProjectName(e.target.value)}
                        placeholder="Ketik nama proyek baru..."
                        className="w-full p-2.5 rounded-lg border border-amber-400 bg-amber-50/30 text-neutral-900 font-medium"
                      />
                    ) : (
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium"
                      >
                        <option value="">-- Tanpa Proyek / Stand-alone --</option>
                        {projectsList.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Campaign with Manual Override */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-medium text-neutral-800">
                        Kampanye (Campaign)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsManualCampaign(!isManualCampaign)}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                      >
                        {isManualCampaign ? 'Pilih dari Dropdown' : '+ Kampanye Baru (Manual)'}
                      </button>
                    </div>
                    {isManualCampaign ? (
                      <input
                        type="text"
                        value={manualCampaignName}
                        onChange={(e) => setManualCampaignName(e.target.value)}
                        placeholder="Ketik nama kampanye baru..."
                        className="w-full p-2.5 rounded-lg border border-amber-400 bg-amber-50/30 text-neutral-900 font-medium"
                      />
                    ) : (
                      <select
                        value={selectedCampaignId}
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium"
                      >
                        <option value="">-- Tanpa Kampanye --</option>
                        {campaignsList.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Priority & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">Prioritas</label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as any)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-900"
                      >
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">Status Alur Kerja</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-900"
                      >
                        <option value="REQUESTED">Requested</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="REVISION_REQUIRED">Revision Required</option>
                        <option value="APPROVED">Approved</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Deadline & Effort */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">Batas Waktu (Deadline)</label>
                      <input
                        type="datetime-local"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">Estimasi Waktu Kerja</label>
                      <input
                        type="text"
                        value={editEffort}
                        onChange={(e) => setEditEffort(e.target.value)}
                        placeholder="Contoh: 4 Jam, 2 Hari Kerja"
                        className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* Quick effort chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['2 Jam', '4 Jam', '8 Jam', '2 Hari', '3 Hari', '1 Minggu'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setEditEffort(chip)}
                        className="px-2 py-0.5 rounded bg-white hover:bg-neutral-100 border border-neutral-300 text-[10px] font-medium text-neutral-700"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Desainer Penanggung Jawab (Assignee)
                    </label>
                    <select
                      value={selectedAssigneeId}
                      onChange={(e) => setSelectedAssigneeId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium"
                    >
                      <option value="">-- Belum Ditugaskan --</option>
                      {(allUsers || []).map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Column 2: Creative Brief */}
                <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-4">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-600" />
                    Creative Brief & Petunjuk Teknis
                  </h4>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Objektif Utama (Objective)
                    </label>
                    <textarea
                      rows={2}
                      value={editObjective}
                      onChange={(e) => setEditObjective(e.target.value)}
                      placeholder="Apa target utama yang ingin dicapai melalui karya ini?"
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Target Audiens
                    </label>
                    <input
                      type="text"
                      value={editTargetAudience}
                      onChange={(e) => setEditTargetAudience(e.target.value)}
                      placeholder="Contoh: Gen Z perkotaan, B2B Decision Maker, Usia 20-35 tahun..."
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Pesan Kunci (Key Message)
                    </label>
                    <textarea
                      rows={2}
                      value={editKeyMessage}
                      onChange={(e) => setEditKeyMessage(e.target.value)}
                      placeholder="Pesan utama atau copy headline yang harus disampaikan..."
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Arahan Visual (Design Direction)
                    </label>
                    <textarea
                      rows={2}
                      value={editDesignDirection}
                      onChange={(e) => setEditDesignDirection(e.target.value)}
                      placeholder="Mood, warna dominan, style typography, lighting, aesthetic feel..."
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Elemen Wajib (Mandatory Elements)
                    </label>
                    <textarea
                      rows={2}
                      value={editMandatoryElements}
                      onChange={(e) => setEditMandatoryElements(e.target.value)}
                      placeholder="Elemen wajib seperti logo brand, foto produk, legal disclaimer, watermark..."
                      className="w-full p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-emerald-800 mb-1">
                        Hal yang Harus Dilakukan (Do's)
                      </label>
                      <textarea
                        rows={2}
                        value={editDoList}
                        onChange={(e) => setEditDoList(e.target.value)}
                        placeholder="Contoh: Gunakan whitespace lapang, foto resolusi tajam..."
                        className="w-full p-2.5 rounded-lg border border-emerald-300 bg-emerald-50/40 text-emerald-950 leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-rose-800 mb-1">
                        Hal yang Dilarang (Don'ts)
                      </label>
                      <textarea
                        rows={2}
                        value={editDontList}
                        onChange={(e) => setEditDontList(e.target.value)}
                        placeholder="Contoh: Jangan mengubah rasio logo, jangan gunakan warna di luar brand..."
                        className="w-full p-2.5 rounded-lg border border-rose-300 bg-rose-50/40 text-rose-950 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tautan Referensi Moodboard */}
              <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                    Tautan Referensi Moodboard & Asset ({editRefLinks.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {editRefLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-neutral-200">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => {
                            const updated = [...editRefLinks];
                            updated[idx].title = e.target.value;
                            setEditRefLinks(updated);
                          }}
                          placeholder="Judul / Keterangan Tautan"
                          className="p-1.5 rounded border border-neutral-300 text-xs"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...editRefLinks];
                            updated[idx].url = e.target.value;
                            setEditRefLinks(updated);
                          }}
                          placeholder="https://pinterest.com/..."
                          className="p-1.5 rounded border border-neutral-300 text-xs font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRefLink(idx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                        title="Hapus tautan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Add Link */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newRefTitle}
                    onChange={(e) => setNewRefTitle(e.target.value)}
                    placeholder="Judul referensi (opsional)"
                    className="w-full sm:w-1/3 p-2 rounded-lg border border-neutral-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    value={newRefUrl}
                    onChange={(e) => setNewRefUrl(e.target.value)}
                    placeholder="URL tautan (e.g. https://...)"
                    className="w-full sm:flex-1 p-2 rounded-lg border border-neutral-300 bg-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddRefLink}
                    disabled={!newRefUrl.trim()}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Link</span>
                  </button>
                </div>
              </div>

              {/* Checklist Kelengkapan */}
              <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-neutral-600" />
                    Daftar Checklist Elemen Desain ({editChecklists.length})
                  </h4>
                </div>

                <div className="space-y-1.5">
                  {editChecklists.map((chk) => (
                    <div key={chk.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="font-medium text-neutral-800 text-xs">{chk.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(chk.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                        title="Hapus checklist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    placeholder="Ketik item checklist baru..."
                    className="flex-1 p-2 rounded-lg border border-neutral-300 bg-white text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    disabled={!newChecklistText.trim()}
                    className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Item</span>
                  </button>
                </div>
              </div>

              {/* Actions Bottom Bar */}
              <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  {(currentRole === 'SUPER_ADMIN' || currentRole === 'CREATIVE_DIRECTOR' || currentRole === 'PROJECT_MANAGER') && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Task Ini</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTask(false)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 font-semibold text-neutral-700 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Semua Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
              {/* TAB 1: CREATIVE BRIEF & CHECKLIST */}
              {activeTab === 'brief' && (
            <div className="space-y-6">
              {/* Brief Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Objektif Utama (Objective)
                  </span>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {task.brief.objective || 'Tidak dicantumkan'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Target Audiens
                  </span>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {task.brief.target_audience || 'Tidak dicantumkan'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Key Message
                  </span>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {task.brief.keyMessage || task.brief.key_message || 'Tidak dicantumkan'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Arahan Visual (Design Direction)
                  </span>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {task.brief.designDirection || task.brief.design_direction || 'Tidak dicantumkan'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1 md:col-span-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Elemen Wajib (Mandatory Elements)
                  </span>
                  <p className="text-neutral-900 font-medium leading-relaxed">
                    {task.brief.mandatoryElements || task.brief.mandatory_elements || 'Logo brand, foto produk 4K, copy headline'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Hal yang Harus Dilakukan (Do's)
                  </span>
                  <p className="text-emerald-950 font-medium leading-relaxed">
                    {task.brief.doList || task.brief.do_list || 'Gunakan whitespace lapang, typography kontras tinggi'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                    Hal yang Dilarang (Don'ts)
                  </span>
                  <p className="text-rose-950 font-medium leading-relaxed">
                    {task.brief.dontList || task.brief.dont_list || 'Jangan gunakan teks berdesakan tanpa visual breathing room'}
                  </p>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-xs">
                      Checklist Kelengkapan Elemen Desain
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Tandai setiap komponen yang telah tervalidasi dalam karya
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {task.checklists.filter((c) => c.completed).length} / {task.checklists.length} Selesai
                  </span>
                </div>

                <div className="divide-y divide-neutral-100">
                  {task.checklists.length === 0 ? (
                    <div className="py-4 text-center text-neutral-400 text-xs">
                      Belum ada item checklist pada task ini.
                    </div>
                  ) : (
                    task.checklists.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onToggleChecklist(task.id, item.id, !item.completed)}
                        className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 px-2 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          {item.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
                          )}
                          <span
                            className={`font-medium ${
                              item.completed
                                ? 'line-through text-neutral-400'
                                : 'text-neutral-900'
                            }`}
                          >
                            {item.title}
                          </span>
                        </div>

                        {item.completed && item.completed_at && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {formatDateIndo(item.completed_at)}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reference Links */}
              {task.brief.reference_links && task.brief.reference_links.length > 0 && (
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Tautan Referensi Moodboard & Asset
                  </span>
                  <div className="space-y-1.5">
                    {task.brief.reference_links.map((link: any, i: number) => {
                      const url = typeof link === 'string' ? link : (link?.url || '#');
                      const title = typeof link === 'string' ? link : (link?.title || link?.url || 'Tautan Referensi');
                      const hasDistinctUrl = typeof link !== 'string' && link?.url && link?.title && link.url !== link.title;

                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1.5 font-medium group"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 text-amber-600 group-hover:text-amber-800" />
                          <span className="truncate">{title}</span>
                          {hasDistinctUrl && (
                            <span className="text-[10px] text-neutral-400 font-mono truncate max-w-xs">
                              ({link.url})
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERSI DELIVERABLES (VERSION CONTROL) */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <h3 className="font-bold text-neutral-900 text-xs">
                    Pusat Arsip Iterasi & Version Control
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Setiap file yang diunggah disimpan berurutan (V1, V2, V3...) dan tidak pernah menimpa file sebelumnya.
                  </p>
                </div>

                {canUploadVersion && (
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Versi Baru</span>
                  </button>
                )}
              </div>

              {/* Upload Form Box */}
              {showUploadForm && (
                <form
                  onSubmit={handleUploadSubmit}
                  className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-900 text-xs">
                      Upload Iterasi Deliverable
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-neutral-600 font-medium">Tag Versi:</span>
                      <input
                        type="text"
                        value={customVersionTag}
                        onChange={(e) => setCustomVersionTag(e.target.value)}
                        placeholder="V1, V2, V2.1..."
                        className="w-24 p-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono font-bold text-neutral-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Local file selection or manual URL */}
                  <div className="p-3 bg-white rounded-lg border border-dashed border-amber-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        Pilih File dari Perangkat (Lokal)
                      </span>
                      <span className="text-[10px] text-neutral-400">PNG, JPG, MP4, PDF, SVG</span>
                    </div>
                    <input
                      type="file"
                      onChange={handleLocalFileSelect}
                      className="block w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                    />
                    {newFileUrl && (
                      <div className="pt-2 flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                        <img
                          src={newFileUrl}
                          alt="Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
                          onError={(e) => {
                            (e.target as any).style.display = 'none';
                          }}
                        />
                        <div className="text-[11px] text-neutral-600 min-w-0">
                          <p className="font-semibold text-neutral-900 truncate">{newFileName}</p>
                          <p className="text-[10px] text-emerald-600 font-medium">File siap diunggah sebagai deliverable</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">
                        Nama File Export <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="e.g. KV_Banner_IG_Feed_V2.png"
                        className="w-full p-2 text-xs rounded-lg border border-neutral-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">
                        File URL / Cloud Storage Path (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newFileUrl}
                        onChange={(e) => setNewFileUrl(e.target.value)}
                        placeholder="https://storage.supabase.co/..."
                        className="w-full p-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-800 mb-1">
                      Catatan Perubahan / Changelog Versi Ini
                    </label>
                    <input
                      type="text"
                      value={newFileDesc}
                      onChange={(e) => setNewFileDesc(e.target.value)}
                      placeholder="e.g. Mengubah ukuran logo brand 15% lebih besar dan menyesuaikan kontras background"
                      className="w-full p-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simpan Versi {customVersionTag}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Version History Cards */}
              <div className="space-y-3">
                {task.versions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                    Belum ada deliverable yang diunggah untuk task ini.
                  </div>
                ) : (
                  task.versions.map((ver, idx) => (
                    <div
                      key={ver.id}
                      className={`p-4 rounded-xl border transition-all ${
                        ver.is_approved
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              ver.is_approved
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold'
                                : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                            }`}
                          >
                            {ver.version_number}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-neutral-900 text-xs">
                                {ver.file_name}
                              </span>
                              {ver.is_approved && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                  <ShieldCheck className="w-3 h-3" />
                                  APPROVED FINAL
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Diunggah oleh <span className="font-semibold text-neutral-700">{ver.uploaded_by_name}</span> &bull; {formatDateIndo(ver.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={ver.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ({ver.file_size ? `${(ver.file_size / 1024 / 1024).toFixed(1)} MB` : 'Asset'})</span>
                          </a>
                        </div>
                      </div>

                      {ver.description && (
                        <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-700">
                          <span className="font-semibold text-neutral-900">Catatan Versi: </span>
                          {ver.description}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REVISI & APPROVAL (PUSAT REVIEW MANAJERIAL) */}
          {activeTab === 'revisions' && (
            <div className="space-y-6">
              {/* Approval Stamp Header if approved */}
              {task.approval && (
                <div className="p-4 rounded-xl border-2 border-emerald-400 bg-emerald-50 text-emerald-950 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-emerald-950">
                        APPROVAL FINAL RESMI
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                        Versi {task.approval.approved_version}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900">
                      Disetujui oleh <span className="font-semibold">{task.approval.approved_by_name}</span> pada {formatDateIndo(task.approval.approved_at)}
                    </p>
                    {task.approval.approval_note && (
                      <p className="text-xs bg-white/80 p-2 rounded-lg border border-emerald-200 mt-1 italic">
                        "{task.approval.approval_note}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Manager */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <h3 className="font-bold text-neutral-900 text-xs">
                    Manajemen Review & Keputusan Final
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Putaran revisi terstruktur dan hak persetujuan manajerial
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {canRequestRevision && task.status !== 'APPROVED' && (
                    <button
                      onClick={() => setShowRevisionForm(!showRevisionForm)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Minta Revisi Baru</span>
                    </button>
                  )}

                  {canApproveTask && task.status !== 'APPROVED' && (
                    <button
                      onClick={() => setShowApprovalForm(!showApprovalForm)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Beri Approval Final</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Revision Request Form */}
              {showRevisionForm && (
                <form
                  onSubmit={handleRevisionSubmit}
                  className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3 animate-in fade-in"
                >
                  <h4 className="font-bold text-rose-900 text-xs">
                    Minta Revisi Baru (Putaran #{task.revisions.length + 1})
                  </h4>
                  <p className="text-[11px] text-rose-800">
                    Berikan feedback yang objektif dan terukur agar desainer dapat mengeksekusi dengan presisi.
                  </p>

                  {/* Quick feedback chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-rose-900 font-bold uppercase tracking-wider">
                      Opsi Cepat Feedback (Klik untuk menyisipkan ke catatan):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {REVISION_QUICK_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setRevisionFeedback((prev) =>
                              prev.trim() ? `${prev}\n• ${chip}` : `• ${chip}`
                            );
                          }}
                          className="px-2 py-0.5 rounded bg-white hover:bg-rose-100 border border-rose-200 text-[10px] text-rose-900 font-medium transition-colors"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    placeholder="Tuliskan poin-poin yang perlu diperbaiki (bebas ketik manual)..."
                    className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs bg-white text-neutral-900 font-medium leading-relaxed focus:ring-1 focus:ring-rose-500"
                    required
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRevisionForm(false)}
                      className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                    >
                      Kirim Instruksi Revisi
                    </button>
                  </div>
                </form>
              )}

              {/* Approval Modal Form */}
              {showApprovalForm && (
                <form
                  onSubmit={handleApprovalSubmit}
                  className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in"
                >
                  <h4 className="font-bold text-emerald-900 text-xs">
                    Konfirmasi Approval Final Resmi
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">
                        Pilih Versi yang Disetujui <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={approvedVersionChoice}
                        onChange={(e) => setApprovedVersionChoice(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border border-neutral-300 bg-white"
                        required
                      >
                        {task.versions.map((v) => (
                          <option key={v.id} value={v.version_number}>
                            {v.version_number} — {v.file_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-800 mb-1">
                        Catatan Approval Resmi
                      </label>
                      <input
                        type="text"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="e.g. Selesai dan disetujui untuk publikasi"
                        className="w-full p-2 text-xs rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApprovalForm(false)}
                      className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Beri Persetujuan Resmi
                    </button>
                  </div>
                </form>
              )}

              {/* Revision History Rounds */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 text-xs">
                  Riwayat Putaran Revisi ({task.revisions.length})
                </h4>

                {task.revisions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                    Belum ada putaran revisi pada task ini.
                  </div>
                ) : (
                  task.revisions.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border ${
                        rev.status === 'OPEN'
                          ? 'border-rose-300 bg-rose-50/30'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              rev.status === 'OPEN'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            Putaran #{rev.revision_number}
                          </span>
                          <span className="font-semibold text-neutral-900 text-xs">
                            Diminta oleh {rev.requested_by_name}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {formatDateIndo(rev.requested_at)}
                          </span>
                        </div>

                        <div>
                          {rev.status === 'OPEN' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                              STATUS: OPEN
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              SELESAI DIREVISI
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
                        {rev.feedback}
                      </div>

                      {rev.status === 'OPEN' && canUploadVersion && (
                        <div className="mt-3 flex items-center justify-end">
                          <button
                            onClick={() => onResolveRevision(task.id, rev.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                          >
                            Tandai Revisi Selesai & Kirim untuk Review
                          </button>
                        </div>
                      )}

                      {rev.status === 'RESOLVED' && rev.resolved_at && (
                        <div className="mt-2 text-[10px] text-neutral-500">
                          Diselesaikan oleh {rev.resolved_by_name} pada {formatDateIndo(rev.resolved_at)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TRACEABILITY & HANDOVER */}
          {activeTab === 'handover' && (
            <div className="space-y-6">
              {/* Traceability Guarantee Banner */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 text-purple-950 space-y-1">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-purple-700" />
                  <h4 className="font-bold text-xs text-purple-950">
                    Jaminan Traceability & Audit Trail Tanpa Kehilangan Jejak
                  </h4>
                </div>
                <p className="text-[11px] text-purple-900/80 leading-relaxed">
                  Semua perpindahan pekerjaan dari Designer A ke Designer B tercatat abadi di sistem.
                  Catatan progres, alasan perpindahan, dan file basis tidak dapat diubah atau dihapus.
                </p>
              </div>

              {/* Custody Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Desainer Awal (Original Assignee)
                  </span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {task.original_assignee_name || 'Belum ditugaskan'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Desainer Bertanggung Jawab Saat Ini
                  </span>
                  <p className="font-bold text-neutral-900 text-sm">
                    {task.current_assignee_name || 'Belum ditugaskan'}
                  </p>
                </div>
              </div>

              {/* Handover Events List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 text-xs">
                    Riwayat Pengalihan Pekerjaan (Handover Log)
                  </h4>
                  {canHandover && (
                    <button
                      onClick={() => setShowHandoverModal(true)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white"
                    >
                      + Alihkan Tugas
                    </button>
                  )}
                </div>

                {task.handovers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                    Task ini masih dikerjakan oleh desainer asli dan belum pernah dialihkan.
                  </div>
                ) : (
                  task.handovers.map((hnd) => (
                    <div
                      key={hnd.id}
                      className="p-4 rounded-xl border border-purple-200 bg-white space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-xs">
                            {hnd.previous_assignee_name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="font-bold text-purple-900 text-xs">
                            {hnd.new_assignee_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatDateIndo(hnd.created_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-neutral-500 text-[10px] font-semibold block">
                            Alasan Pengalihan:
                          </span>
                          <span className="font-medium text-neutral-900">{hnd.reason}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] font-semibold block">
                            Versi File Basis:
                          </span>
                          <span className="font-mono font-bold text-neutral-900">{hnd.current_version}</span>
                        </div>
                      </div>

                      {hnd.progress_summary && (
                        <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
                          <span className="font-semibold text-neutral-800">Rangkuman Progres: </span>
                          <span className="text-neutral-700">{hnd.progress_summary}</span>
                        </div>
                      )}

                      {hnd.handover_notes && (
                        <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200/70 text-xs">
                          <span className="font-semibold text-purple-900">Catatan Khusus Handover: </span>
                          <span className="text-purple-950">{hnd.handover_notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Assignment Timeline Chain */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-neutral-900 text-xs">
                  Rantai Penugasan Lengkap (Chain of Custody)
                </h4>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                  {task.assignments.map((asg, idx) => (
                    <div key={asg.id} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-neutral-900">
                          {asg.assigned_to_name}
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Ditugaskan oleh {asg.assigned_by_name} &bull; {asg.reason}
                        </p>
                      </div>
                      <div className="text-right font-mono text-[10px] text-neutral-400">
                        <span>Mulai: {formatDateIndo(asg.assigned_at)}</span>
                        {asg.ended_at && (
                          <span className="block text-rose-500">Selesai: {formatDateIndo(asg.ended_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DISKUSI & @MENTIONS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {task.comments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                    Belum ada diskusi untuk task ini. Mulai percakapan di bawah!
                  </div>
                ) : (
                  task.comments.map((com) => (
                    <div key={com.id} className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={com.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={com.user_name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-neutral-200"
                          />
                          <span className="font-bold text-neutral-900 text-xs">
                            {com.user_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatDateIndo(com.created_at)}
                        </span>
                      </div>
                      <p className="text-neutral-800 text-xs leading-relaxed whitespace-pre-wrap pl-8">
                        {com.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-neutral-200 space-y-2">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tulis komentar atau gunakan @nama untuk menyebut rekan tim (contoh: @Rian)..."
                    className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 bg-white"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <AtSign className="w-3 h-3" /> Mention mengirim notifikasi seketika
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Komentar</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: ACTIVITY LOG TIMELINE */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-xs">
                Jejak Audit Aktivitas Abadi (Append-Only Event Stream)
              </h4>
              <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
                {task.activity_logs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-neutral-900 border-2 border-white ring-2 ring-neutral-300" />
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">{log.actor_name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formatDateIndo(log.created_at)}
                        </span>
                      </div>
                      <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 uppercase font-semibold">
                        {log.action}
                      </span>
                      <p className="text-neutral-700 mt-1 leading-relaxed">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-neutral-500 font-mono text-[11px]">
            Created: {formatDateIndo(task.created_at)} &bull; By {task.requester_name}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 font-semibold text-neutral-700"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Delete Task Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-neutral-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">Hapus Task Secara Permanen?</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              Task <span className="font-bold text-neutral-900">"{task.title}"</span> ({task.task_id}) beserta seluruh versi file, putaran revisi, dan jejak auditnya akan dihapus permanen.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteTask) onDeleteTask(task.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Ya, Hapus Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handover Modal popup */}
      {showHandoverModal && (
        <HandoverModal
          task={task}
          onClose={() => setShowHandoverModal(false)}
          onSubmitHandover={(taskId, newAssignee, reason, progressSummary, handoverNotes) => {
            onSubmitHandover(taskId, newAssignee, reason, progressSummary, handoverNotes);
            setShowHandoverModal(false);
          }}
        />
      )}
    </div>
  );
};
