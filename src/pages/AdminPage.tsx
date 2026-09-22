import React, { useState, useEffect } from 'react';
import { fetchAdminStats } from '../services/api';
import { AdminStats, SystemLog, SensorFailureLog } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Server,
  AlertTriangle,
  Cpu,
  Trash2,
  TrendingUp,
  Download,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AdminPageProps {
  setActiveTab: (tab: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ setActiveTab }) => {
  const { user, isAdmin, setUserRole } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then((res) => {
        if (res && res.stats) setStats(res.stats);
      })
      .catch((e) => console.warn(e))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">
          Admin Access Required
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          This section contains municipal telemetry controls, fleet stats, and server diagnostic logs reserved for project administrators.
        </p>
        <button
          onClick={() => setUserRole('admin')}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          Elevate Current Session to Admin
        </button>
      </div>
    );
  }

  const exportAllData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ecobin_admin_diagnostics_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const totalBinsCount = stats?.totalBins ?? stats?.totalDevices ?? 4;
  const totalAlertsCount = stats?.totalAlerts ?? stats?.unreadAlerts ?? 0;
  const avgLevel = stats?.averageWasteLevel ?? 60;
  const highPriorityCount = stats?.highPriorityBins ?? ((stats?.criticalBins ?? 0) + (stats?.overflowBins ?? 0));
  const offlineNodes = stats?.offlineDevices ?? 0;

  return (
    <div id="admin-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Administrative Control Console
            </span>
            <span className="text-xs font-mono text-slate-400">
              Authenticated: {user?.email}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Fleet Metrics &amp; Diagnostic Logs
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Campus-wide aggregation, server health, sensor failure logs, and raw telemetry export.
          </p>
        </div>

        <button
          onClick={exportAllData}
          className="py-2 px-3.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Diagnostic Bundle</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Bins</span>
            <Trash2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalBinsCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Configured ESP8266 nodes</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalAlertsCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Recorded incidents</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Average Fill</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {avgLevel}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across all campus containers</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">High Priority Bins</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {highPriorityCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Fill level &gt; 80%</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase">Offline Nodes</span>
            <Cpu className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {offlineNodes}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">Fleet Telemetry Active</p>
        </div>
      </div>

      {/* System Diagnostic Logs & Sensor Failure Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Logs */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>/var/log/ecobin/system.log</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Live Stream
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono overflow-y-auto max-h-64 divide-y divide-slate-800/60">
            {stats?.systemLogs && stats.systemLogs.length > 0 ? (
              stats.systemLogs.map((log: SystemLog, idx: number) => (
                <div key={idx} className="pt-2 flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span
                    className={`px-1 rounded text-[10px] uppercase font-bold shrink-0 ${
                      log.level === 'error'
                        ? 'bg-rose-950 text-rose-400'
                        : log.level === 'warn'
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-emerald-950 text-emerald-400'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-4 text-center">
                System telemetry stream active. No critical faults logged.
              </div>
            )}
          </div>
        </div>

        {/* Sensor Failure & Anomaly Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Sensor Failure &amp; Anomaly Detection</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              HC-SR04 Quality Check
            </span>
          </div>

          <div className="space-y-3">
            {stats?.sensorFailureLogs && stats.sensorFailureLogs.length > 0 ? (
              stats.sensorFailureLogs.map((fail: SensorFailureLog, i: number) => (
                <div
                  key={i}
                  className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between font-bold text-amber-900">
                    <span>Node: {fail.deviceId}</span>
                    <span className="font-mono text-[10px] text-amber-700">
                      {new Date(fail.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-amber-800">{fail.issue}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  No Hardware Failures Detected
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  All HC-SR04 pulse-echo response intervals within standard 2-400cm timing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
