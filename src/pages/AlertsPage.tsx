import React, { useState } from 'react';
import { useEcoBin } from '../context/EcoBinContext';
import { Alert, AlertSeverity } from '../types';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  Check,
  Trash2,
  Volume2,
  ShieldAlert,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, unreadAlertCount, markAlertRead, dismissAlert } = useEcoBin();
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'critical' | 'warning'>('all');

  const resolveSeverity = (a: Alert): AlertSeverity => {
    if (a.severity) return a.severity;
    if (a.type === 'OVERFLOW' || a.type === 'CRITICAL') return 'critical';
    if (a.type === 'HIGH' || a.type === 'DEVICE OFFLINE' || a.type === 'SENSOR ERROR') return 'warning';
    return 'info';
  };

  const resolveTitle = (a: Alert): string => {
    if (a.title) return a.title;
    if (a.type === 'OVERFLOW') return 'Overflow Limit Reached';
    if (a.type === 'CRITICAL') return 'Critical Capacity Reached';
    if (a.type === 'HIGH') return 'High Fill Level Warning';
    if (a.type === 'DEVICE OFFLINE') return 'Node Device Offline';
    return `${a.type} Notice`;
  };

  const filteredAlerts = alerts.filter((a) => {
    const sev = resolveSeverity(a);
    if (filterType === 'unread') return a.status === 'unread';
    if (filterType === 'critical') return sev === 'critical';
    if (filterType === 'warning') return sev === 'warning';
    return true;
  });

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertOctagon,
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          accent: 'text-rose-600',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          accent: 'text-orange-600',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          accent: 'text-sky-600',
        };
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div id="alerts-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Real-Time Incident Response
            </span>
            {unreadAlertCount > 0 && (
              <span className="text-xs font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                {unreadAlertCount} Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Active Overflow &amp; Hardware Alerts
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Immediate triggers when containers reach critical fill limits, sensors fail, or connectivity drops.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          {(['all', 'unread', 'critical', 'warning'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterType === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all'
                ? `All (${alerts.length})`
                : tab === 'unread'
                ? `Unread (${unreadAlertCount})`
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Hardware Buzzer Alert Box for Overflow */}
      {alerts.some((a) => (a.severity === 'critical' || a.type === 'OVERFLOW') && a.status === 'unread') && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                CRITICAL OVERFLOW ALARM ACTIVE
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                Hardware buzzer on NodeMCU Pin D0 is triggered. Municipal collection crew has been alerted.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-white text-rose-800 px-3 py-1.5 rounded-xl self-start sm:self-auto uppercase tracking-wider">
            Urgent Dispatch
          </span>
        </div>
      )}

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Alerts In This Category
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All monitored IoT waste containers are currently functioning normally.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const severity = resolveSeverity(alert);
            const style = getSeverityStyle(severity);
            const title = resolveTitle(alert);
            const Icon = style.icon;
            const isUnread = alert.status === 'unread';

            return (
              <div
                key={alert.id}
                id={`alert-item-${alert.id}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white ${
                  isUnread
                    ? 'border-slate-300 shadow-sm ring-1 ring-slate-200'
                    : 'border-slate-200/70 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0 mt-0.5 border ${style.border}`}>
                    <Icon className={`w-5 h-5 ${style.accent}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                        {severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                        {alert.deviceId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatTime(alert.timestamp)}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {isUnread && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
