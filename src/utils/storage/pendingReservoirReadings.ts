export type PendingReservoirReading = {
  water_level: number;
  percentage_full: number;
  reading_date: string; // ISO
  notes: string | null;
  createdAt: string; // ISO
};

const KEY = 'pending-reservoir-readings-v1';

export function addPendingReservoirReading(r: Omit<PendingReservoirReading, 'createdAt'>) {
  try {
    const list = getPendingReservoirReadings();
    list.push({ ...r, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function getPendingReservoirReadings(): PendingReservoirReading[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setPendingReservoirReadings(list: PendingReservoirReading[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export async function trySyncPendingReservoirReadings(
  insert: (r: PendingReservoirReading) => Promise<{ error: { message: string } | null }>
): Promise<{ success: number; failed: number }> {
  const list = getPendingReservoirReadings();
  if (list.length === 0) return { success: 0, failed: 0 };
  let success = 0;
  const remaining: PendingReservoirReading[] = [];
  for (const r of list) {
    try {
      const { error } = await insert(r);
      if (error) remaining.push(r); else success++;
    } catch {
      remaining.push(r);
    }
  }
  setPendingReservoirReadings(remaining);
  return { success, failed: remaining.length };
}
