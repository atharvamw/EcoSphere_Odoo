import { addDays, subDays, format } from 'date-fns';

export const DEPARTMENTS = [
  'Manufacturing',
  'Logistics & Fleet',
  'Research & Development',
  'Human Resources',
  'Sales & Marketing',
  'Operations',
  'IT & Infrastructure'
];

export const generateSparklineData = (points = 7, trend: 'up' | 'down' | 'flat' = 'up') => {
  let current = 100;
  return Array.from({ length: points }).map((_, i) => {
    const variance = Math.random() * 20 - 10;
    if (trend === 'up') current += 5 + variance;
    if (trend === 'down') current -= 5 + variance;
    if (trend === 'flat') current += variance;
    return { name: `Day ${i + 1}`, value: Math.max(0, Math.round(current)) };
  });
};

export const getMockKPIs = () => ({
  overallEsg: { value: 78.4, trend: '+2.1', previous: 76.3, sparkline: generateSparklineData(30, 'up') },
  environmental: { value: 65.2, trend: '-1.4', previous: 66.6, sparkline: generateSparklineData(30, 'down') },
  social: { value: 84.1, trend: '+5.2', previous: 78.9, sparkline: generateSparklineData(30, 'up') },
  governance: { value: 92.0, trend: '+0.5', previous: 91.5, sparkline: generateSparklineData(30, 'flat') },
  carbonEmissions: { value: '12,450', unit: 'tCO2e', trend: '-8.4%', previous: '13,591', sparkline: generateSparklineData(30, 'down') },
  employeeParticipation: { value: '64%', trend: '+12%', previous: '52%', sparkline: generateSparklineData(30, 'up') },
});

export const getMockCarbonTrend = (days = 30) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      date: format(date, 'MMM dd'),
      manufacturing: Math.round(500 + Math.random() * 100),
      logistics: Math.round(300 + Math.random() * 80),
      operations: Math.round(150 + Math.random() * 40),
    };
  });
};

export const getMockLeaderboard = () => {
  return DEPARTMENTS.map((dept, i) => ({
    id: `dept-${i}`,
    name: dept,
    score: Math.round(60 + Math.random() * 35),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    trendValue: (Math.random() * 5).toFixed(1),
    carbonTarget: Math.round(Math.random() * 100) + '%',
    participation: Math.round(Math.random() * 100) + '%'
  })).sort((a, b) => b.score - a.score);
};

export const getMockActivities = () => [
  { id: 1, type: 'environmental', title: 'Carbon Transaction Imported', desc: 'Logistics fleet fuel data for Q3 imported from ERP.', time: '10 mins ago', severity: 'info' },
  { id: 2, type: 'social', title: 'CSR Initiative Approved', desc: 'Coastal Cleanup drive approved by HR.', time: '2 hours ago', severity: 'success' },
  { id: 3, type: 'governance', title: 'Compliance Violation Detected', desc: 'Missing vendor audit in Supply Chain module.', time: '5 hours ago', severity: 'high' },
  { id: 4, type: 'gamification', title: 'Reward Redeemed', desc: 'Sarah J. redeemed a $50 Coffee Giftcard.', time: '1 day ago', severity: 'info' },
  { id: 5, type: 'social', title: 'Challenge Completed', desc: '"Bike to Work Month" ended with 420 participants.', time: '2 days ago', severity: 'success' },
];

export const getMockAIInsights = () => ({
  alerts: [
    { id: 1, title: 'Manufacturing emissions trending high', desc: 'Manufacturing is on track to exceed Q3 carbon limits by 14% based on current production rates.', type: 'danger' }
  ],
  recommendations: [
    { id: 1, title: 'Shift 20% logistics to EV Fleet', desc: 'Diverting urban deliveries to the new EV fleet will offset the manufacturing spike.', impact: '+4.2 ESG Score' },
    { id: 2, title: 'Launch Energy Saving Challenge', desc: 'Office energy consumption is up. A gamified challenge historically reduces usage by 8%.', impact: '+1.5 ESG Score' }
  ],
  summary: 'Overall organizational health is strong, driven by high Social participation. However, Environmental metrics require immediate intervention to hit end-of-year net-zero targets.'
});
