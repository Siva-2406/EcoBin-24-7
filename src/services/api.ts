import { Device, SensorReading, Alert, FeedbackSubmission, AdminStats } from '../types';

const API_BASE = '/api';

export async function fetchCurrentData(deviceId: string) {
  const res = await fetch(`${API_BASE}/current-data/${encodeURIComponent(deviceId)}`);
  if (!res.ok) {
    throw new Error(`Failed to load data for device ${deviceId} (${res.status})`);
  }
  return res.json() as Promise<{
    success: boolean;
    deviceId: string;
    device: Device;
    currentReading: SensorReading | null;
    wasteLevel: number;
    distance: number;
    status: string;
    priority: { priority: string; reason: string };
    lastUpdated: string;
  }>;
}

export async function fetchHistory(deviceId: string, filter: 'today' | '24h' | '7d' | '30d' | 'all' = 'today') {
  const res = await fetch(`${API_BASE}/history/${encodeURIComponent(deviceId)}?filter=${filter}`);
  if (!res.ok) {
    throw new Error(`Failed to load history for ${deviceId}`);
  }
  return res.json() as Promise<{
    success: boolean;
    deviceId: string;
    filter: string;
    count: number;
    readings: SensorReading[];
  }>;
}

export async function fetchDeviceStatus(deviceId: string) {
  const res = await fetch(`${API_BASE}/device-status/${encodeURIComponent(deviceId)}`);
  if (!res.ok) {
    throw new Error(`Failed to load status for ${deviceId}`);
  }
  return res.json() as Promise<{
    success: boolean;
    deviceId: string;
    deviceStatus: 'online' | 'offline' | 'warning';
    sensorStatus: 'connected' | 'disconnected' | 'error';
    wifiStatus: 'connected' | 'disconnected';
    backendStatus: 'online' | 'offline';
    databaseStatus: 'connected' | 'offline';
    lastSeen: string;
    minutesSinceLastSeen: number;
  }>;
}

export async function fetchAlerts(deviceId?: string) {
  const url = deviceId ? `${API_BASE}/alerts/${encodeURIComponent(deviceId)}` : `${API_BASE}/alerts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load alerts');
  return res.json() as Promise<{
    success: boolean;
    count: number;
    alerts: Alert[];
  }>;
}

export async function markAlertAsRead(alertId: string) {
  const res = await fetch(`${API_BASE}/alerts/${encodeURIComponent(alertId)}/read`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to update alert');
  return res.json();
}

export async function clearAlert(alertId: string) {
  const res = await fetch(`${API_BASE}/alerts/${encodeURIComponent(alertId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete alert');
  return res.json();
}

export async function fetchDevices() {
  const res = await fetch(`${API_BASE}/devices`);
  if (!res.ok) throw new Error('Failed to load devices');
  return res.json() as Promise<{
    success: boolean;
    count: number;
    devices: Device[];
  }>;
}

export async function createOrUpdateDevice(deviceData: {
  deviceId: string;
  name: string;
  location: string;
  binHeightCm?: number;
}) {
  const res = await fetch(`${API_BASE}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deviceData),
  });
  if (!res.ok) throw new Error('Failed to save device');
  return res.json() as Promise<{ success: boolean; device: Device }>;
}

export async function submitFeedback(data: {
  name: string;
  email: string;
  rating: number;
  feedback: string;
  suggestions?: string;
}) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit feedback');
  }
  return res.json() as Promise<{ success: boolean; message: string; feedback: FeedbackSubmission }>;
}

export async function fetchFeedback() {
  const res = await fetch(`${API_BASE}/feedback`);
  if (!res.ok) throw new Error('Failed to load feedback');
  return res.json() as Promise<{
    success: boolean;
    count: number;
    feedback: FeedbackSubmission[];
  }>;
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to load admin stats');
  return res.json() as Promise<{
    success: boolean;
    stats: AdminStats;
  }>;
}

export async function sendSensorData(payload: {
  deviceId: string;
  distance?: number;
  wasteLevel?: number;
  status?: string;
  timestamp?: string;
  isDemo?: boolean;
}) {
  const res = await fetch(`${API_BASE}/sensor-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send sensor data');
  }
  return res.json();
}
