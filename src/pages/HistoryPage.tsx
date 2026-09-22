import React, { useState, useEffect } from 'react';
import { useEcoBin } from '../context/EcoBinContext';
import { fetchHistory } from '../services/api';
import { SensorReading, WasteStatus } from '../types';
import { STATUS_CONFIG } from '../constants/config';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Calendar,
  Filter,
  Download,
  TrendingUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { selectedDeviceId, devices, setSelectedDeviceId, isDemoMode } = useEcoBin();
  const [filter, setFilter] = useState<'today' | '24h' | '7d' | '30d'>('today');
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetchHistory(selectedDeviceId, filter);
      if (res && res.readings) {
        setReadings(res.readings);
      }
    } catch (e) {
      console.warn('Failed loading history from API, generating fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    setCurrentPage(1);
  }, [selectedDeviceId, filter]);

  // Format timestamp for charts
  const chartData = readings.map((r) => {
    const d = new Date(r.timestamp);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      id: r.id,
      time: filter === '7d' || filter === '30d' ? `${dateStr} ${timeStr}` : timeStr,
      date: dateStr,
      fullTime: timeStr,
      wasteLevel: r.wasteLevel,
      distance: r.distance,
      status: r.status,
      isDemo: r.isDemo,
    };
  });

  // Pagination for table
  const totalPages = Math.ceil(chartData.length / pageSize) || 1;
  const paginatedData = [...chartData].reverse().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Time', 'Device ID', 'Waste Level (%)', 'Distance (cm)', 'Status', 'Is Demo'];
    const rows = readings.map((r) => {
      const d = new Date(r.timestamp);
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        r.deviceId,
        r.wasteLevel,
        r.distance,
        r.status,
        r.isDemo ? 'Yes' : 'No',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecobin_${selectedDeviceId}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="history-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Telemetry Analytics
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                DEMO DATA LABELED
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Historical Waste &amp; Distance Analytics
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Time-series telemetry graphs and audited sensor logging from HC-SR04 ultrasonic sensors.
          </p>
        </div>

        {/* Controls: Device & Time Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.deviceId} - {d.name}
              </option>
            ))}
          </select>

          {/* Time Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['today', '24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === t
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'today'
                  ? 'Today'
                  : t === '24h'
                  ? '24 Hours'
                  : t === '7d'
                  ? '7 Days'
                  : '30 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Chart 1: Waste Level vs Time */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Waste Level vs Time (%)</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Continuous fill-level percentage with automated threshold boundary lines
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal (≤50%)
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Medium (51-80%)
            </span>
            <span className="flex items-center gap-1 text-orange-700">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High (81-95%)
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overflow (≥96%)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wasteAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Waste Fill Level']}
              />
              <ReferenceLine y={80} stroke="#ea580c" strokeDasharray="3 3" label={{ value: 'High (80%)', fill: '#ea580c', fontSize: 10 }} />
              <ReferenceLine y={96} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Overflow (96%)', fill: '#dc2626', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="wasteLevel"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#wasteAreaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Ultrasonic Distance vs Time */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              <span>Distance from Sensor to Waste (cm)</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              HC-SR04 raw echo distance measurement (inversely proportional to fill level)
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
            Bin Height: 30 cm
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 35]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} cm`, 'Measured Distance']}
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#0284c7' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Sensor Telemetry Log Records
            </h3>
            <p className="text-xs text-slate-500">
              Showing {paginatedData.length} of {chartData.length} recorded telemetry packets
            </p>
          </div>
          <button
            onClick={loadHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Reload records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Waste Level</th>
                <th className="py-3 px-4">Distance (cm)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No sensor readings recorded for the selected time filter.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const statusConf = STATUS_CONFIG[row.status as WasteStatus] || STATUS_CONFIG.NORMAL;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.date}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{row.fullTime}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                        {row.wasteLevel}%
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {row.distance.toFixed(1)} cm
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusConf.badgeBg} ${statusConf.badgeText} border ${statusConf.border}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {row.isDemo ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            DEMO
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ESP8266 IoT
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
