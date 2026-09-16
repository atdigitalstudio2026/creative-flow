import React from 'react';
import { TaskPriority } from '../../types';
import { Flame, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const getConfig = () => {
    switch (priority) {
      case 'URGENT':
        return {
          label: 'Urgent',
          bg: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
          icon: <Flame className="w-3 h-3 text-rose-600 mr-1 animate-pulse" />
        };
      case 'HIGH':
        return {
          label: 'High',
          bg: 'bg-orange-50 text-orange-700 border-orange-200 font-medium',
          icon: <ArrowUp className="w-3 h-3 text-orange-600 mr-1" />
        };
      case 'NORMAL':
        return {
          label: 'Normal',
          bg: 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
          icon: <AlertCircle className="w-3 h-3 text-sky-600 mr-1" />
        };
      case 'LOW':
        return {
          label: 'Low',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <ArrowDown className="w-3 h-3 text-emerald-600 mr-1" />
        };
      default:
        return {
          label: priority,
          bg: 'bg-neutral-100 text-neutral-600 border-neutral-200',
          icon: null
        };
    }
  };

  const config = getConfig();

  return (
    <span
      className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-md border tracking-tight ${config.bg}`}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};
