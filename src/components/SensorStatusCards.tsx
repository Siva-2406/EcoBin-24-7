import React from 'react';
import {
  Radio,
  Cpu,
  Wifi,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface SensorStatusCardsProps {
  deviceStatus: 'online' | 'offline' | 'warning';
  sensorStatus: 'connected' | 'disconnected' | 'error';
  wifiStatus: 'connected' | 'disconnected';
  backendStatus: 'online' | 'offline';
  databaseStatus: 'connected' | 'offline';
  lastSeen: string;
}

export const SensorStatusCards: React.FC<SensorStatusCardsProps> = ({
  deviceStatus,
  sensorStatus,
  wifiStatus,
  backendStatus,
  databaseStatus,
  lastSeen,
}) => {
  const getRelativeTime = (iso: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSec < 10) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      return `${Math.floor(diffSec / 3600)}h ago`;
    } catch {
      return 'Active';
    }
  };

  const cards = [
    {
      id: 'sensor',
      name: 'HC-SR04 Ultrasonic Sensor',
      sub: 'Trig D6 • Echo D5',
      icon: Radio,
      status: sensorStatus === 'connected' ? 'Connected' : 'Disconnected',
      isOk: sensorStatus === 'connected',
      time: getRelativeTime(lastSeen),
    },
    {
      id: 'mcu',
      name: 'ESP8266 NodeMCU',
      sub: 'NodeMCU v3 (ESP-12E)',
      icon: Cpu,
      status: deviceStatus === 'online' ? 'Online' : 'Offline',
      isOk: deviceStatus === 'online',
      time: getRelativeTime(lastSeen),
    },
    {
      id: 'wifi',
      name: 'Wi-Fi Connection',
      sub: '2.4 GHz 802.11 b/g/n',
      icon: Wifi,
      status: wifiStatus === 'connected' ? 'Connected' : 'Disconnected',
      isOk: wifiStatus === 'connected',
      time: getRelativeTime(lastSeen),
    },
    {
      id: 'backend',
      name: 'Backend API Gateway',
      sub: 'Express REST API',
      icon: Server,
      status: backendStatus === 'online' ? 'Online' : 'Offline',
      isOk: backendStatus === 'online',
      time: 'Live (0ms latency)',
    },
    {
      id: 'database',
      name: 'Database (Firestore)',
      sub: 'Cloud Storage & State',
      icon: Database,
      status: databaseStatus === 'connected' ? 'Connected' : 'Offline',
      isOk: databaseStatus === 'connected',
      time: 'Synchronized',
    },
  ];

  return (
    <div id="sensor-status-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={`status-card-${card.id}`}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  card.isOk ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    card.isOk ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span
                  className={`text-[11px] font-bold ${
                    card.isOk ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {card.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-snug">
                {card.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Updated</span>
              <span className="font-semibold text-slate-600">{card.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
