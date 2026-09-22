import React from 'react';
import { CollectionPriority } from '../types';
import { Truck, AlertOctagon, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface CollectionPriorityCardProps {
  priority: CollectionPriority;
  label: string;
  badgeClass: string;
  reason: string;
  timeWindow: string;
  wasteLevel: number;
}

export const CollectionPriorityCard: React.FC<CollectionPriorityCardProps> = ({
  priority,
  label,
  badgeClass,
  reason,
  timeWindow,
  wasteLevel,
}) => {
  const getPriorityTheme = () => {
    switch (priority) {
      case 'URGENT':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          badge: 'bg-rose-600 text-white',
          text: 'text-rose-900',
          accent: 'text-rose-600',
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-500 text-white',
          text: 'text-orange-900',
          accent: 'text-orange-600',
        };
      case 'MEDIUM':
        return {
          icon: Clock,
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-900',
          accent: 'text-amber-600',
        };
      case 'LOW':
      default:
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-900',
          accent: 'text-emerald-600',
        };
    }
  };

  const theme = getPriorityTheme();
  const Icon = theme.icon;

  return (
    <div
      id="collection-priority-card"
      className={`rounded-2xl border ${theme.border} ${theme.bg} p-6 shadow-xs flex flex-col justify-between transition-all`}
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl ${theme.badge} flex items-center justify-center shadow-xs`}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Logistics Dispatch Engine
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Collection Priority
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${theme.badge} shadow-xs animate-pulse`}
          >
            {priority}
          </span>
        </div>

        <div className="mt-3 p-3.5 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/60">
          <div className="flex items-start gap-2.5">
            <Icon className={`w-4 h-4 ${theme.accent} shrink-0 mt-0.5`} />
            <div>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                {reason}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Target Pickup:</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {timeWindow}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
        <span>Capacity Fill: <strong className="text-slate-800">{wasteLevel}%</strong></span>
        <span className="text-[11px] font-medium text-slate-500">
          Algorithm: Dynamic Threshold Routing
        </span>
      </div>
    </div>
  );
};
