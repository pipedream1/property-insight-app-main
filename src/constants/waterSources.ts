
// Water sources configuration - only the ones you want displayed
// Dashboard-visible water sources (exclude Borehole 1 temporarily while pump is offline)
export const WATER_SOURCES = [
  // { value: 'Borehole 1', label: 'Borehole 1' }, // temporarily disabled
  { value: 'Borehole 2', label: 'Borehole 2' },
  { value: 'Borehole 3', label: 'Borehole 3' },
  { value: 'Borehole 4', label: 'Borehole 4' },
  { value: 'Knysna Water', label: 'Knysna Water' },
];

// Valid water sources - exclude WaterMeter and any other unwanted sources
// Canonical list used in calculations and charts (Borehole 1 removed for now)
export const VALID_WATER_SOURCES = ['Borehole 2', 'Borehole 3', 'Borehole 4', 'Knysna Water'];

// Source colors for charts
export const SOURCE_COLORS = {
  'Borehole 1': '#8884d8',
  'Borehole 2': '#82ca9d', 
  'Borehole 3': '#ffc658',
  'Borehole 4': '#ff7300',
  'Knysna Water': '#0088fe'
} as const;

// Map of common variants seen in DB to canonical labels used in UI
const SOURCE_SYNONYMS: Record<string, string> = {
  // Boreholes
  'borehole1': 'Borehole 1',
  'borehole 1': 'Borehole 1',
  'borehole-1': 'Borehole 1',
  'bh1': 'Borehole 1',
  'borehole2': 'Borehole 2',
  'borehole 2': 'Borehole 2',
  'borehole-2': 'Borehole 2',
  'bh2': 'Borehole 2',
  'borehole3': 'Borehole 3',
  'borehole 3': 'Borehole 3',
  'borehole-3': 'Borehole 3',
  'bh3': 'Borehole 3',
  'borehole4': 'Borehole 4',
  'borehole 4': 'Borehole 4',
  'borehole-4': 'Borehole 4',
  'bh4': 'Borehole 4',
  // Municipal
  'knysnawater': 'Knysna Water',
  'knysna water': 'Knysna Water',
  'municipal': 'Knysna Water',
  'municipality': 'Knysna Water',
  'municipal water': 'Knysna Water',
};

// Normalize any component_type/name to a canonical water source label or null if unknown
export function normalizeWaterSource(input?: string | null): string | null {
  if (!input) return null;
  const key = String(input).trim().toLowerCase();
  // Direct match first
  if (VALID_WATER_SOURCES.map(s => s.toLowerCase()).includes(key)) {
    // Return the cased canonical entry from VALID_WATER_SOURCES
    const idx = VALID_WATER_SOURCES.map(s => s.toLowerCase()).indexOf(key);
    return VALID_WATER_SOURCES[idx] || null;
  }
  // Synonym map
  if (SOURCE_SYNONYMS[key]) return SOURCE_SYNONYMS[key];

  // Heuristics: strip spaces/dashes and try again
  const compact = key.replace(/[\s\-_/]/g, '');
  if (SOURCE_SYNONYMS[compact]) return SOURCE_SYNONYMS[compact];

  return null;
}
