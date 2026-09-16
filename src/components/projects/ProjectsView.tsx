import React, { useState } from 'react';
import { Task } from '../../types';
import { INITIAL_PROJECTS, INITIAL_CAMPAIGNS } from '../../data/seedData';
import { Briefcase, Calendar, CheckCircle2, Clock, FolderGit2 } from 'lucide-react';
import { formatDateOnly } from '../../utils/dateUtils';

interface ProjectsViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ tasks, onSelectTask }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0]?.id || '');

  const activeProject = INITIAL_PROJECTS.find((p) => p.id === selectedProjectId) || INITIAL_PROJECTS[0];
  const projectCampaigns = INITIAL_CAMPAIGNS.filter((c) => c.project_id === activeProject?.id);
  const projectTasks = tasks.filter((t) => t.project_id === activeProject?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Proyek & Kampanye Kreatif
        </h2>
        <p className="text-xs text-neutral-500">
          Struktur multi-proyek dan kampanye terpadu
        </p>
      </div>

      {/* Projects Horizontal Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {INITIAL_PROJECTS.map((proj) => {
          const isSelected = proj.id === activeProject?.id;
          const pTasks = tasks.filter((t) => t.project_id === proj.id);
          const doneTasks = pTasks.filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED').length;

          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`p-4 rounded-xl border text-left min-w-[240px] shrink-0 transition-all ${
                isSelected
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  {proj.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {proj.status}
                </span>
              </div>
              <h3 className="font-bold text-sm mt-2">{proj.name}</h3>
              <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {proj.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-neutral-400' : 'text-neutral-500'}>
                  {doneTasks}/{pTasks.length} Task Selesai
                </span>
                <span className="font-bold">
                  {pTasks.length > 0 ? Math.round((doneTasks / pTasks.length) * 100) : 0}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Campaigns inside active project */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-neutral-900 text-sm">
            Kampanye dalam Proyek: {activeProject?.name}
          </h3>
          <p className="text-xs text-neutral-500">
            {activeProject?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectCampaigns.map((camp) => {
            const campTasks = projectTasks.filter((t) => t.campaign_id === camp.id);

            return (
              <div
                key={camp.id}
                className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900">{camp.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">{camp.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDateOnly(camp.start_date)} - {formatDateOnly(camp.end_date)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 text-xs font-semibold text-neutral-700">
                  {campTasks.length} Pekerjaan Terkait
                </div>
              </div>
            );
          })}
        </div>

        {/* Tasks in this project */}
        <div className="pt-4 border-t border-neutral-200 space-y-3">
          <h4 className="font-bold text-neutral-900 text-xs">
            Daftar Task Proyek Ini ({projectTasks.length})
          </h4>
          <div className="space-y-2">
            {projectTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-3 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900 text-xs">
                      {task.task_id}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Assignee: {task.current_assignee_name || 'Unassigned'}
                  </span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
