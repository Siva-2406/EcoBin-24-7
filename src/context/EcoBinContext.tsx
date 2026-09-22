import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Device, SensorReading, Alert, WasteStatus, CollectionPriority } from '../types';
import {
  fetchCurrentData,
  fetchDevices,
  fetchAlerts,
  markAlertAsRead,
  clearAlert,
  fetchDeviceStatus,
} from '../services/api';
import { getWasteStatus, getCollectionPriority, DEFAULT_BIN_HEIGHT_CM } from '../constants/config';

interface EcoBinContextType {
  isDemoMode: boolean;
  toggleMode: () => void;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  devices: Device[];
  selectedDevice: Device | null;
  currentReading: SensorReading | null;
  wasteLevel: number;
  distanceCm: number;
  wasteStatus: WasteStatus;
  collectionPriority: {
    priority: CollectionPriority;
    label: string;
    badgeClass: string;
    reason: string;
    timeWindow: string;
  };
  deviceHealth: {
    deviceStatus: 'online' | 'offline' | 'warning';
    sensorStatus: 'connected' | 'disconnected' | 'error';
    wifiStatus: 'connected' | 'disconnected';
    backendStatus: 'online' | 'offline';
    databaseStatus: 'connected' | 'offline';
    lastSeen: string;
  };
  alerts: Alert[];
  unreadAlertCount: number;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
}

const EcoBinContext = createContext<EcoBinContextType | undefined>(undefined);

export const EcoBinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // Default to demo mode for initial instant working experience
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('ECOBIN-001');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Live state values
  const [liveWasteLevel, setLiveWasteLevel] = useState<number>(68);
  const [liveDistance, setLiveDistance] = useState<number>(18.5);

  // Demo simulation state (smooth realistic updates)
  const [demoWasteLevel, setDemoWasteLevel] = useState<number>(68);
  const [demoDistance, setDemoDistance] = useState<number>(18.5);
  const demoDirectionRef = useRef<number>(1); // 1 = filling up, -1 = emptying

  const [deviceHealth, setDeviceHealth] = useState({
    deviceStatus: 'online' as 'online' | 'offline' | 'warning',
    sensorStatus: 'connected' as 'connected' | 'disconnected' | 'error',
    wifiStatus: 'connected' as 'connected' | 'disconnected',
    backendStatus: 'online' as 'online' | 'offline',
    databaseStatus: 'connected' as 'offline' | 'connected',
    lastSeen: new Date().toISOString(),
  });

  // Load devices and alerts
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [devRes, alertRes] = await Promise.all([
        fetchDevices().catch(() => ({ devices: [] })),
        fetchAlerts().catch(() => ({ alerts: [] })),
      ]);

      if (devRes.devices && devRes.devices.length > 0) {
        setDevices(devRes.devices);
        const current = devRes.devices.find((d) => d.deviceId === selectedDeviceId) || devRes.devices[0];
        setSelectedDevice(current);
        if (current.currentWasteLevel !== undefined) {
          setLiveWasteLevel(current.currentWasteLevel);
        }
        if (current.currentDistance !== undefined) {
          setLiveDistance(current.currentDistance);
        }
      }

      if (alertRes.alerts) {
        setAlerts(alertRes.alerts);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Initial data load warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDeviceId]);

  // Load current device telemetries
  const refreshData = useCallback(async () => {
    try {
      const [currData, statusData, alertData] = await Promise.all([
        fetchCurrentData(selectedDeviceId).catch(() => null),
        fetchDeviceStatus(selectedDeviceId).catch(() => null),
        fetchAlerts(selectedDeviceId).catch(() => null),
      ]);

      if (currData && currData.success) {
        setSelectedDevice(currData.device);
        setCurrentReading(currData.currentReading);
        setLiveWasteLevel(currData.wasteLevel);
        setLiveDistance(currData.distance);
      }

      if (statusData && statusData.success) {
        setDeviceHealth({
          deviceStatus: statusData.deviceStatus,
          sensorStatus: statusData.sensorStatus,
          wifiStatus: statusData.wifiStatus,
          backendStatus: statusData.backendStatus,
          databaseStatus: statusData.databaseStatus,
          lastSeen: statusData.lastSeen,
        });
      }

      if (alertData && alertData.alerts) {
        setAlerts(alertData.alerts);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Failed refreshing telemetry:', err);
    }
  }, [selectedDeviceId]);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Periodic polling for Live Mode (every 5 seconds)
  useEffect(() => {
    if (isDemoMode) return;
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [isDemoMode, refreshData]);

  // Smooth realistic updates for Demo Mode
  useEffect(() => {
    if (!isDemoMode) return;

    const timer = setInterval(() => {
      setDemoWasteLevel((prev) => {
        let next = prev;
        const binHeight = selectedDevice?.binHeightCm || DEFAULT_BIN_HEIGHT_CM;

        // Realistic progression: climbs by 1-3% every 4-5 seconds
        if (demoDirectionRef.current === 1) {
          next = prev + Math.floor(Math.random() * 2 + 1);
          if (next >= 98) {
            // Reached critical overflow, hold for a moment then simulate bin emptied
            demoDirectionRef.current = -1;
          }
        } else {
          // Bin emptied by sanitation team, drops back down to 10-15%
          next = Math.max(12, prev - 18);
          if (next <= 15) {
            demoDirectionRef.current = 1;
          }
        }

        // Calculate corresponding distance cm
        const calculatedDist = Number((binHeight * (1 - next / 100)).toFixed(1));
        setDemoDistance(Math.max(0.5, calculatedDist));

        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isDemoMode, selectedDevice]);

  const toggleMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const markAlertRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'read' as const } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const dismissAlert = async (id: string) => {
    try {
      await clearAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const wasteLevel = isDemoMode ? demoWasteLevel : liveWasteLevel;
  const distanceCm = isDemoMode ? demoDistance : liveDistance;
  const wasteStatus = getWasteStatus(wasteLevel);
  const collectionPriority = getCollectionPriority(wasteLevel);
  const unreadAlertCount = alerts.filter((a) => a.status === 'unread').length;

  return (
    <EcoBinContext.Provider
      value={{
        isDemoMode,
        toggleMode,
        selectedDeviceId,
        setSelectedDeviceId,
        devices,
        selectedDevice,
        currentReading,
        wasteLevel,
        distanceCm,
        wasteStatus,
        collectionPriority,
        deviceHealth,
        alerts,
        unreadAlertCount,
        isLoading,
        error,
        refreshData,
        markAlertRead,
        dismissAlert,
      }}
    >
      {children}
    </EcoBinContext.Provider>
  );
};

export const useEcoBin = () => {
  const context = useContext(EcoBinContext);
  if (!context) {
    throw new Error('useEcoBin must be used within an EcoBinProvider');
  }
  return context;
};
