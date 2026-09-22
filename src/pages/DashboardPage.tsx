import React from 'react';
import { useEcoBin } from '../context/EcoBinContext';
import { CurrentBinCard } from '../components/CurrentBinCard';
import { BinVisualization } from '../components/BinVisualization';
import { SensorStatusCards } from '../components/SensorStatusCards';
import { CollectionPriorityCard } from '../components/CollectionPriorityCard';
import {
  Sparkles,
  Radio,
  Brain,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onOpenPinoutModal: () => void;
  onOpenSimulatorModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onOpenPinoutModal,
  onOpenSimulatorModal,
}) => {
  const {
    isDemoMode,
    toggleMode,
    selectedDeviceId,
    setSelectedDeviceId,
    devices,
    selectedDevice,
    wasteLevel,
    distanceCm,
    wasteStatus,
    collectionPriority,
    deviceHealth,
    refreshData,
    unreadAlertCount,
  } = useEcoBin();

  const currentDev = selectedDevice || {
    deviceId: selectedDeviceId,
    name: 'EcoBin Main Unit',
    location: 'KIOT Campus',
    binHeightCm: 30,
    lastSeen: new Date().toISOString(),
  };

  return (
    <div id="dashboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner & Device Selector Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Monitoring 24×7
              </span>

              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  DEMO SIMULATION ACTIVE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  LIVE HARDWARE IoT MODE
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Smart Waste Monitoring Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Monitor waste levels, detect overflow conditions and support smarter waste collection across campus nodes in real time.
            </p>
          </div>

          {/* Quick Device Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Select Bin:</span>
            </div>
            <select
              id="bin-selector-dropdown"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId} - {d.name} ({d.currentWasteLevel ?? '--'}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demo Notice Banner */}
        {isDemoMode && (
          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> Generating realistic gradual fill telemetry to preview full functionality without physical hardware connected.
              </span>
            </div>
            <button
              onClick={toggleMode}
              className="text-xs font-bold text-amber-800 underline hover:text-amber-950 shrink-0 self-start sm:self-auto"
            >
              Switch to Live IoT Mode →
            </button>
          </div>
        )}
      </div>

      {/* Main Core Telemetry Grid: Current Bin Card + Visual Fill Bin */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quantitative Metrics */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <CurrentBinCard
            deviceId={currentDev.deviceId}
            name={currentDev.name}
            location={currentDev.location}
            wasteLevel={wasteLevel}
            distanceCm={distanceCm}
            status={wasteStatus}
            lastUpdated={currentDev.lastSeen}
            isDemo={isDemoMode}
            onRefresh={refreshData}
          />

          <CollectionPriorityCard
            priority={collectionPriority.priority}
            label={collectionPriority.label}
            badgeClass={collectionPriority.badgeClass}
            reason={collectionPriority.reason}
            timeWindow={collectionPriority.timeWindow}
            wasteLevel={wasteLevel}
          />
        </div>

        {/* Right Column: Physical Bin SVG Visualization */}
        <div className="lg:col-span-5 flex flex-col">
          <BinVisualization
            wasteLevel={wasteLevel}
            distanceCm={distanceCm}
            binHeightCm={currentDev.binHeightCm}
            status={wasteStatus}
            isDemo={isDemoMode}
          />
        </div>
      </div>

      {/* Sensor & Hardware Health Telemetry Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              IoT Sensor &amp; Gateway Health
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Hardware communication link states for NodeMCU ESP8266 and HC-SR04
            </p>
          </div>
          <button
            onClick={onOpenPinoutModal}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Circuit Schematic</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <SensorStatusCards
          deviceStatus={deviceHealth.deviceStatus}
          sensorStatus={deviceHealth.sensorStatus}
          wifiStatus={deviceHealth.wifiStatus}
          backendStatus={deviceHealth.backendStatus}
          databaseStatus={deviceHealth.databaseStatus}
          lastSeen={deviceHealth.lastSeen}
        />
      </div>

      {/* Quick Access Action Bar for Testing & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('history')}
          className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historical Trends</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            View Analytics &amp; Fill Rate Graphs
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Recharts analytics comparing waste level vs time and ultrasonic distance.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('alerts')}
          className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Center</span>
            <AlertTriangle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Active Overflow &amp; Capacity Warnings
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {unreadAlertCount > 0 ? (
              <span className="text-rose-600 font-semibold">{unreadAlertCount} unread system alerts pending</span>
            ) : (
              'All bins operating within acceptable parameters.'
            )}
          </p>
        </div>

        <div
          onClick={onOpenSimulatorModal}
          className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hardware Testing</span>
            <Radio className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Interactive IoT Telemetry Simulator
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Inject mock distance packets into POST /api/sensor-data for live demo.
          </p>
        </div>
      </div>

      {/* Section 34: Future AI Features Placeholder Card */}
      <div
        id="ai-insights-coming-soon"
        className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-7 shadow-md"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Brain className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
            Future Roadmap
          </span>
        </div>

        <h3 className="text-xl font-extrabold tracking-tight">
          AI Insights — Coming Soon
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          The EcoBin 24×7 architecture is structured for subsequent edge machine-learning and cloud AI integrations.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {[
            'Waste Fill Rate Prediction',
            'Time-to-Overflow Forecast',
            'Peak Waste-Hour Analytics',
            'Dynamic Route Optimizer',
            'Autonomous Sanitation Priority',
            'Ultrasonic Anomaly Detection',
            'Sensor Drift / Failure Alert',
            'AI EcoBot Natural Language Assistant',
          ].map((feature, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
