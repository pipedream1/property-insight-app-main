
// Water sources configuration - only the ones you want displayed
export const WATER_SOURCES = [
  { value: 'Borehole 1', label: 'Borehole 1' },
  { value: 'Borehole 2', label: 'Borehole 2' },
  { value: 'Borehole 3', label: 'Borehole 3' },
  { value: 'Borehole 4', label: 'Borehole 4' },
  { value: 'Knysna Water', label: 'Knysna Water' },
];

// Valid water sources - exclude WaterMeter and any other unwanted sources
export const VALID_WATER_SOURCES = ['Borehole 1', 'Borehole 2', 'Borehole 3', 'Borehole 4', 'Knysna Water'];

// Source colors for charts
export const SOURCE_COLORS = {
  'Borehole 1': '#8884d8',
  'Borehole 2': '#82ca9d', 
  'Borehole 3': '#ffc658',
  'Borehole 4': '#ff7300',
  'Knysna Water': '#0088fe'
} as const;
