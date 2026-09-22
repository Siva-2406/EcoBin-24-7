import { WasteStatus, CollectionPriority } from '../types';

export const DEFAULT_BIN_HEIGHT_CM = 30;

export const STATUS_CONFIG: Record<
  WasteStatus,
  {
    label: string;
    color: string;
    bgLight: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accentHex: string;
  }
> = {
  NORMAL: {
    label: 'NORMAL',
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    accentHex: '#10b981',
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: 'amber',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    accentHex: '#f59e0b',
  },
  HIGH: {
    label: 'HIGH',
    color: 'orange',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
    accentHex: '#ea580c',
  },
  OVERFLOW: {
    label: 'OVERFLOW',
    color: 'rose',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    accentHex: '#e11d48',
  },
};

export function getWasteStatus(wasteLevel: number): WasteStatus {
  if (wasteLevel >= 96) return 'OVERFLOW';
  if (wasteLevel >= 81) return 'HIGH';
  if (wasteLevel >= 51) return 'MEDIUM';
  return 'NORMAL';
}

export function getCollectionPriority(wasteLevel: number): {
  priority: CollectionPriority;
  label: string;
  badgeClass: string;
  reason: string;
  timeWindow: string;
} {
  if (wasteLevel >= 96) {
    return {
      priority: 'URGENT',
      label: 'URGENT COLLECTION REQUIRED',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      reason: 'Bin capacity has reached the overflow threshold.',
      timeWindow: 'Immediate Dispatch (< 30 mins)',
    };
  }
  if (wasteLevel >= 81) {
    return {
      priority: 'HIGH',
      label: 'HIGH PRIORITY',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      reason: 'Waste level is high (81-95%). Prioritize routing for today’s collection run.',
      timeWindow: 'Next 2 Hours',
    };
  }
  if (wasteLevel >= 51) {
    return {
      priority: 'MEDIUM',
      label: 'MEDIUM PRIORITY',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      reason: 'Waste volume moderate. Bin is steadily filling up.',
      timeWindow: 'Within 6-8 Hours',
    };
  }
  return {
    priority: 'LOW',
    label: 'LOW PRIORITY',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    reason: 'Bin volume is well within capacity. Standard collection schedule applies.',
    timeWindow: 'Routine Daily Run',
  };
}

export function calculateDistanceToWasteLevel(distanceCm: number, binHeightCm: number = DEFAULT_BIN_HEIGHT_CM): number {
  if (binHeightCm <= 0) return 0;
  if (distanceCm >= binHeightCm) return 0;
  if (distanceCm <= 1.5) return 100;
  const level = ((binHeightCm - distanceCm) / binHeightCm) * 100;
  return Math.round(Math.max(0, Math.min(100, level)));
}
