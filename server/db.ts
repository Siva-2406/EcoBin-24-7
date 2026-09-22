import { Device, SensorReading, Alert, FeedbackSubmission, AdminStats } from './types.js';
import { calculateWasteStatus, calculateWasteLevelFromDistance, DEFAULT_BIN_HEIGHT_CM } from './thresholds.js';

class InMemoryEcoBinDatabase {
  private devices: Map<string, Device> = new Map();
  private readings: SensorReading[] = [];
  private alerts: Alert[] = [];
  private feedbackList: FeedbackSubmission[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const now = new Date();

    // 1. Initial Devices
    const initialDevices: Device[] = [
      {
        deviceId: 'ECOBIN-001',
        name: 'EcoBin Main Unit',
        location: 'KIOT Campus',
        status: 'online',
        binHeightCm: 30,
        lastSeen: now.toISOString(),
        createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
        currentWasteLevel: 68,
        currentDistance: 18.5,
        currentStatus: 'MEDIUM',
        sensorStatus: 'connected',
      },
      {
        deviceId: 'ECOBIN-002',
        name: 'Library Block Bin',
        location: 'KIOT Central Library',
        status: 'online',
        binHeightCm: 35,
        lastSeen: new Date(now.getTime() - 2 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
        currentWasteLevel: 35,
        currentDistance: 22.7,
        currentStatus: 'NORMAL',
        sensorStatus: 'connected',
      },
      {
        deviceId: 'ECOBIN-003',
        name: 'Cafeteria Waste Point',
        location: 'Food Court Plaza',
        status: 'online',
        binHeightCm: 30,
        lastSeen: new Date(now.getTime() - 5 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
        currentWasteLevel: 88,
        currentDistance: 5.6,
        currentStatus: 'HIGH',
        sensorStatus: 'connected',
      },
      {
        deviceId: 'ECOBIN-004',
        name: 'Tech Block Lab Wing',
        location: 'CS/ECE Ground Floor',
        status: 'warning',
        binHeightCm: 30,
        lastSeen: new Date(now.getTime() - 1 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
        currentWasteLevel: 97,
        currentDistance: 1.2,
        currentStatus: 'OVERFLOW',
        sensorStatus: 'connected',
      },
      {
        deviceId: 'ECOBIN-005',
        name: 'Sports Complex Bin',
        location: 'Athletics Pavillion',
        status: 'offline',
        binHeightCm: 30,
        lastSeen: new Date(now.getTime() - 180 * 60000).toISOString(),
        createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
        currentWasteLevel: 42,
        currentDistance: 19.8,
        currentStatus: 'NORMAL',
        sensorStatus: 'disconnected',
      },
    ];

    for (const d of initialDevices) {
      this.devices.set(d.deviceId, d);
    }

    // 2. Generate Realistic History for ECOBIN-001 (past 7 days + today)
    const points = 60;
    for (let i = points; i >= 0; i--) {
      const timeOffsetMinutes = i * 20; // every 20 minutes
      const timestamp = new Date(now.getTime() - timeOffsetMinutes * 60000).toISOString();
      
      // Simulate realistic fill cycle
      // Cycle repeats roughly every 36-48 hours
      const cyclePos = ((timeOffsetMinutes % 2000) / 2000);
      let simulatedWaste = Math.round(15 + 75 * (1 - cyclePos));
      if (i === 0) simulatedWaste = 68; // exact current value for today
      
      const distance = Number((30 * (1 - simulatedWaste / 100)).toFixed(1));
      const status = calculateWasteStatus(simulatedWaste);

      this.readings.push({
        id: `reading-init-${i}`,
        deviceId: 'ECOBIN-001',
        distance,
        wasteLevel: simulatedWaste,
        status,
        timestamp,
        isDemo: false,
      });
    }

    // 3. Initial Alerts
    this.alerts = [
      {
        id: 'alert-1',
        deviceId: 'ECOBIN-004',
        type: 'OVERFLOW',
        title: 'Overflow Limit Reached',
        severity: 'critical',
        message: 'EcoBin-004 capacity reached 97% — IMMEDIATE OVERFLOW WARNING at CS/ECE Ground Floor.',
        wasteLevel: 97,
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        status: 'unread',
      },
      {
        id: 'alert-2',
        deviceId: 'ECOBIN-003',
        type: 'HIGH',
        title: 'Waste Above 80% Threshold',
        severity: 'warning',
        message: 'EcoBin-003 has reached 88% capacity at Food Court Plaza. Dispatch scheduled.',
        wasteLevel: 88,
        timestamp: new Date(now.getTime() - 55 * 60000).toISOString(),
        status: 'unread',
      },
      {
        id: 'alert-3',
        deviceId: 'ECOBIN-005',
        type: 'DEVICE OFFLINE',
        title: 'Device Offline Warning',
        severity: 'warning',
        message: 'EcoBin-005 has not sent telemetry heartbeat for over 2 hours.',
        timestamp: new Date(now.getTime() - 110 * 60000).toISOString(),
        status: 'read',
      },
      {
        id: 'alert-4',
        deviceId: 'ECOBIN-001',
        type: 'MEDIUM',
        title: 'Capacity Moderate (65%)',
        severity: 'info',
        message: 'EcoBin-001 crossed 65% capacity threshold at KIOT Campus.',
        wasteLevel: 68,
        timestamp: new Date(now.getTime() - 180 * 60000).toISOString(),
        status: 'read',
      },
    ];

    // 4. Initial Feedback
    this.feedbackList = [
      {
        id: 'fb-1',
        name: 'Dr. R. Ramanathan',
        email: 'ramanathan.dean@kiot.ac.in',
        rating: 5,
        feedback: 'Excellent IoT initiative by the engineering department. The overflow alerts prevented cafeteria bin spills during the college symposium.',
        suggestions: 'Would be helpful to integrate WhatsApp SMS notification for campus sanitation supervisors.',
        createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      },
      {
        id: 'fb-2',
        name: 'Priya Sharma (Student Rep)',
        email: 'priya.s@student.kiot.ac.in',
        rating: 5,
        feedback: 'Clean UI and the live 3D visual bin fill level makes checking campus bins very intuitive.',
        suggestions: 'Add QR codes on the physical bins so students can scan and see live status.',
        createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      },
    ];
  }

  // Devices
  public getDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  public getDevice(deviceId: string): Device | undefined {
    return this.devices.get(deviceId);
  }

  public upsertDevice(deviceData: Partial<Device> & { deviceId: string }): Device {
    const existing = this.devices.get(deviceData.deviceId);
    const now = new Date().toISOString();
    const updated: Device = {
      deviceId: deviceData.deviceId,
      name: deviceData.name || existing?.name || `EcoBin ${deviceData.deviceId}`,
      location: deviceData.location || existing?.location || 'Unassigned Location',
      status: deviceData.status || existing?.status || 'online',
      binHeightCm: deviceData.binHeightCm || existing?.binHeightCm || DEFAULT_BIN_HEIGHT_CM,
      lastSeen: deviceData.lastSeen || now,
      createdAt: existing?.createdAt || now,
      currentWasteLevel: deviceData.currentWasteLevel !== undefined ? deviceData.currentWasteLevel : existing?.currentWasteLevel,
      currentDistance: deviceData.currentDistance !== undefined ? deviceData.currentDistance : existing?.currentDistance,
      currentStatus: deviceData.currentStatus || existing?.currentStatus,
      sensorStatus: deviceData.sensorStatus || existing?.sensorStatus || 'connected',
    };
    this.devices.set(deviceData.deviceId, updated);
    return updated;
  }

  // Sensor Readings
  public addReading(payload: {
    deviceId: string;
    distance?: number;
    wasteLevel?: number;
    status?: string;
    timestamp?: string;
    isDemo?: boolean;
  }): { reading: SensorReading; device: Device; alertCreated?: Alert } {
    const now = new Date();
    const isoTimestamp = payload.timestamp ? new Date(payload.timestamp).toISOString() : now.toISOString();

    let device = this.devices.get(payload.deviceId);
    if (!device) {
      device = this.upsertDevice({
        deviceId: payload.deviceId,
        name: `EcoBin Unit ${payload.deviceId}`,
        location: 'KIOT Campus',
        status: 'online',
        binHeightCm: DEFAULT_BIN_HEIGHT_CM,
      });
    }

    const binHeight = device.binHeightCm || DEFAULT_BIN_HEIGHT_CM;
    let distance = payload.distance;
    let wasteLevel = payload.wasteLevel;

    // Calculate missing attributes
    if (distance === undefined && wasteLevel !== undefined) {
      distance = Number((binHeight * (1 - wasteLevel / 100)).toFixed(1));
    } else if (distance !== undefined && wasteLevel === undefined) {
      wasteLevel = calculateWasteLevelFromDistance(distance, binHeight);
    } else if (distance === undefined && wasteLevel === undefined) {
      distance = 18.5;
      wasteLevel = 68;
    }

    distance = Number(distance!.toFixed(1));
    wasteLevel = Math.round(wasteLevel!);
    const status = calculateWasteStatus(wasteLevel);

    const reading: SensorReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      deviceId: payload.deviceId,
      distance,
      wasteLevel,
      status,
      timestamp: isoTimestamp,
      isDemo: Boolean(payload.isDemo),
    };

    this.readings.push(reading);
    if (this.readings.length > 2000) {
      this.readings = this.readings.slice(-1000);
    }

    // Update Device state
    device.lastSeen = isoTimestamp;
    device.status = 'online';
    device.currentWasteLevel = wasteLevel;
    device.currentDistance = distance;
    device.currentStatus = status;
    device.sensorStatus = 'connected';
    this.devices.set(device.deviceId, device);

    // Automatic Alert Logic with duplicate throttling
    let alertCreated: Alert | undefined;
    if (wasteLevel >= 96) {
      alertCreated = this.triggerAlertIfNew(payload.deviceId, 'OVERFLOW', `EcoBin-${payload.deviceId} has reached ${wasteLevel}% capacity (OVERFLOW condition)!`, wasteLevel, now);
    } else if (wasteLevel > 95) {
      alertCreated = this.triggerAlertIfNew(payload.deviceId, 'CRITICAL', `EcoBin-${payload.deviceId} has reached critical ${wasteLevel}% capacity.`, wasteLevel, now);
    } else if (wasteLevel > 80) {
      alertCreated = this.triggerAlertIfNew(payload.deviceId, 'HIGH', `EcoBin-${payload.deviceId} has reached ${wasteLevel}% capacity warning level.`, wasteLevel, now);
    }

    return { reading, device, alertCreated };
  }

  private triggerAlertIfNew(
    deviceId: string,
    type: Alert['type'],
    message: string,
    wasteLevel: number,
    now: Date
  ): Alert | undefined {
    // Check if an unread alert for this device of this type was sent in the last 15 minutes
    const fifteenMinAgo = now.getTime() - 15 * 60000;
    const recentDuplicate = this.alerts.find(
      (a) => a.deviceId === deviceId && a.type === type && new Date(a.timestamp).getTime() > fifteenMinAgo
    );

    if (recentDuplicate) {
      return undefined;
    }

    const severity: Alert['severity'] =
      type === 'OVERFLOW' || type === 'CRITICAL' ? 'critical' : type === 'HIGH' ? 'warning' : 'info';
    const title =
      type === 'OVERFLOW'
        ? 'Overflow Limit Reached'
        : type === 'CRITICAL'
        ? 'Critical Fill Alert'
        : type === 'HIGH'
        ? 'High Capacity Warning'
        : 'System Alert';

    const newAlert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      deviceId,
      type,
      title,
      severity,
      message,
      wasteLevel,
      timestamp: now.toISOString(),
      status: 'unread',
    };

    this.alerts.unshift(newAlert);
    if (this.alerts.length > 200) {
      this.alerts = this.alerts.slice(0, 100);
    }
    return newAlert;
  }

  // Get readings with filtering
  public getReadings(deviceId?: string, filter: 'today' | '24h' | '7d' | '30d' | 'all' = 'all'): SensorReading[] {
    const now = Date.now();
    let cutoff = 0;

    if (filter === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      cutoff = todayStart.getTime();
    } else if (filter === '24h') {
      cutoff = now - 24 * 3600 * 1000;
    } else if (filter === '7d') {
      cutoff = now - 7 * 86400 * 1000;
    } else if (filter === '30d') {
      cutoff = now - 30 * 86400 * 1000;
    }

    let list = this.readings;
    if (deviceId) {
      list = list.filter((r) => r.deviceId.toLowerCase() === deviceId.toLowerCase());
    }
    if (cutoff > 0) {
      list = list.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
    }

    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Alerts
  public getAlerts(deviceId?: string): Alert[] {
    if (deviceId) {
      return this.alerts.filter((a) => a.deviceId.toLowerCase() === deviceId.toLowerCase());
    }
    return this.alerts;
  }

  public markAlertRead(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'read';
      return true;
    }
    return false;
  }

  public clearAlert(alertId: string): boolean {
    const initialLen = this.alerts.length;
    this.alerts = this.alerts.filter((a) => a.id !== alertId);
    return this.alerts.length < initialLen;
  }

  // Feedback
  public addFeedback(data: Omit<FeedbackSubmission, 'id' | 'createdAt'>): FeedbackSubmission {
    const submission: FeedbackSubmission = {
      ...data,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.feedbackList.unshift(submission);
    return submission;
  }

  public getFeedback(): FeedbackSubmission[] {
    return this.feedbackList;
  }

  // Admin Stats
  public getAdminStats(): AdminStats {
    const devices = Array.from(this.devices.values());
    const onlineDevices = devices.filter((d) => d.status === 'online').length;
    const offlineDevices = devices.filter((d) => d.status === 'offline').length;
    const criticalBins = devices.filter((d) => (d.currentWasteLevel || 0) >= 81 && (d.currentWasteLevel || 0) <= 95).length;
    const overflowBins = devices.filter((d) => (d.currentWasteLevel || 0) >= 96).length;
    const unreadAlerts = this.alerts.filter((a) => a.status === 'unread').length;

    const totalLevel = devices.reduce((sum, d) => sum + (d.currentWasteLevel || 0), 0);
    const averageWasteLevel = devices.length > 0 ? Math.round(totalLevel / devices.length) : 0;

    const now = new Date();
    const systemLogs = [
      {
        timestamp: new Date(now.getTime() - 2 * 60000).toISOString(),
        level: 'info' as const,
        message: 'Telemetry ingest worker processed packet from ECOBIN-001 (distance: 18.5cm, level: 68%).',
      },
      {
        timestamp: new Date(now.getTime() - 8 * 60000).toISOString(),
        level: 'info' as const,
        message: 'Heartbeat ping received from NodeMCU v3 ESP-12E (IP: 192.168.1.142, RSSI: -54 dBm).',
      },
      {
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        level: 'warn' as const,
        message: 'Threshold alert raised: ECOBIN-004 triggered OVERFLOW threshold (97%).',
      },
      {
        timestamp: new Date(now.getTime() - 40 * 60000).toISOString(),
        level: 'info' as const,
        message: 'Cloud Firestore synchronization healthy, zero latency.',
      },
    ];

    const sensorFailureLogs = [
      {
        deviceId: 'ECOBIN-005',
        timestamp: new Date(now.getTime() - 110 * 60000).toISOString(),
        issue: 'NodeMCU heartbeat missed 4 consecutive poll cycles (Wi-Fi timeout).',
      },
    ];

    return {
      totalDevices: devices.length,
      totalBins: devices.length,
      onlineDevices,
      offlineDevices,
      criticalBins,
      overflowBins,
      totalReadings: this.readings.length,
      unreadAlerts,
      totalAlerts: this.alerts.length,
      averageWasteLevel,
      highPriorityBins: criticalBins + overflowBins,
      systemLogs,
      sensorFailureLogs,
    };
  }
}

export const db = new InMemoryEcoBinDatabase();
