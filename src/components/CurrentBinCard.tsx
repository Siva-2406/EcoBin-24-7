import React from 'react';
import { STATUS_CONFIG } from '../constants/config';
import { WasteStatus } from '../types';
import { MapPin, Clock, ArrowUpRight, Gauge, RefreshCw, Sparkles } from 'lucide-react';

interface CurrentBinCardProps {
  deviceId: string;
  name: string;
  location: string;
  wasteLevel: number;
  distanceCm: number;
  status: WasteStatus;
  lastUpdated: string;
  isDemo?: boolean;
  onRefresh?: () => void;
}

export const CurrentBinCard: React.FC<CurrentBinCardProps> = ({
  deviceId,
  name,
  location,
  wasteLevel,
  distanceCm,
  status,
  lastUpdated,
  isDemo = false,
  onRefresh,
}) => {
  const config = STATUS_CONFIG[status];
  const clampedLevel = Math.max(0, Math.min(100, wasteLevel));

  // Circular gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedLevel / 100) * circumference;

  // Format relative time
  const getRelativeTime = (iso: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 10) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      return `${Math.floor(diffSec / 3600)}h ago`;
    } catch {
      return 'Just now';
    }
  };

  return (
    <div
      id="current-bin-card"
      className="relative bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between overflow-hidden"
    >
      {/* Top Bar with Device Identity & Status */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {deviceId}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {location}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh readings"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${config.badgeBg} ${config.badgeText} border ${config.border}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Primary Circular Progress Meter */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 -rotate-90 transform">
            {/* Background Ring */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={config.accentHex}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {clampedLevel}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Current Fill
            </span>
          </div>
        </div>

        {/* Metric Readings Breakdown */}
        <div className="w-full sm:w-auto flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-6 min-w-[200px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Sensor Distance</p>
                <p className="text-lg font-black text-slate-900 font-mono">
                  {distanceCm.toFixed(1)} <span className="text-xs text-slate-500 font-sans">cm</span>
                </p>
              </div>
            </div>
            <span className="text-xs text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              HC-SR04
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-6 min-w-[200px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Last Updated</p>
                <p className="text-sm font-bold text-slate-900">
                  {getRelativeTime(lastUpdated)}
                </p>
              </div>
            </div>
            {isDemo && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Sparkles className="w-2.5 h-2.5" />
                SIMULATED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Threshold Progress Bar reference */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-semibold text-slate-700">Threshold Reference</span>
          <span>{clampedLevel}% / 100% capacity</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500" style={{ width: '50%' }} title="0-50% NORMAL" />
          <div className="h-full bg-amber-400" style={{ width: '30%' }} title="51-80% MEDIUM" />
          <div className="h-full bg-orange-500" style={{ width: '15%' }} title="81-95% HIGH" />
          <div className="h-full bg-rose-500" style={{ width: '5%' }} title="96-100% OVERFLOW" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>80%</span>
          <span>95%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
