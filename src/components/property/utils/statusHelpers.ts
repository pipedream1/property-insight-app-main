
import { ComponentStatus } from '@/types';

// Status colors for visual indicators
export const statusColors: Record<ComponentStatus, string> = {
  good: "bg-green-500",
  fair: "bg-yellow-500",
  poor: "bg-red-500",
  critical: "bg-red-700",
  excellent: "bg-emerald-400",
  unknown: "bg-gray-400"
};

// Helper function to determine component status based on inspections
export function getComponentStatus(categoryId: string, inspections?: any[]): ComponentStatus {
  if (!inspections || inspections.length === 0) return 'unknown';
  
  // For simplicity, we're returning random statuses here
  // In a real app, you would calculate this based on actual inspection data
  const statuses: ComponentStatus[] = ['good', 'fair', 'poor'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Helper function to capitalize first letter
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
