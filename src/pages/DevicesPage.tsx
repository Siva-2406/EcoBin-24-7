import React, { useState } from 'react';
import { useEcoBin } from '../context/EcoBinContext';
import { Device, WasteStatus } from '../types';
import { STATUS_CONFIG } from '../constants/config';
import { createOrUpdateDevice } from '../services/api';
import {
  Cpu,
  MapPin,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface DevicesPageProps {
  setActiveTab: (tab: string) => void;
  onOpenSimulatorModal: () => void;
}

export const DevicesPage: React.FC<DevicesPageProps> = ({ setActiveTab, onOpenSimulatorModal }) => {
  const { devices, selectedDeviceId, setSelectedDeviceId, refreshData } = useEcoBin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Form states
  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [binHeightCm, setBinHeightCm] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAddModal = () => {
    setEditingDevice(null);
    setDeviceId(`ECOBIN-00${devices.length + 1}`);
    setName(`Campus Node ${devices.length + 1}`);
    setLocation('KIOT Campus Quad');
    setBinHeightCm(30);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dev: Device) => {
    setEditingDevice(dev);
    setDeviceId(dev.deviceId);
    setName(dev.name);
    setLocation(dev.location);
    setBinHeightCm(dev.binHeightCm);
    setIsModalOpen(true);
  };

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createOrUpdateDevice({
        deviceId,
        name,
        location,
        binHeightCm: Number(binHeightCm),
      });
      await refreshData();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error saving device: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAndInspect = (id: string) => {
    setSelectedDeviceId(id);
    setActiveTab('dashboard');
  };

  return (
    <div id="devices-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Hardware Fleet Management
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {devices.length} Monitored Units
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Configured IoT Waste Nodes
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Active ESP8266 + HC-SR04 bin nodes deployed across university &amp; municipal zones.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-colors shadow-sm shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New IoT Bin</span>
        </button>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {devices.map((device) => {
          const waste = device.currentWasteLevel ?? 0;
          const status = (device.status as WasteStatus) || 'NORMAL';
          const config = STATUS_CONFIG[status] || STATUS_CONFIG.NORMAL;
          const isSelected = device.deviceId === selectedDeviceId;

          return (
            <div
              key={device.deviceId}
              id={`device-card-${device.deviceId}`}
              className={`bg-white rounded-2xl border p-6 transition-all shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top Badge & Identifier */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {device.deviceId}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          CURRENTLY INSPECTING
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      {device.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${config.badgeBg} ${config.badgeText} border ${config.border}`}
                  >
                    {status}
                  </span>
                </div>

                {/* Location & Specs */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{device.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Container Height: {device.binHeightCm} cm</span>
                  </div>
                </div>

                {/* Waste Level Gauge Bar */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-600">Capacity Fill Level</span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {waste}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, waste))}%`,
                        backgroundColor: config.accentHex,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSelectAndInspect(device.deviceId)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenEditModal(device)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
                  title="Configure Parameters"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenSimulatorModal}
                  className="p-2 rounded-xl text-sky-600 hover:bg-sky-50 transition-colors border border-slate-200"
                  title="Test Telemetry with Simulator"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              {editingDevice ? 'Edit IoT Waste Node' : 'Register New IoT Waste Bin'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure parameters for ESP8266 telemetry synchronization.
            </p>

            <form onSubmit={handleSaveDevice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Device Hardware ID
                </label>
                <input
                  type="text"
                  required
                  value={deviceId}
                  disabled={!!editingDevice}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g. ECOBIN-005"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bin Friendly Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mechanical Lab Bin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus / Zone Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block D Ground Floor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bin Height (cm)
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="200"
                  value={binHeightCm}
                  onChange={(e) => setBinHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Measured distance from sensor face on the top lid to the empty bin bottom.
                </span>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Configuration'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
