import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { taskService } from './services/taskService';
import { Task, TaskPriority, TaskStatus, TaskBrief } from './types';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TaskListView } from './components/tasks/TaskListView';
import { KanbanBoardView } from './components/kanban/KanbanBoardView';
import { TaskCalendarView } from './components/calendar/TaskCalendarView';
import { TeamAccessView } from './components/team/TeamAccessView';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { HandoverModal } from './components/tasks/HandoverModal';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { DatabaseSettingsModal } from './components/settings/DatabaseSettingsModal';
import { UserManualModal } from './components/common/UserManualModal';

function CreativeTaskFlowApp() {
  const { currentUser, currentRole } = useAuth();
  const { refreshNotifications } = useNotifications();

  const [tasks, setTasks] = useState<Task[]>(() => taskService.getTasks());
  const [auditLogs, setAuditLogs] = useState(() => taskService.getAuditLogs());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [handoverTaskTarget, setHandoverTaskTarget] = useState<Task | null>(null);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Sync data refresh helper
  const reloadData = () => {
    const updatedTasks = taskService.getTasks();
    setTasks(updatedTasks);
    setAuditLogs(taskService.getAuditLogs());
    refreshNotifications();

    // If modal is open, refresh selected task instance
    if (selectedTask) {
      const refreshed = updatedTasks.find((t) => t.id === selectedTask.id);
      if (refreshed) {
        setSelectedTask(refreshed);
      }
    }
  };

  // Mutation Handlers
  const handleCreateTask = (data: {
    title: string;
    description?: string;
    task_type: string;
    project_id?: string;
    campaign_id?: string;
    priority: TaskPriority;
    deadline: string;
    estimated_effort?: string;
    assignee_id?: string;
    brief: Partial<TaskBrief>;
    checklists?: string[];
  }) => {
    const created = taskService.createTask(data, currentUser);
    reloadData();
    setSelectedTask(created);
  };

  const handleHandoverTask = (
    taskId: string,
    newAssigneeId: string,
    reason: string,
    progressSummary: string,
    handoverNotes: string
  ) => {
    taskService.handoverTask(
      taskId,
      newAssigneeId,
      reason,
      progressSummary,
      handoverNotes,
      currentUser
    );
    reloadData();
  };

  const handleUploadVersion = (
    taskId: string,
    data: {
      file_name: string;
      file_url: string;
      file_type: string;
      file_size: number;
      description?: string;
    }
  ) => {
    taskService.uploadVersion(taskId, data, currentUser);
    reloadData();
  };

  const handleRequestRevision = (taskId: string, feedback: string) => {
    taskService.requestRevision(taskId, feedback, currentUser);
    reloadData();
  };

  const handleResolveRevision = (taskId: string, revisionId: string) => {
    taskService.resolveRevision(taskId, revisionId, currentUser);
    reloadData();
  };

  const handleApproveTask = (
    taskId: string,
    data: { approved_version: string; approval_note?: string }
  ) => {
    taskService.approveTask(taskId, data, currentUser);
    reloadData();
  };

  const handleToggleChecklist = (taskId: string, checklistId: string, completed: boolean) => {
    taskService.toggleChecklist(taskId, checklistId, completed, currentUser);
    reloadData();
  };

  const handleAddComment = (taskId: string, text: string) => {
    taskService.addComment(taskId, text, currentUser);
    reloadData();
  };

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    taskService.updateStatus(taskId, status, currentUser);
    reloadData();
  };

  const handleUpdateProgress = (taskId: string, percentage: number) => {
    taskService.updateProgress(taskId, percentage, currentUser);
    reloadData();
  };

  const handleUpdateTaskDetails = (taskId: string, updates: any) => {
    taskService.updateTaskDetails(taskId, updates, currentUser);
    reloadData();
  };

  const handleDeleteTask = (taskId: string) => {
    taskService.deleteTask(taskId, currentUser);
    setSelectedTask(null);
    reloadData();
  };

  const handleResetData = () => {
    taskService.resetData();
    reloadData();
  };

  // Counts for sidebar badges
  const myTasksCount = tasks.filter(
    (t) =>
      t.current_assignee_id === currentUser.id &&
      !['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)
  ).length;

  const underReviewCount = tasks.filter(
    (t) => t.status === 'UNDER_REVIEW' || t.status === 'SUBMITTED'
  ).length;

  const revisionCount = tasks.filter((t) => t.status === 'REVISION_REQUIRED').length;

  return (
    <div className="min-h-screen ambient-mesh-canvas flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300 transition-colors duration-200 relative overflow-hidden">
      {/* Top Navigation */}
      <Navbar
        onOpenAi={() => setShowAiDrawer(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenManual={() => setShowManualModal(true)}
        onOpenTeam={() => setActiveTab('team')}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'all-tasks') {
            setActiveTab('all-tasks');
          }
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto relative z-10 px-2 sm:px-4 py-3 sm:py-4 gap-3 sm:gap-4">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'settings') {
              setShowSettingsModal(true);
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenCreateTask={() => setShowCreateModal(true)}
          onOpenManual={() => setShowManualModal(true)}
          myTasksCount={myTasksCount}
          underReviewCount={underReviewCount}
          revisionCount={revisionCount}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto min-w-0 pr-1">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              tasks={tasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onOpenCreateTask={() => setShowCreateModal(true)}
              onOpenAi={() => setShowAiDrawer(true)}
            />
          )}

          {activeTab === 'my-tasks' && (
            <TaskListView
              tasks={tasks}
              filterAssigneeId={currentUser.id}
              pageTitle={`Pekerjaan Saya (${currentUser.full_name})`}
              onSelectTask={(task) => setSelectedTask(task)}
              onOpenCreateTask={() => setShowCreateModal(true)}
              onOpenHandover={(task) => setHandoverTaskTarget(task)}
            />
          )}

          {activeTab === 'all-tasks' && (
            <TaskListView
              tasks={tasks}
              pageTitle="Daftar Seluruh Pekerjaan Tim Kreatif"
              onSelectTask={(task) => setSelectedTask(task)}
              onOpenCreateTask={() => setShowCreateModal(true)}
              onOpenHandover={(task) => setHandoverTaskTarget(task)}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanBoardView
              tasks={tasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onUpdateStatus={handleUpdateStatus}
              onOpenCreateTask={() => setShowCreateModal(true)}
              onOpenHandover={(task) => setHandoverTaskTarget(task)}
            />
          )}

          {activeTab === 'calendar' && (
            <TaskCalendarView
              tasks={tasks}
              onSelectTask={(task) => setSelectedTask(task)}
            />
          )}

          {activeTab === 'team' && <TeamAccessView />}
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUploadVersion={handleUploadVersion}
          onRequestRevision={handleRequestRevision}
          onResolveRevision={handleResolveRevision}
          onApproveTask={handleApproveTask}
          onSubmitHandover={handleHandoverTask}
          onToggleChecklist={handleToggleChecklist}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
          onUpdateProgress={handleUpdateProgress}
          onUpdateTaskDetails={handleUpdateTaskDetails}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}

      {/* Standalone Handover Modal from list */}
      {handoverTaskTarget && (
        <HandoverModal
          task={handoverTaskTarget}
          onClose={() => setHandoverTaskTarget(null)}
          onSubmitHandover={(taskId, newAssignee, reason, progress, notes) => {
            handleHandoverTask(taskId, newAssignee, reason, progress, notes);
            setHandoverTaskTarget(null);
          }}
        />
      )}

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={showAiDrawer}
        onClose={() => setShowAiDrawer(false)}
        onApplyBriefToNewTask={(briefData) => {
          setShowCreateModal(true);
        }}
      />

      {/* Database & Infrastructure Settings Modal */}
      <DatabaseSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onResetData={handleResetData}
      />

      {/* User Manual & SOP PDF Modal */}
      <UserManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CreativeTaskFlowApp />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
