import React from 'react';
import { STATUS_CONFIG } from '../constants/config';
import { WasteStatus } from '../types';
import { Wifi, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BinVisualizationProps {
  wasteLevel: number; // 0 - 100
  distanceCm: number;
  binHeightCm?: number;
  status: WasteStatus;
  isDemo?: boolean;
}

export const BinVisualization: React.FC<BinVisualizationProps> = ({
  wasteLevel,
  distanceCm,
  binHeightCm = 30,
  status,
  isDemo = false,
}) => {
  const config = STATUS_CONFIG[status];
  const clampedLevel = Math.max(0, Math.min(100, wasteLevel));

  // Determine SVG fill geometry
  // Bin interior height in SVG is from y = 90 (top) to y = 290 (bottom), total height = 200px
  const binTopY = 90;
  const binBottomY = 290;
  const binInnerHeight = binBottomY - binTopY;
  const fillHeight = (clampedLevel / 100) * binInnerHeight;
  const fillTopY = binBottomY - fillHeight;

  // Wave ripple color depending on status
  const getGradientColors = () => {
    switch (status) {
      case 'OVERFLOW':
        return { start: '#f43f5e', end: '#be123c', wave: '#fb7185' };
      case 'HIGH':
        return { start: '#fb923c', end: '#c2410c', wave: '#fdba74' };
      case 'MEDIUM':
        return { start: '#fbbf24', end: '#b45309', wave: '#fde68a' };
      case 'NORMAL':
      default:
        return { start: '#34d399', end: '#047857', wave: '#6ee7b7' };
    }
  };

  const colors = getGradientColors();

  return (
    <div
      id="bin-visualization-container"
      className="relative flex flex-col items-center justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Real-Time Visual Representation
          </span>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Smart Container Dynamics</span>
            {clampedLevel >= 96 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                OVERFLOW ALERT
              </span>
            )}
          </h3>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.badgeBg} ${config.badgeText} border ${config.border}`}>
          {status}
        </div>
      </div>

      {/* Modern SVG Bin Visualization */}
      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg
          viewBox="0 0 240 330"
          className="w-full h-full drop-shadow-md select-none"
        >
          <defs>
            {/* Linear gradient for waste material */}
            <linearGradient id="wasteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>

            {/* Subtle gloss overlay on the bin */}
            <linearGradient id="binGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>

            {/* Ultrasonic Wave Pulse */}
            <radialGradient id="sensorPulse" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ultrasonic Sensor Representation (Mounted on Top Lid) */}
          <g id="ultrasonic-sensor-assembly" transform="translate(120, 48)">
            {/* Mounting Bracket */}
            <rect x="-24" y="-8" width="48" height="12" rx="3" fill="#1e293b" />
            {/* HC-SR04 Dual Transducers */}
            <circle cx="-11" cy="4" r="7" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="-11" cy="4" r="4.5" fill="#0f172a" />
            <circle cx="11" cy="4" r="7" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="11" cy="4" r="4.5" fill="#0f172a" />

            {/* Sensor LED Indicator */}
            <circle cx="0" cy="-2" r="2" fill="#22c55e" className="animate-pulse" />

            {/* Label */}
            <text x="0" y="-12" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600" fontFamily="sans-serif">
              HC-SR04 SENSOR
            </text>
          </g>

          {/* Emitted Sound Waves downward toward trash surface */}
          <g id="ultrasonic-sound-waves" opacity="0.6">
            <path
              d={`M 105,62 Q 120,70 135,62`}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              className="animate-pulse"
            />
            <path
              d={`M 95,74 Q 120,84 145,74`}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              className="animate-pulse"
            />
          </g>

          {/* Bin Lid / Rim */}
          <path
            d="M 35,76 L 205,76 L 195,88 L 45,88 Z"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="2"
          />
          <rect x="75" y="68" width="90" height="8" rx="4" fill="#475569" />

          {/* Bin Container Outer Shell (Trapezoidal tapering down) */}
          <polygon
            points="45,88 195,88 180,296 60,296"
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Scale Measurement Hash Lines on left side */}
          <g opacity="0.4" stroke="#64748b" strokeWidth="1.5">
            {/* 100% full line */}
            <line x1="52" y1="92" x2="62" y2="92" />
            <text x="66" y="95" fontSize="7" fill="#64748b" fontFamily="monospace">100%</text>

            {/* 75% full line */}
            <line x1="54" y1="142" x2="64" y2="142" />
            <text x="68" y="145" fontSize="7" fill="#64748b" fontFamily="monospace">75%</text>

            {/* 50% full line */}
            <line x1="56" y1="192" x2="66" y2="192" />
            <text x="70" y="195" fontSize="7" fill="#64748b" fontFamily="monospace">50%</text>

            {/* 25% full line */}
            <line x1="58" y1="242" x2="68" y2="242" />
            <text x="72" y="245" fontSize="7" fill="#64748b" fontFamily="monospace">25%</text>
          </g>

          {/* Waste Fill Volume (Animated Height) */}
          <clipPath id="binClip">
            <polygon points="46,89 194,89 179,295 61,295" />
          </clipPath>

          <g clipPath="url(#binClip)">
            {/* Waste Fluid / Mass */}
            <rect
              x="40"
              y={fillTopY}
              width="160"
              height={fillHeight + 20}
              fill="url(#wasteGradient)"
              className="transition-all duration-700 ease-out"
            />

            {/* Animated Wavy Top Edge of the Waste */}
            {clampedLevel > 2 && (
              <path
                d={`M 40,${fillTopY} Q 80,${fillTopY - 4} 120,${fillTopY} T 200,${fillTopY} L 200,${fillTopY + 8} L 40,${fillTopY + 8} Z`}
                fill={colors.wave}
                opacity="0.8"
                className="transition-all duration-700 ease-out"
              />
            )}

            {/* Debris Texture flecks */}
            {clampedLevel >= 30 && (
              <g opacity="0.25" fill="#ffffff">
                <circle cx="90" cy={binBottomY - fillHeight * 0.3} r="3" />
                <rect x="130" y={binBottomY - fillHeight * 0.5} width="6" height="4" rx="1" />
                <circle cx="110" cy={binBottomY - fillHeight * 0.7} r="2.5" />
                <rect x="75" y={binBottomY - fillHeight * 0.2} width="5" height="5" rx="1" />
              </g>
            )}
          </g>

          {/* Front Translucent Glass Shading */}
          <polygon
            points="46,89 194,89 179,295 61,295"
            fill="url(#binGlass)"
            pointerEvents="none"
          />

          {/* Distance Dimension Indicator Overlay */}
          <g id="distance-dimension" transform="translate(186, 0)">
            <line x1="0" y1="90" x2="0" y2={fillTopY} stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="0" cy="90" r="2.5" fill="#0284c7" />
            <circle cx="0" cy={fillTopY} r="2.5" fill="#0284c7" />
            <rect x="5" y={Math.max(100, (90 + fillTopY) / 2 - 10)} width="44" height="18" rx="4" fill="#0f172a" />
            <text
              x="27"
              y={Math.max(100, (90 + fillTopY) / 2 + 3)}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {distanceCm.toFixed(1)}cm
            </text>
          </g>

          {/* Bin Foot Pedals / Base */}
          <rect x="90" y="296" width="60" height="8" rx="2" fill="#334155" />
          <circle cx="68" cy="298" r="6" fill="#1e293b" />
          <circle cx="172" cy="298" r="6" fill="#1e293b" />
        </svg>
      </div>

      {/* Bottom Quantitative Readout */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex flex-col">
          <span className="text-slate-400 font-medium">Waste Level</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {clampedLevel}%
          </span>
        </div>

        <div className="flex flex-col text-center">
          <span className="text-slate-400 font-medium">Headroom Distance</span>
          <span className="text-sm font-bold text-slate-700 font-mono">
            {distanceCm.toFixed(1)} cm
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-slate-400 font-medium">Status</span>
          <span className={`text-sm font-extrabold ${config.text}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
