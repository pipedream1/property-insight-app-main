
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  photo_url: string | null;
}

export enum ComponentCondition {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  CRITICAL = 'Critical',
  MAINTENANCE_REQUIRED = 'Maintenance Required'
}

export interface ComponentCategory {
  id: string;
  name: string;
  items?: string[];
}

export type ComponentStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | 'unknown';

export interface MaintenanceTask {
  id: string;
  componentType: string;
  componentName?: string;
  description: string;
  priority: string;
  createdAt: Date;
  completedAt?: Date | null;
  photos?: string[];
  inspectionId?: number;
  photo_url?: string; // Added for API compatibility
}

export interface WaterReading {
  id: string | number;
  source: string;
  reading: number;
  readingDate: Date;
  createdAt: Date;
  notes?: string;
}
