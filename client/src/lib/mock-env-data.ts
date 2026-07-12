import { subDays, format } from 'date-fns';

const SOURCES = ['Fleet Fuel (Diesel)', 'Electricity (Grid)', 'Business Travel (Air)', 'Manufacturing (Natural Gas)', 'Purchased Goods', 'Waste Disposal', 'Water Treatment'];
const DEPARTMENTS = ['Manufacturing', 'Logistics & Fleet', 'Research & Development', 'Human Resources', 'Sales & Marketing', 'Operations', 'IT & Infrastructure'];
const LOCATIONS = ['Site A - New York', 'Site B - London', 'Site C - Berlin', 'Site D - Tokyo', 'HQ - San Francisco'];
const SCOPES = ['Scope 1', 'Scope 2', 'Scope 3'];
const STATUSES = ['Verified', 'Pending Verification', 'Flagged'];

export interface CarbonTransaction {
  id: string;
  date: string;
  source: string;
  department: string;
  location: string;
  scope: string;
  quantity: number;
  originalUnit: string;
  emissionFactor: number;
  tco2e: number;
  status: string;
  createdBy: string;
}

export const generateTransactions = (count: number = 1000): CarbonTransaction[] => {
  return Array.from({ length: count }).map((_, i) => {
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const scope = source.includes('Fuel') || source.includes('Gas') ? 'Scope 1' : source.includes('Electricity') ? 'Scope 2' : 'Scope 3';
    const originalUnit = source.includes('Fuel') || source.includes('Water') ? 'Liters' : source.includes('Electricity') ? 'kWh' : 'kg';
    const quantity = Math.round(Math.random() * 5000 + 100);
    const emissionFactor = Number((Math.random() * 2 + 0.1).toFixed(3));
    const tco2e = Number(((quantity * emissionFactor) / 1000).toFixed(2)); // basic mock formula
    const dateObj = subDays(new Date(), Math.floor(Math.random() * 365));

    return {
      id: `TRX-${10000 + i}`,
      date: format(dateObj, 'yyyy-MM-dd'),
      source,
      department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      scope,
      quantity,
      originalUnit,
      emissionFactor,
      tco2e,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      createdBy: 'System Integration',
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getMockEnvKPIs = () => ({
  totalEmissions: { value: 12450, trend: '-4.2%' },
  scope1: { value: 4200, trend: '-2.1%' },
  scope2: { value: 3800, trend: '-8.4%' },
  scope3: { value: 4450, trend: '+1.2%' },
  intensity: { value: 2.4, trend: '-0.3' }, // tCO2e per employee
  netZero: { value: 68, trend: '+4%' }, // Progress to target
});

export const getMockGoals = () => [
  { id: 1, title: 'Reduce Scope 1 by 20%', current: 85, target: 100, deadline: '2027-12-31', owner: 'Logistics', status: 'On Track', risk: 'Low' },
  { id: 2, title: 'Transition to 100% Renewable (Scope 2)', current: 40, target: 100, deadline: '2030-01-01', owner: 'Operations', status: 'At Risk', risk: 'High' },
  { id: 3, title: 'Reduce Supply Chain Emissions', current: 15, target: 100, deadline: '2035-12-31', owner: 'Procurement', status: 'Delayed', risk: 'Medium' },
];
