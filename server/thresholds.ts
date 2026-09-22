import { WasteStatus, CollectionPriority } from './types.js';

export const DEFAULT_BIN_HEIGHT_CM = 30;

export const STATUS_THRESHOLDS = {
  NORMAL: { min: 0, max: 50, color: '#16a34a', label: 'NORMAL' },
  MEDIUM: { min: 51, max: 80, color: '#ca8a04', label: 'MEDIUM' },
  HIGH: { min: 81, max: 95, color: '#ea580c', label: 'HIGH' },
  OVERFLOW: { min: 96, max: 100, color: '#dc2626', label: 'OVERFLOW' },
} as const;

export function calculateWasteStatus(wasteLevel: number): WasteStatus {
  if (wasteLevel >= 96) return 'OVERFLOW';
  if (wasteLevel >= 81) return 'HIGH';
  if (wasteLevel >= 51) return 'MEDIUM';
  return 'NORMAL';
}

export function calculateWasteLevelFromDistance(distanceCm: number, binHeightCm: number = DEFAULT_BIN_HEIGHT_CM): number {
  if (binHeightCm <= 0) return 0;
  // If distance is greater than or equal to bin height, bin is empty (0%)
  if (distanceCm >= binHeightCm) return 0;
  // If distance is near zero or negative (sensor contact), bin is 100% full
  if (distanceCm <= 1.5) return 100;
  const level = ((binHeightCm - distanceCm) / binHeightCm) * 100;
  return Math.round(Math.max(0, Math.min(100, level)));
}

export function calculateCollectionPriority(wasteLevel: number): {
  priority: CollectionPriority;
  reason: string;
} {
  if (wasteLevel >= 96) {
    return {
      priority: 'URGENT',
      reason: 'Bin capacity has reached the overflow threshold. Immediate collection required.',
    };
  }
  if (wasteLevel >= 81) {
    return {
      priority: 'HIGH',
      reason: 'Waste level is approaching maximum capacity. Schedule for collection within 2 hours.',
    };
  }
  if (wasteLevel >= 51) {
    return {
      priority: 'MEDIUM',
      reason: 'Waste level is moderate. Normal monitoring recommended.',
    };
  }
  return {
    priority: 'LOW',
    reason: 'Bin capacity within safe limits. Standard routine collection applies.',
  };
}
