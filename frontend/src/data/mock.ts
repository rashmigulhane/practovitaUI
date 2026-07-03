// Mock data for Practavita UI
export type Profile = {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  initials: string;
  color: string;
};

export const profiles: Profile[] = [
  { id: '1', name: 'Arjun Sharma', relation: 'Self', age: 34, gender: 'male', initials: 'AS', color: '#5A7D66' },
  { id: '2', name: 'Priya Sharma', relation: 'Spouse', age: 32, gender: 'female', initials: 'PS', color: '#D18E62' },
  { id: '3', name: 'Dad', relation: 'Father', age: 62, gender: 'male', initials: 'RS', color: '#7C786E' },
  { id: '4', name: 'Mom', relation: 'Mother', age: 58, gender: 'female', initials: 'SS', color: '#88A392' },
];

export const wearable = {
  connected: true,
  deviceName: 'Fitbit Charge 6',
  lastSync: '3 min ago',
  battery: 78,
};

export type Metric = { id: string; label: string; value: string; unit: string; icon: string; trend: number[]; delta?: string };

export const todayMetrics: Metric[] = [
  { id: 'steps', label: 'Steps', value: '8,234', unit: 'today', icon: 'walk-outline', trend: [4200, 6100, 5400, 7200, 6800, 8100, 8234], delta: '+12%' },
  { id: 'hr', label: 'Heart Rate', value: '72', unit: 'bpm resting', icon: 'heart-outline', trend: [68, 70, 74, 71, 69, 73, 72] },
  { id: 'sleep', label: 'Sleep', value: '7h 24m', unit: 'last night', icon: 'moon-outline', trend: [6.5, 7.1, 6.8, 7.4, 6.9, 8.1, 7.4] },
  { id: 'kcal', label: 'Calories', value: '1,842', unit: 'burned', icon: 'flame-outline', trend: [1650, 1720, 1580, 1900, 1810, 1750, 1842] },
];

export const riskScores = {
  diabetes: { score: 34, level: 'Moderate' as const, factors: ['Family history', 'BMI 27.4', 'Sedentary lifestyle'] },
  cvd: { score: 18, level: 'Low' as const, factors: ['Non-smoker', 'BP 122/80', 'Regular activity'] },
};

export type LabMetric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'success' | 'warning' | 'error';
  range: string;
  trend: number[];
  category: string;
};

export const labMetrics: LabMetric[] = [
  { id: 'hb', name: 'Hemoglobin', value: 14.2, unit: 'g/dL', status: 'success', range: '13.5 – 17.5', trend: [13.8, 14.0, 14.1, 14.2], category: 'CBC' },
  { id: 'glc', name: 'Fasting Glucose', value: 108, unit: 'mg/dL', status: 'warning', range: '70 – 99', trend: [95, 101, 105, 108], category: 'Diabetes' },
  { id: 'hba1c', name: 'HbA1c', value: 5.9, unit: '%', status: 'warning', range: '< 5.7', trend: [5.4, 5.6, 5.8, 5.9], category: 'Diabetes' },
  { id: 'tc', name: 'Total Cholesterol', value: 218, unit: 'mg/dL', status: 'warning', range: '< 200', trend: [195, 208, 214, 218], category: 'Lipids' },
  { id: 'hdl', name: 'HDL', value: 42, unit: 'mg/dL', status: 'success', range: '> 40', trend: [38, 40, 41, 42], category: 'Lipids' },
  { id: 'ldl', name: 'LDL', value: 148, unit: 'mg/dL', status: 'error', range: '< 100', trend: [130, 138, 144, 148], category: 'Lipids' },
  { id: 'tg', name: 'Triglycerides', value: 172, unit: 'mg/dL', status: 'warning', range: '< 150', trend: [140, 155, 165, 172], category: 'Lipids' },
  { id: 'tsh', name: 'TSH', value: 2.4, unit: 'mIU/L', status: 'success', range: '0.4 – 4.0', trend: [2.1, 2.2, 2.3, 2.4], category: 'Thyroid' },
  { id: 'crt', name: 'Creatinine', value: 0.9, unit: 'mg/dL', status: 'success', range: '0.7 – 1.3', trend: [0.85, 0.88, 0.9, 0.9], category: 'Kidney' },
  { id: 'vitd', name: 'Vitamin D', value: 22, unit: 'ng/mL', status: 'error', range: '30 – 100', trend: [18, 20, 21, 22], category: 'Vitamins' },
];

export type Report = { id: string; label: string; date: string; lab: string; metrics: number; status: 'ready' | 'processing' };

export const reports: Report[] = [
  { id: 'r1', label: 'Full Body Checkup', date: 'Nov 12, 2025', lab: 'Metropolis Labs', metrics: 42, status: 'ready' },
  { id: 'r2', label: 'Lipid Profile', date: 'Aug 03, 2025', lab: 'Dr Lal PathLabs', metrics: 8, status: 'ready' },
  { id: 'r3', label: 'Annual Health Check', date: 'Feb 18, 2025', lab: 'Thyrocare', metrics: 36, status: 'ready' },
];

export type ChatMessage = { id: string; role: 'user' | 'ai'; text: string };

export const chatHistory: ChatMessage[] = [
  { id: 'm1', role: 'ai', text: 'Hi Arjun, I\'m your Practavita health companion. I have access to your latest lab reports and wearable data. Ask me anything about your health journey.' },
];

export const chatSuggestions = [
  'Explain my last lab results',
  'Why is my LDL trending up?',
  'Suggest a workout for today',
  'What foods help lower cholesterol?',
];

export type DietPlan = { id: string; title: string; kcal: number; items: string[]; tag: string };
export const dietPlan: DietPlan[] = [
  { id: 'd1', title: 'Breakfast', kcal: 380, items: ['Oats with berries & flax seeds', 'Green tea', 'Handful of almonds'], tag: 'Heart-healthy' },
  { id: 'd2', title: 'Lunch', kcal: 520, items: ['Grilled chicken salad', 'Quinoa bowl', 'Buttermilk'], tag: 'High-protein' },
  { id: 'd3', title: 'Snack', kcal: 180, items: ['Roasted chana', 'Apple slices'], tag: 'Low-GI' },
  { id: 'd4', title: 'Dinner', kcal: 460, items: ['Steamed fish', 'Sautéed veggies', 'Brown rice (½ cup)'], tag: 'Omega-3' },
];

export type Workout = { id: string; title: string; duration: string; intensity: string; icon: string };
export const workouts: Workout[] = [
  { id: 'w1', title: 'Brisk Walk', duration: '30 min', intensity: 'Low', icon: 'walk-outline' },
  { id: 'w2', title: 'Strength Training', duration: '25 min', intensity: 'Moderate', icon: 'barbell-outline' },
  { id: 'w3', title: 'Yoga Flow', duration: '20 min', intensity: 'Low', icon: 'leaf-outline' },
  { id: 'w4', title: 'HIIT Cardio', duration: '15 min', intensity: 'High', icon: 'flash-outline' },
];

export type Habit = { id: string; title: string; icon: string; target: string; category: 'diet' | 'workout' | 'wellness' };
export const habits: Habit[] = [
  { id: 'h1', title: 'Drink 8 glasses of water', icon: 'water-outline', target: '2 L', category: 'wellness' },
  { id: 'h2', title: 'Take morning walk', icon: 'walk-outline', target: '30 min', category: 'workout' },
  { id: 'h3', title: 'Eat 5 servings of fruit/veg', icon: 'nutrition-outline', target: '5×', category: 'diet' },
  { id: 'h4', title: '10-min mindful breathing', icon: 'leaf-outline', target: '10 min', category: 'wellness' },
  { id: 'h5', title: 'Sleep 7+ hours', icon: 'moon-outline', target: '7 h', category: 'wellness' },
  { id: 'h6', title: 'Take medication', icon: 'medical-outline', target: '1×', category: 'wellness' },
];

export const wellnessScore = {
  current: 78,
  delta: '+4',
  streak: 12,
  weekdays: [
    { day: 'M', done: true },
    { day: 'T', done: true },
    { day: 'W', done: true },
    { day: 'T', done: true },
    { day: 'F', done: false, today: true },
    { day: 'S', done: false },
    { day: 'S', done: false },
  ],
};

export type DeviceCfg = {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status?: string;
};
export const availableDevices: DeviceCfg[] = [
  { id: 'fitbit', name: 'Fitbit Charge 6', icon: 'watch-outline', connected: true, status: 'Syncing steps, HR, sleep' },
  { id: 'apple', name: 'Apple Watch', icon: 'watch-outline', connected: false },
  { id: 'garmin', name: 'Garmin', icon: 'watch-outline', connected: false },
  { id: 'oura', name: 'Oura Ring', icon: 'ellipse-outline', connected: false },
  { id: 'wear', name: 'Wear OS', icon: 'watch-outline', connected: false },
  { id: 'ghealth', name: 'Google Health Connect', icon: 'fitness-outline', connected: false },
  { id: 'ahealth', name: 'Apple Health', icon: 'medkit-outline', connected: false },
  { id: 'bp', name: 'Bluetooth BP Monitor', icon: 'heart-circle-outline', connected: false },
  { id: 'glc', name: 'CGM (Glucose Sensor)', icon: 'water-outline', connected: false },
  { id: 'scale', name: 'Smart Scale', icon: 'speedometer-outline', connected: false },
];

export const trackingConfig = [
  { id: 'steps', label: 'Steps', goal: '10,000', enabled: true, icon: 'walk-outline' },
  { id: 'hr', label: 'Heart Rate', goal: 'Auto', enabled: true, icon: 'heart-outline' },
  { id: 'sleep', label: 'Sleep', goal: '7 hrs', enabled: true, icon: 'moon-outline' },
  { id: 'kcal', label: 'Calories', goal: '2,000', enabled: true, icon: 'flame-outline' },
  { id: 'water', label: 'Hydration', goal: '2 L', enabled: false, icon: 'water-outline' },
  { id: 'stress', label: 'Stress', goal: 'Auto', enabled: false, icon: 'pulse-outline' },
];

export type Improvement = { id: string; label: string; delta: string; from: string; to: string; direction: 'up' | 'down'; icon: string; positive: boolean };
export const weeklyWins: Improvement[] = [
  { id: 'w1', label: 'Resting HR', delta: '-4 bpm', from: '76', to: '72', direction: 'down', icon: 'heart-outline', positive: true },
  { id: 'w2', label: 'Sleep quality', delta: '+8%', from: '72%', to: '80%', direction: 'up', icon: 'moon-outline', positive: true },
  { id: 'w3', label: 'Weekly steps', delta: '+12%', from: '52k', to: '58k', direction: 'up', icon: 'walk-outline', positive: true },
  { id: 'w4', label: 'Stress level', delta: '-14%', from: '42', to: '36', direction: 'down', icon: 'pulse-outline', positive: true },
];

export const sleepData = {
  hours: 7.4,
  quality: 82,
  deep: 1.4,
  rem: 1.8,
  light: 3.6,
  awake: 0.6,
  weeklyAvg: 7.1,
  weekTrend: [6.8, 7.2, 6.5, 7.1, 8.1, 7.4, 7.4],
  bedtime: '11:12 PM',
  wake: '6:36 AM',
};

export const stressData = {
  current: 36,
  level: 'Balanced' as const,
  weekAvg: 42,
  weekTrend: [58, 52, 48, 45, 40, 38, 36],
  restTime: 68,
  activeTime: 32,
  insight: 'Your stress dropped 14% this week — likely from consistent sleep and morning walks.',
};

export type Coach = { id: string; name: string; title: string; initials: string; color: string; nextAvailable: string };
export const myCoach: Coach = {
  id: 'c1',
  name: 'Dr. Meera Iyer',
  title: 'Certified Nutritionist & Wellness Coach',
  initials: 'MI',
  color: '#88A392',
  nextAvailable: 'Tomorrow 10:00 AM',
};

export type Session = { id: string; when: string; type: 'video' | 'call' | 'chat'; topic: string; duration: string; notes?: string; upcoming?: boolean };
export const coachSessions: Session[] = [
  { id: 's0', when: 'Tomorrow · 10:00 AM', type: 'video', topic: 'Weekly check-in & lab review', duration: '30 min', upcoming: true },
  { id: 's1', when: 'Nov 15, 2025', type: 'video', topic: 'Lipid panel action plan', duration: '45 min', notes: 'Discussed LDL rising trend. Agreed on 30-min brisk walks + oatmeal breakfast for 4 weeks. Follow-up lab in Feb.' },
  { id: 's2', when: 'Oct 30, 2025', type: 'chat', topic: 'Meal plan customisation', duration: '20 min', notes: 'Swapped afternoon snack to roasted chana. Removed dairy from evenings. Meera to send recipe deck.' },
  { id: 's3', when: 'Oct 12, 2025', type: 'call', topic: 'Onboarding & goal setting', duration: '30 min', notes: 'Set primary goals: reduce LDL <120, lose 4 kg in 12 weeks, sleep 7+ hrs.' },
];

export type HistoryEntry = { id: string; day: string; type: 'meal' | 'workout' | 'report' | 'coach' | 'habit'; title: string; meta: string; icon: string };
export const historyFeed: HistoryEntry[] = [
  { id: 'e1', day: 'Today', type: 'workout', title: 'Brisk Walk · 32 min', meta: '3.4 km · 148 kcal', icon: 'walk-outline' },
  { id: 'e2', day: 'Today', type: 'meal', title: 'Breakfast logged', meta: 'Oats with berries · 380 kcal', icon: 'restaurant-outline' },
  { id: 'e3', day: 'Yesterday', type: 'coach', title: 'Session with Dr. Meera', meta: '45 min · Lipid panel review', icon: 'chatbubbles-outline' },
  { id: 'e4', day: 'Yesterday', type: 'workout', title: 'Yoga Flow · 22 min', meta: 'Low intensity', icon: 'leaf-outline' },
  { id: 'e5', day: 'Yesterday', type: 'habit', title: 'All 6 habits complete', meta: '2-day streak begun', icon: 'checkmark-circle-outline' },
  { id: 'e6', day: 'Nov 12', type: 'report', title: 'Full Body Checkup uploaded', meta: '42 metrics extracted', icon: 'document-text-outline' },
  { id: 'e7', day: 'Nov 10', type: 'workout', title: 'Strength Training · 25 min', meta: 'Moderate intensity · 210 kcal', icon: 'barbell-outline' },
  { id: 'e8', day: 'Nov 9', type: 'meal', title: 'Dinner logged', meta: 'Grilled fish + veg · 460 kcal', icon: 'restaurant-outline' },
];

// 30-day heat-map (0-4 intensity per day)
export const monthHeatmap: number[] = [
  2, 3, 4, 3, 2, 1, 0,
  3, 4, 4, 3, 2, 3, 2,
  4, 3, 4, 4, 3, 2, 3,
  4, 4, 3, 4, 3, 4, 4,
  3, 4,
];

export const weekSummary = {
  days: [
    { label: 'Mon', habits: 6, meals: 4, workout: true, kcal: 1780 },
    { label: 'Tue', habits: 5, meals: 4, workout: true, kcal: 1820 },
    { label: 'Wed', habits: 6, meals: 3, workout: false, kcal: 1650 },
    { label: 'Thu', habits: 4, meals: 4, workout: true, kcal: 1900 },
    { label: 'Fri', habits: 3, meals: 2, workout: false, kcal: 1200, today: true },
    { label: 'Sat', habits: 0, meals: 0, workout: false, kcal: 0 },
    { label: 'Sun', habits: 0, meals: 0, workout: false, kcal: 0 },
  ],
  totals: { workouts: 3, mealsLogged: 17, habitsDone: 24, habitsTarget: 42 },
};

export type PlannedMeal = { slot: 'B' | 'L' | 'S' | 'D'; name: string; kcal: number; tag: string };
export type PlannedWorkout = { title: string; duration: string; intensity: string; icon: string } | null;
export type WeekDay = {
  key: string;
  label: string;
  short: string;
  date: number;
  isToday?: boolean;
  isRest?: boolean;
  meals: PlannedMeal[];
  workout: PlannedWorkout;
};

export const weekAheadPlan = {
  range: 'Nov 20 – Nov 26',
  focus: 'Heart-healthy · Low-GI',
  totals: { workouts: 5, avgKcal: 1720, waterTarget: '14 L' },
  days: [
    {
      key: 'w0', label: 'Wednesday', short: 'Wed', date: 20, isToday: true,
      meals: [
        { slot: 'B', name: 'Oats & berries', kcal: 380, tag: 'Fiber' },
        { slot: 'L', name: 'Quinoa bowl', kcal: 520, tag: 'Protein' },
        { slot: 'S', name: 'Roasted chana', kcal: 180, tag: 'Low-GI' },
        { slot: 'D', name: 'Steamed fish', kcal: 460, tag: 'Omega-3' },
      ],
      workout: { title: 'Brisk Walk', duration: '30 min', intensity: 'Low', icon: 'walk-outline' },
    },
    {
      key: 'w1', label: 'Thursday', short: 'Thu', date: 21,
      meals: [
        { slot: 'B', name: 'Vegetable poha', kcal: 340, tag: 'Fiber' },
        { slot: 'L', name: 'Grilled chicken salad', kcal: 480, tag: 'Protein' },
        { slot: 'S', name: 'Greek yogurt + nuts', kcal: 200, tag: 'Protein' },
        { slot: 'D', name: 'Dal + brown rice', kcal: 500, tag: 'Fiber' },
      ],
      workout: { title: 'Strength Training', duration: '25 min', intensity: 'Moderate', icon: 'barbell-outline' },
    },
    {
      key: 'w2', label: 'Friday', short: 'Fri', date: 22,
      meals: [
        { slot: 'B', name: 'Avocado toast', kcal: 400, tag: 'Healthy fats' },
        { slot: 'L', name: 'Palak paneer + roti', kcal: 550, tag: 'Iron' },
        { slot: 'S', name: 'Apple + almonds', kcal: 190, tag: 'Low-GI' },
        { slot: 'D', name: 'Grilled tofu stir-fry', kcal: 470, tag: 'Protein' },
      ],
      workout: { title: 'Yoga Flow', duration: '20 min', intensity: 'Low', icon: 'leaf-outline' },
    },
    {
      key: 'w3', label: 'Saturday', short: 'Sat', date: 23, isRest: true,
      meals: [
        { slot: 'B', name: 'Idli + sambar', kcal: 360, tag: 'Fiber' },
        { slot: 'L', name: 'Mixed veg thali', kcal: 580, tag: 'Balanced' },
        { slot: 'S', name: 'Buttermilk + fruit', kcal: 160, tag: 'Probiotic' },
        { slot: 'D', name: 'Vegetable soup + salad', kcal: 380, tag: 'Light' },
      ],
      workout: null,
    },
    {
      key: 'w4', label: 'Sunday', short: 'Sun', date: 24,
      meals: [
        { slot: 'B', name: 'Egg white omelette', kcal: 320, tag: 'Protein' },
        { slot: 'L', name: 'Chickpea curry + rice', kcal: 540, tag: 'Fiber' },
        { slot: 'S', name: 'Trail mix', kcal: 210, tag: 'Healthy fats' },
        { slot: 'D', name: 'Baked salmon + veg', kcal: 490, tag: 'Omega-3' },
      ],
      workout: { title: 'HIIT Cardio', duration: '15 min', intensity: 'High', icon: 'flash-outline' },
    },
    {
      key: 'w5', label: 'Monday', short: 'Mon', date: 25,
      meals: [
        { slot: 'B', name: 'Smoothie bowl', kcal: 350, tag: 'Antioxidants' },
        { slot: 'L', name: 'Lentil pasta', kcal: 510, tag: 'Fiber' },
        { slot: 'S', name: 'Handful of walnuts', kcal: 180, tag: 'Omega-3' },
        { slot: 'D', name: 'Chicken tikka + salad', kcal: 460, tag: 'Protein' },
      ],
      workout: { title: 'Brisk Walk', duration: '35 min', intensity: 'Low', icon: 'walk-outline' },
    },
    {
      key: 'w6', label: 'Tuesday', short: 'Tue', date: 26, isRest: true,
      meals: [
        { slot: 'B', name: 'Millet upma', kcal: 360, tag: 'Low-GI' },
        { slot: 'L', name: 'Rajma + brown rice', kcal: 560, tag: 'Protein' },
        { slot: 'S', name: 'Sprouts chaat', kcal: 170, tag: 'Fiber' },
        { slot: 'D', name: 'Grilled paneer bowl', kcal: 450, tag: 'Protein' },
      ],
      workout: null,
    },
  ] as WeekDay[],
};

export type QuestionOption = { label: string; value: string | number };
export type Question = { id: string; title: string; subtitle?: string; type: 'select' | 'number' | 'multiselect'; options?: QuestionOption[]; unit?: string };

export const questionnaire: Question[] = [
  { id: 'age', title: 'How old are you?', subtitle: 'Age is a key factor for both Diabetes and CVD risk.', type: 'number', unit: 'years' },
  { id: 'gender', title: 'Sex assigned at birth', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }] },
  { id: 'height', title: 'Your height', type: 'number', unit: 'cm' },
  { id: 'weight', title: 'Your weight', type: 'number', unit: 'kg' },
  { id: 'family', title: 'Family history of diabetes?', subtitle: 'Parents or siblings.', type: 'select', options: [{ label: 'No history', value: 'no' }, { label: 'One parent', value: 'one' }, { label: 'Both parents / sibling', value: 'both' }] },
  { id: 'activity', title: 'How active are you?', type: 'select', options: [{ label: 'Sedentary', value: 'sedentary' }, { label: 'Light activity', value: 'light' }, { label: 'Moderate', value: 'moderate' }, { label: 'Very active', value: 'active' }] },
  { id: 'smoke', title: 'Do you smoke?', type: 'select', options: [{ label: 'Never', value: 'never' }, { label: 'Former smoker', value: 'former' }, { label: 'Current smoker', value: 'current' }] },
  { id: 'bp', title: 'Do you have high blood pressure?', type: 'select', options: [{ label: 'No', value: 'no' }, { label: 'Borderline', value: 'border' }, { label: 'Yes, on medication', value: 'yes' }] },
];
