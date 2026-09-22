import React, { useState } from 'react';
import { X, Send, Sliders, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { sendSensorData } from '../services/api';
import { useEcoBin } from '../context/EcoBinContext';
import { getWasteStatus } from '../constants/config';

interface DeviceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSimulatorModal: React.FC<DeviceSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { devices, selectedDeviceId, refreshData } = useEcoBin();
  const [deviceId, setDeviceId] = useState(selectedDeviceId);
  const [wasteLevel, setWasteLevel] = useState<number>(75);
  const [distance, setDistance] = useState<number>(7.5);
  const [isSending, setIsSending] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDevice = devices.find((d) => d.deviceId === deviceId) || devices[0];
  const binHeight = currentDevice?.binHeightCm || 30;

  const handleWasteSlider = (val: number) => {
    setWasteLevel(val);
    const d = Number((binHeight * (1 - val / 100)).toFixed(1));
    setDistance(Math.max(0.5, d));
  };

  const handleDistanceSlider = (val: number) => {
    setDistance(val);
    const w = Math.round(Math.max(0, Math.min(100, ((binHeight - val) / binHeight) * 100)));
    setWasteLevel(w);
  };

  const status = getWasteStatus(wasteLevel);

  const handleSendTelemetry = async () => {
    setIsSending(true);
    setResponseLog(null);
    try {
      const payload = {
        deviceId,
        distance,
        wasteLevel,
        status,
        timestamp: new Date().toISOString(),
        isDemo: false,
      };

      const res = await sendSensorData(payload);
      setResponseLog(JSON.stringify(res, null, 2));
      await refreshData();
    } catch (err: any) {
      setResponseLog(`Error sending telemetry: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="device-simulator-modal"
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              ESP8266 Telemetry Packet Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Test live ingestion on <code className="font-mono text-sky-700">POST /api/sensor-data</code>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Target Bin selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target IoT Bin / Device ID
            </label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceId} - {d.name} ({d.location})
                </option>
              ))}
            </select>
          </div>

          {/* Waste Level Slider */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Simulated Waste Fill Level
              </label>
              <span className="text-base font-black text-slate-900 font-mono">
                {wasteLevel}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={wasteLevel}
              onChange={(e) => handleWasteSlider(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% Empty</span>
              <span>50%</span>
              <span>80%</span>
              <span className="text-rose-600 font-bold">100% Overflow</span>
            </div>
          </div>

          {/* Calculated Distance Reading */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                HC-SR04 Measured Distance
              </label>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {distance.toFixed(1)} cm
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max={binHeight}
              step="0.5"
              value={distance}
              onChange={(e) => handleDistanceSlider(Number(e.target.value))}
              className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Formula: Distance decreases as trash accumulates towards sensor at top lid.
            </span>
          </div>

          {/* Status pill preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 text-xs">
            <span className="font-semibold text-slate-600">Computed Backend Status:</span>
            <span className="font-black text-slate-900 uppercase tracking-wider">
              {status}
            </span>
          </div>

          {/* Send packet button */}
          <button
            onClick={handleSendTelemetry}
            disabled={isSending}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Transmitting Packet...' : 'Transmit Test Packet to REST API'}</span>
          </button>

          {/* Server Response Display */}
          {responseLog && (
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
              <div className="text-[10px] text-slate-400 uppercase font-sans mb-1 font-bold">
                API Response:
              </div>
              <pre>{responseLog}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
