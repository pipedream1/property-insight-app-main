export type PendingReading = {
  // legacy fields used by current DB schema
  component_type: string;
  component_name: string;
  // optional FK if known
  water_source_id?: number;
  reading: number;
  date: string; // ISO string
  comment: string | null;
  createdAt: string; // ISO string
};

const KEY = 'pending-water-readings-v1';

export function addPendingReading(reading: Omit<PendingReading, 'createdAt'>) {
  try {
    const list = getPendingReadings();
    list.push({ ...reading, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to persist pending reading locally:', e);
  }
}

export function getPendingReadings(): PendingReading[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingReading[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setPendingReadings(readings: PendingReading[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(readings));
  } catch (e) {
    console.warn('Failed to set pending readings:', e);
  }
}

export async function trySyncPendingReadings(
  insert: (r: PendingReading) => Promise<{ error: { message: string } | null }>
): Promise<{ success: number; failed: number }> {
  const list = getPendingReadings();
  if (list.length === 0) return { success: 0, failed: 0 };

  let success = 0;
  const remaining: PendingReading[] = [];
  for (const r of list) {
    try {
      const { error } = await insert(r);
      if (error) {
        remaining.push(r);
      } else {
        success++;
      }
    } catch {
      remaining.push(r);
    }
  }
  setPendingReadings(remaining);
  return { success, failed: remaining.length };
}
