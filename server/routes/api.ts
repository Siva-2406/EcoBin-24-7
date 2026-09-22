import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { calculateWasteStatus, calculateCollectionPriority, DEFAULT_BIN_HEIGHT_CM } from '../thresholds.js';

export const apiRouter = Router();

/**
 * Health check
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'EcoBin 24×7 IoT Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

/**
 * ESP8266 REST API: POST /api/sensor-data & POST /api/update-data
 * Primary hardware ingestion endpoint
 */
const handleSensorIngestion = (req: Request, res: Response) => {
  try {
    const { deviceId, distance, wasteLevel, status, timestamp, isDemo } = req.body;
    const targetDeviceId = deviceId || (req.query.deviceId as string) || 'ECOBIN-001';

    // 1. Validation
    if (!targetDeviceId || typeof targetDeviceId !== 'string' || targetDeviceId.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid or missing deviceId. Must be a non-empty string.',
      });
      return;
    }

    if (distance === undefined && wasteLevel === undefined) {
      res.status(400).json({
        success: false,
        error: 'Either "distance" (in cm) or "wasteLevel" (in %) must be provided.',
      });
      return;
    }

    if (distance !== undefined && (typeof distance !== 'number' || isNaN(distance) || distance < 0 || distance > 500)) {
      res.status(400).json({
        success: false,
        error: 'Invalid "distance" value. Must be a positive number in cm (e.g. 18.5).',
      });
      return;
    }

    if (wasteLevel !== undefined && (typeof wasteLevel !== 'number' || isNaN(wasteLevel) || wasteLevel < 0 || wasteLevel > 100)) {
      res.status(400).json({
        success: false,
        error: 'Invalid "wasteLevel" value. Must be a percentage between 0 and 100.',
      });
      return;
    }

    // 2. Store reading, update device and trigger automated alert if thresholds met
    const result = db.addReading({
      deviceId: targetDeviceId.trim(),
      distance: distance !== undefined ? Number(distance) : undefined,
      wasteLevel: wasteLevel !== undefined ? Number(wasteLevel) : undefined,
      status,
      timestamp,
      isDemo: Boolean(isDemo),
    });

    res.status(201).json({
      success: true,
      message: 'Sensor data received',
      deviceId: result.device.deviceId,
      reading: result.reading,
      device: result.device,
      alertTriggered: result.alertCreated || null,
    });
  } catch (error: any) {
    console.error('Error ingesting sensor data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error processing sensor data.',
    });
  }
};

apiRouter.post('/sensor-data', handleSensorIngestion);
apiRouter.post('/update-data', handleSensorIngestion);

/**
 * GET /api/current-data/:deviceId or /api/bins/latest or /api/bins/:deviceId
 * Returns current fill status and collection priority
 */
const handleCurrentData = (req: Request, res: Response) => {
  const deviceId = req.params.deviceId || (req.query.deviceId as string) || 'ECOBIN-001';
  const device = db.getDevice(deviceId) || db.getDevice('ECOBIN-001');

  if (!device) {
    res.status(404).json({
      success: false,
      error: `Device with ID ${deviceId} not found.`,
    });
    return;
  }

  const readings = db.getReadings(device.deviceId, 'all');
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
  const wasteLevel = device.currentWasteLevel ?? 0;
  const priority = calculateCollectionPriority(wasteLevel);

  res.json({
    success: true,
    deviceId: device.deviceId,
    device,
    currentReading: latestReading,
    wasteLevel,
    distance: device.currentDistance ?? 0,
    status: device.currentStatus ?? calculateWasteStatus(wasteLevel),
    priority,
    lastUpdated: device.lastSeen,
  });
};

apiRouter.get('/current-data/:deviceId', handleCurrentData);
apiRouter.get('/current-data', handleCurrentData);
apiRouter.get('/bins/latest', handleCurrentData);
apiRouter.get('/bins/:deviceId', handleCurrentData);

/**
 * GET /api/history/:deviceId and GET /api/history
 * Returns historical sensor readings with time filter
 */
const handleHistory = (req: Request, res: Response) => {
  const deviceId = req.params.deviceId || (req.query.deviceId as string) || 'ECOBIN-001';
  const filter = (req.query.filter as any) || 'all';

  const readings = db.getReadings(deviceId, filter);
  res.json({
    success: true,
    deviceId,
    filter,
    count: readings.length,
    readings,
  });
};

apiRouter.get('/history/:deviceId', handleHistory);
apiRouter.get('/history', handleHistory);

/**
 * GET /api/device-status/:deviceId & GET /api/device-status
 * Returns hardware, sensor, and Wi-Fi connection health
 */
const handleDeviceStatus = (req: Request, res: Response) => {
  const deviceId = req.params.deviceId || (req.query.deviceId as string) || 'ECOBIN-001';
  const device = db.getDevice(deviceId);

  if (!device) {
    res.status(404).json({
      success: false,
      error: `Device ${deviceId} not found`,
    });
    return;
  }

  const now = Date.now();
  const lastSeenMs = new Date(device.lastSeen).getTime();
  const diffMinutes = (now - lastSeenMs) / 60000;
  const isHeartbeatActive = diffMinutes < 15;

  res.json({
    success: true,
    deviceId: device.deviceId,
    deviceStatus: isHeartbeatActive ? device.status : 'offline',
    sensorStatus: device.sensorStatus || 'connected',
    wifiStatus: isHeartbeatActive ? 'connected' : 'disconnected',
    backendStatus: 'online',
    databaseStatus: 'connected',
    lastSeen: device.lastSeen,
    minutesSinceLastSeen: Math.round(diffMinutes),
  });
};

apiRouter.get('/device-status/:deviceId', handleDeviceStatus);
apiRouter.get('/device-status', handleDeviceStatus);

/**
 * GET /api/alerts
 * GET /api/alerts/:deviceId
 */
apiRouter.get('/alerts', (_req: Request, res: Response) => {
  const alerts = db.getAlerts();
  res.json({
    success: true,
    count: alerts.length,
    alerts,
  });
});

apiRouter.get('/alerts/:deviceId', (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const alerts = db.getAlerts(deviceId);
  res.json({
    success: true,
    deviceId,
    count: alerts.length,
    alerts,
  });
});

/**
 * POST /api/alerts/resolve & POST /api/alerts/:alertId/read
 */
apiRouter.post('/alerts/resolve', (req: Request, res: Response) => {
  const alertId = req.body?.alertId || (req.query?.alertId as string);
  if (alertId) {
    db.markAlertRead(alertId);
    res.json({ success: true, message: `Alert ${alertId} resolved.` });
  } else {
    // Resolve/read all
    const all = db.getAlerts();
    all.forEach((a) => db.markAlertRead(a.id));
    res.json({ success: true, message: 'All active alerts acknowledged and resolved.' });
  }
});

/**
 * POST /api/alerts/:alertId/read
 */
apiRouter.post('/alerts/:alertId/read', (req: Request, res: Response) => {
  const { alertId } = req.params;
  const updated = db.markAlertRead(alertId);
  if (updated) {
    res.json({ success: true, message: 'Alert marked as read' });
  } else {
    res.status(404).json({ success: false, error: 'Alert not found' });
  }
});

/**
 * DELETE /api/alerts/:alertId
 */
apiRouter.delete('/alerts/:alertId', (req: Request, res: Response) => {
  const { alertId } = req.params;
  const cleared = db.clearAlert(alertId);
  if (cleared) {
    res.json({ success: true, message: 'Alert cleared successfully' });
  } else {
    res.status(404).json({ success: false, error: 'Alert not found' });
  }
});

/**
 * GET /api/devices
 * POST /api/devices
 */
apiRouter.get('/devices', (_req: Request, res: Response) => {
  const devices = db.getDevices();
  res.json({
    success: true,
    count: devices.length,
    devices,
  });
});

apiRouter.post('/devices', (req: Request, res: Response) => {
  const { deviceId, name, location, binHeightCm } = req.body;
  if (!deviceId || typeof deviceId !== 'string') {
    res.status(400).json({ success: false, error: 'Valid deviceId is required.' });
    return;
  }

  const device = db.upsertDevice({
    deviceId: deviceId.trim().toUpperCase(),
    name: name || `EcoBin ${deviceId}`,
    location: location || 'Campus Area',
    binHeightCm: Number(binHeightCm) || DEFAULT_BIN_HEIGHT_CM,
  });

  res.status(201).json({
    success: true,
    message: 'Device saved successfully',
    device,
  });
});

/**
 * GET /api/feedback
 * POST /api/feedback
 */
apiRouter.get('/feedback', (_req: Request, res: Response) => {
  const feedback = db.getFeedback();
  res.json({
    success: true,
    count: feedback.length,
    feedback,
  });
});

apiRouter.post('/feedback', (req: Request, res: Response) => {
  const { name, email, rating, feedback, suggestions } = req.body;

  if (!name || !email || !feedback || rating === undefined) {
    res.status(400).json({
      success: false,
      error: 'Please fill in all required fields: name, email, rating, and feedback.',
    });
    return;
  }

  const submission = db.addFeedback({
    name: String(name).trim(),
    email: String(email).trim(),
    rating: Number(rating),
    feedback: String(feedback).trim(),
    suggestions: suggestions ? String(suggestions).trim() : '',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for your valuable feedback! Your submission has been saved.',
    feedback: submission,
  });
});

/**
 * GET /api/admin/stats
 */
apiRouter.get('/admin/stats', (_req: Request, res: Response) => {
  const stats = db.getAdminStats();
  res.json({
    success: true,
    stats,
  });
});
