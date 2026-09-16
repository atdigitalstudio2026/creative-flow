import React from 'react';
import { TaskStatus } from '../../types';
import { getDeadlineUrgency, formatDateIndo } from '../../utils/dateUtils';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DeadlineBadgeProps {
  deadline: string;
  status: TaskStatus;
  showExact?: boolean;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline, status, showExact = false }) => {
  const urgency = getDeadlineUrgency(deadline, status);

  return (
    <div className="inline-flex items-center gap-1.5" title={`Deadline: ${formatDateIndo(deadline)}`}>
      <span
        className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-lg border font-medium tracking-tight transition-all ${urgency.badgeClass} ${
          urgency.isOverdue ? 'animate-pulse ring-1 ring-rose-500/30' : ''
        }`}
      >
        {urgency.isOverdue ? (
          <AlertTriangle className="w-3 h-3 mr-1 text-rose-600 dark:text-rose-400 shrink-0" />
        ) : urgency.isDueToday ? (
          <Clock className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400 shrink-0" />
        ) : status === 'APPROVED' || status === 'COMPLETED' ? (
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <Clock className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
        )}
        {urgency.label}
      </span>
      {showExact && (
        <span className="text-xs text-neutral-500 font-mono">
          {formatDateIndo(deadline)}
        </span>
      )}
    </div>
  );
};
