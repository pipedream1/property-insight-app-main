
export interface WaterReading {
  id: number;
  component_type: string;
  component_name: string | null;
  reading: number | null;
  date: string;
  comment: string | null;
  photo_taken: boolean | null;
  photo_url: string | null;
  created_at: string | null;
}

export interface ReservoirReading {
  id: string;
  reading_date: string;
  water_level: number;
  percentage_full: number;
  notes: string | null;
  created_at: string;
}

export interface MonthlyUsage {
  month: string;
  year: number;
  sources: Array<{
    source: string;
    usage: number;
    color: string;
  }>;
  total: number;
}
