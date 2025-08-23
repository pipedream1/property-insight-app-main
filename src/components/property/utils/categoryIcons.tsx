
import React from 'react';
import { 
  Circle, 
  Route,
  Waves,
  Droplets,
  UtilityPole,
  TreeDeciduous,
  TreePalm,
  TreePine
} from 'lucide-react';

// Map of category IDs to their corresponding icons
export const categoryIcons: Record<string, React.ReactNode> = {
  roads: <Route className="h-5 w-5" />,
  circles: <Circle className="h-5 w-5" />,
  tennisCourts: <TreePalm className="h-5 w-5" />,
  miniSubs: <UtilityPole className="h-5 w-5" />,
  pumpStations: <Waves className="h-5 w-5" />,
  greenBelts: <TreeDeciduous className="h-5 w-5" />,
  jettyParkingLot: <Route className="h-5 w-5" />,
  railwayFireBreak: <Route className="h-5 w-5" />,
  birdPark: <TreePine className="h-5 w-5" />,
  sewageWorks: <Droplets className="h-5 w-5" />
};

// Default icon for categories without a specific icon
export const getDefaultIcon = () => <Circle className="h-5 w-5" />;
