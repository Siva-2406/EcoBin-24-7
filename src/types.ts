export type WasteStatus = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'OVERFLOW';
export type DeviceStatus = 'online' | 'offline' | 'warning';
export type CollectionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type AlertType = 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'OVERFLOW' | 'DEVICE OFFLINE' | 'SENSOR ERROR';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Device {
  deviceId: string;
  name: string;
  location: string;
  status: DeviceStatus;
  binHeightCm: number;
  lastSeen: string;
  createdAt: string;
  currentWasteLevel?: number;
  currentDistance?: number;
  currentStatus?: WasteStatus;
  sensorStatus?: 'connected' | 'disconnected' | 'error';
}

export interface SensorReading {
  id: string;
  deviceId: string;
  distance: number;
  wasteLevel: number;
  status: WasteStatus;
  timestamp: string;
  isDemo?: boolean;
}

export interface Alert {
  id: string;
  deviceId: string;
  type: AlertType;
  title?: string;
  severity?: AlertSeverity;
  message: string;
  wasteLevel?: number;
  timestamp: string;
  status: 'unread' | 'read' | 'resolved';
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  rating: number;
  feedback: string;
  suggestions?: string;
  createdAt: string;
}

export interface SystemLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface SensorFailureLog {
  deviceId: string;
  timestamp: string;
  issue: string;
}

export interface AdminStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  criticalBins: number;
  overflowBins: number;
  totalReadings: number;
  unreadAlerts: number;
  totalBins?: number;
  totalAlerts?: number;
  averageWasteLevel?: number;
  highPriorityBins?: number;
  systemLogs?: SystemLog[];
  sensorFailureLogs?: SensorFailureLog[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'operator' | 'viewer';
  avatarUrl?: string;
}
