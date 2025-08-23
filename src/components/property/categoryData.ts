
export type ComponentCategory = {
  id: string;
  name: string;
  items?: string[];
};

export const categories: ComponentCategory[] = [
  {
    id: 'roads',
    name: 'Roads',
    items: [
      'Armstrong Close', 'Barrington Close', 'Bern Close', 'Bowman Close',
      'Curry Close', 'Dickerson Close', 'Embling Close', 'Gregory Close', 
      'Hart Lane', 'Lawrence Lane', 'Le Sueur Road', 'Lower Duthie', 'Marr Lane',
      'Mason Close', 'Morris Lane', 'Newdigate Close', 'Page Close', 
      'Robert Grey Avenue', 'Roberts Lane', 'Rutherford Walk', 
      'Sharples Close', 'Sophia Grey Lane', 'Upper Duthie'
    ]
  },
  {
    id: 'circles',
    name: 'Circles',
    items: [
      'Armstrong Close', 'Barrington Close', 'Bern Close', 'Bowman Close',
      'Curry Close', 'Dickerson Close', 'Embling Close', 'Gregory Close', 
      'Hart Lane', 'Lawrence Lane', 'Le Sueur Road', 'Lower Duthie', 'Marr Lane',
      'Mason Close', 'Morris Lane', 'Newdigate Close', 'Page Close', 
      'Robert Grey Avenue', 'Roberts Lane', 'Rutherford Walk', 
      'Sharples Close', 'Sophia Grey Lane', 'Upper Duthie'
    ]
  },
  {
    id: 'bhoaOffices',
    name: 'BHOA Offices'
  },
  {
    id: 'bhoaCottage',
    name: 'BHOA Cottage'
  },
  {
    id: 'jettyParkingLot',
    name: 'Jetty Parking Lot'
  },
  {
    id: 'tennisCourts',
    name: 'Tennis Courts',
    items: ['Court 1', 'Court 2']
  },
  {
    id: 'birdPark',
    name: 'Bird Park'
  },
  {
    id: 'rutherfordTrail',
    name: 'Rutherford Trail'
  },
  {
    id: 'miniSubs',
    name: 'Mini Subs',
    items: ['Sub 1', 'Sub 2', 'Sub 3', 'Sub 4']
  },
  {
    id: 'pumpStations',
    name: 'Sewage Pump Stations',
    items: ['Lagoon Pump', 'Upper Duthie Pump', 'Old Belvidere Pump']
  },
  {
    id: 'sewageWorks',
    name: 'Sewage Works'
  },
  {
    id: 'greenBelts',
    name: 'Green Belts & Verges'
  },
  {
    id: 'railwayFireBreak',
    name: 'Railway Fire Break'
  }
];
