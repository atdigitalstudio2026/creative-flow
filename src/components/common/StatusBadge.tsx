import React from 'react';
import { TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (st: TaskStatus) => {
    switch (st) {
      case 'REQUESTED':
        return { label: 'Requested', bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400' };
      case 'ASSIGNED':
        return { label: 'Assigned', bg: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold', dot: 'bg-sky-500' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold', dot: 'bg-indigo-600 animate-pulse' };
      case 'SUBMITTED':
        return { label: 'Submitted', bg: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold', dot: 'bg-amber-500' };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold', dot: 'bg-amber-600 animate-ping' };
      case 'REVISION_REQUIRED':
        return { label: 'Revisi Diperlukan', bg: 'bg-rose-100/90 text-rose-800 border-rose-300 font-extrabold shadow-2xs', dot: 'bg-rose-600 animate-bounce' };
      case 'RESUBMITTED':
        return { label: 'Resubmitted', bg: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold', dot: 'bg-purple-600' };
      case 'APPROVED':
        return { label: 'Approved Final', bg: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 font-bold', dot: 'bg-emerald-600' };
      case 'COMPLETED':
        return { label: 'Completed', bg: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold', dot: 'bg-teal-600' };
      case 'ON_HOLD':
        return { label: 'On Hold', bg: 'bg-stone-100 text-stone-700 border-stone-300', dot: 'bg-stone-400' };
      case 'CANCELLED':
        return { label: 'Cancelled', bg: 'bg-neutral-100 text-neutral-500 border-neutral-300 line-through', dot: 'bg-neutral-400' };
      case 'ARCHIVED':
        return { label: 'Archived', bg: 'bg-neutral-100 text-neutral-600 border-neutral-300', dot: 'bg-neutral-400' };
      default:
        return { label: st, bg: 'bg-neutral-100 text-neutral-700 border-neutral-200', dot: 'bg-neutral-400' };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : size === 'lg' ? 'text-xs px-3.5 py-1' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap tracking-tight ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};
