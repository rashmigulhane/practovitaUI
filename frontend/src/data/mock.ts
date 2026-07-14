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

export type Notif = { id: string; category: 'coach' | 'lab' | 'workout' | 'meal' | 'streak' | 'meds'; title: string; body: string; time: string; icon: string; unread: boolean };
export const notifications: Notif[] = [
  { id: 'n1', category: 'coach', title: 'Session tomorrow at 10 AM', body: 'Dr. Meera has confirmed your weekly check-in. Prepare your questions in the app.', time: '2 min ago', icon: 'chatbubbles-outline', unread: true },
  { id: 'n2', category: 'lab', title: 'New lab report processed', body: 'Full Body Checkup — 12 metrics extracted, 3 need attention.', time: '1 hr ago', icon: 'document-text-outline', unread: true },
  { id: 'n3', category: 'streak', title: '12-day streak! ', body: 'You\u2019ve hit your habit goal 12 days in a row. Keep going!', time: '3 hr ago', icon: 'flame-outline', unread: true },
  { id: 'n4', category: 'workout', title: 'Time to move', body: 'Your afternoon brisk walk is scheduled in 15 minutes.', time: 'Yesterday', icon: 'walk-outline', unread: false },
  { id: 'n5', category: 'meal', title: 'Log your dinner', body: 'Tap to check off your evening meal and complete today\u2019s plan.', time: 'Yesterday', icon: 'restaurant-outline', unread: false },
  { id: 'n6', category: 'meds', title: 'Medication reminder', body: 'Take your evening supplement.', time: '2 days ago', icon: 'medical-outline', unread: false },
];

export type NearbyDevice = { id: string; name: string; brand: string; signal: number; icon: string };
export const nearbyDevices: NearbyDevice[] = [
  { id: 'nd1', name: 'Apple Watch Series 9', brand: 'Apple', signal: 92, icon: 'watch-outline' },
  { id: 'nd2', name: 'Garmin Venu 3', brand: 'Garmin', signal: 78, icon: 'watch-outline' },
  { id: 'nd3', name: 'Oura Ring Gen 4', brand: 'Oura', signal: 65, icon: 'ellipse-outline' },
  { id: 'nd4', name: 'Samsung Galaxy Watch 7', brand: 'Samsung', signal: 54, icon: 'watch-outline' },
];

export const wearableSettings = {
  syncFrequency: 'auto' as 'auto' | 'hourly' | 'manual',
  metrics: [
    { id: 'steps', label: 'Steps', goal: 10000, unit: 'steps', enabled: true, notify: true, icon: 'walk-outline' },
    { id: 'hr', label: 'Heart Rate', goal: 0, unit: 'auto', enabled: true, notify: true, icon: 'heart-outline' },
    { id: 'sleep', label: 'Sleep', goal: 7, unit: 'hrs', enabled: true, notify: false, icon: 'moon-outline' },
    { id: 'kcal', label: 'Calories', goal: 2000, unit: 'kcal', enabled: true, notify: false, icon: 'flame-outline' },
    { id: 'water', label: 'Hydration', goal: 2, unit: 'L', enabled: false, notify: false, icon: 'water-outline' },
    { id: 'stress', label: 'Stress', goal: 0, unit: 'auto', enabled: false, notify: false, icon: 'pulse-outline' },
  ],
};

export type Reading = { date: string; iso: string; value: number; reportId: string; reportLabel: string };
export type MetricTrend = {
  id: string;
  name: string;
  category: string;
  unit: string;
  low: number;
  high: number;
  optimalLabel: string;
  explanation: string;
  readings: Reading[];
};

export const metricTrends: Record<string, MetricTrend> = {
  glc: {
    id: 'glc', name: 'Fasting Glucose', category: 'Diabetes', unit: 'mg/dL',
    low: 70, high: 99, optimalLabel: '70 – 99 mg/dL',
    explanation: 'Measured after 8+ hours of fasting. Consistently above 100 suggests pre-diabetes; above 126 on two occasions is diabetes.',
    readings: [
      { date: 'Nov 12, 2025', iso: '2025-11-12', value: 108, reportId: 'r1', reportLabel: 'Full Body Checkup' },
      { date: 'Aug 03, 2025', iso: '2025-08-03', value: 105, reportId: 'r2', reportLabel: 'Lipid Profile' },
      { date: 'Feb 18, 2025', iso: '2025-02-18', value: 101, reportId: 'r3', reportLabel: 'Annual Health Check' },
      { date: 'Oct 22, 2024', iso: '2024-10-22', value: 95, reportId: 'r4', reportLabel: 'Half-yearly checkup' },
      { date: 'Apr 08, 2024', iso: '2024-04-08', value: 92, reportId: 'r5', reportLabel: 'Diabetes screening' },
      { date: 'Sep 15, 2023', iso: '2023-09-15', value: 89, reportId: 'r6', reportLabel: 'Annual Health Check' },
    ],
  },
  hba1c: {
    id: 'hba1c', name: 'HbA1c', category: 'Diabetes', unit: '%',
    low: 4.0, high: 5.7, optimalLabel: 'Below 5.7 %',
    explanation: 'Reflects your average blood glucose over the past 3 months. 5.7–6.4% is pre-diabetes; 6.5% and above is diabetes.',
    readings: [
      { date: 'Nov 12, 2025', iso: '2025-11-12', value: 5.9, reportId: 'r1', reportLabel: 'Full Body Checkup' },
      { date: 'Aug 03, 2025', iso: '2025-08-03', value: 5.8, reportId: 'r2', reportLabel: 'Lipid Profile' },
      { date: 'Feb 18, 2025', iso: '2025-02-18', value: 5.6, reportId: 'r3', reportLabel: 'Annual Health Check' },
      { date: 'Oct 22, 2024', iso: '2024-10-22', value: 5.5, reportId: 'r4', reportLabel: 'Half-yearly checkup' },
      { date: 'Apr 08, 2024', iso: '2024-04-08', value: 5.4, reportId: 'r5', reportLabel: 'Diabetes screening' },
      { date: 'Sep 15, 2023', iso: '2023-09-15', value: 5.3, reportId: 'r6', reportLabel: 'Annual Health Check' },
    ],
  },
  ldl: {
    id: 'ldl', name: 'LDL Cholesterol', category: 'Lipids', unit: 'mg/dL',
    low: 0, high: 100, optimalLabel: 'Below 100 mg/dL',
    explanation: 'The "bad" cholesterol. Diet, exercise and weight all impact LDL. Statins may be considered above 190 or with cardiac risk factors.',
    readings: [
      { date: 'Nov 12, 2025', iso: '2025-11-12', value: 148, reportId: 'r1', reportLabel: 'Full Body Checkup' },
      { date: 'Aug 03, 2025', iso: '2025-08-03', value: 144, reportId: 'r2', reportLabel: 'Lipid Profile' },
      { date: 'Feb 18, 2025', iso: '2025-02-18', value: 138, reportId: 'r3', reportLabel: 'Annual Health Check' },
      { date: 'Oct 22, 2024', iso: '2024-10-22', value: 130, reportId: 'r4', reportLabel: 'Half-yearly checkup' },
      { date: 'Apr 08, 2024', iso: '2024-04-08', value: 122, reportId: 'r5', reportLabel: 'Diabetes screening' },
      { date: 'Sep 15, 2023', iso: '2023-09-15', value: 118, reportId: 'r6', reportLabel: 'Annual Health Check' },
    ],
  },
  hb: {
    id: 'hb', name: 'Hemoglobin', category: 'CBC', unit: 'g/dL',
    low: 13.5, high: 17.5, optimalLabel: '13.5 – 17.5 g/dL',
    explanation: 'Carries oxygen in your blood. Low values may indicate anemia; high values are less common and can indicate dehydration.',
    readings: [
      { date: 'Nov 12, 2025', iso: '2025-11-12', value: 14.2, reportId: 'r1', reportLabel: 'Full Body Checkup' },
      { date: 'Aug 03, 2025', iso: '2025-08-03', value: 14.1, reportId: 'r2', reportLabel: 'Lipid Profile' },
      { date: 'Feb 18, 2025', iso: '2025-02-18', value: 14.0, reportId: 'r3', reportLabel: 'Annual Health Check' },
      { date: 'Oct 22, 2024', iso: '2024-10-22', value: 13.8, reportId: 'r4', reportLabel: 'Half-yearly checkup' },
      { date: 'Apr 08, 2024', iso: '2024-04-08', value: 13.6, reportId: 'r5', reportLabel: 'Diabetes screening' },
    ],
  },
};

export type RiskCheckpoint = {
  id: string;
  label: string;
  sublabel: string;
  date: string;
  iso: string;
  diabetes: number;
  cvd: number;
  event: 'questionnaire' | 'report';
  reportId?: string;
};

export type RiskDriver = {
  metric: string;
  from: string;
  to: string;
  unit?: string;
  impact: 'up' | 'down' | 'neutral';
  affects: 'diabetes' | 'cvd' | 'both';
};

export const riskHistory: RiskCheckpoint[] = [
  { id: 'rh0', label: 'Baseline', sublabel: 'From your questionnaire', date: 'Sep 2023', iso: '2023-09-01', diabetes: 52, cvd: 28, event: 'questionnaire' },
  { id: 'rh1', label: 'First report', sublabel: 'Annual Health Check', date: 'Sep 15, 2023', iso: '2023-09-15', diabetes: 48, cvd: 26, event: 'report', reportId: 'r6' },
  { id: 'rh2', label: 'Second report', sublabel: 'Diabetes screening', date: 'Apr 08, 2024', iso: '2024-04-08', diabetes: 44, cvd: 22, event: 'report', reportId: 'r5' },
  { id: 'rh3', label: 'Mid-year check', sublabel: 'Half-yearly checkup', date: 'Oct 22, 2024', iso: '2024-10-22', diabetes: 40, cvd: 20, event: 'report', reportId: 'r4' },
  { id: 'rh4', label: 'Annual review', sublabel: 'Annual Health Check', date: 'Feb 18, 2025', iso: '2025-02-18', diabetes: 36, cvd: 18, event: 'report', reportId: 'r3' },
  { id: 'rh5', label: 'Lipid update', sublabel: 'Lipid Profile', date: 'Aug 03, 2025', iso: '2025-08-03', diabetes: 35, cvd: 19, event: 'report', reportId: 'r2' },
  { id: 'rh6', label: 'Current', sublabel: 'Full Body Checkup', date: 'Nov 12, 2025', iso: '2025-11-12', diabetes: 34, cvd: 18, event: 'report', reportId: 'r1' },
];

export const riskDrivers: RiskDriver[] = [
  { metric: 'HbA1c', from: '5.6%', to: '5.9%', impact: 'up', affects: 'diabetes' },
  { metric: 'Fasting Glucose', from: '95 mg/dL', to: '108 mg/dL', impact: 'up', affects: 'diabetes' },
  { metric: 'Resting HR', from: '76 bpm', to: '72 bpm', impact: 'down', affects: 'cvd' },
  { metric: 'HDL', from: '38 mg/dL', to: '42 mg/dL', impact: 'down', affects: 'cvd' },
  { metric: 'BMI', from: '28.2', to: '27.4', impact: 'down', affects: 'both' },
  { metric: 'LDL', from: '138 mg/dL', to: '148 mg/dL', impact: 'up', affects: 'cvd' },
];

/* ---------- Weekly Meal Options ---------- */
export type MealOption = {
  id: string;
  name: string;
  kcal: number;
  tag: string;
  cuisine: string;
  prepMin: number;
  ingredients: string[];
  protein: number;
  carbs: number;
  fat: number;
};

export const mealOptions: Record<'breakfast' | 'lunch' | 'snack' | 'dinner', MealOption[]> = {
  breakfast: [
    { id: 'b1', name: 'Oats with berries & flax', kcal: 380, tag: 'Fiber', cuisine: 'Continental', prepMin: 10, protein: 12, carbs: 58, fat: 10, ingredients: ['Rolled oats 1/2 cup', 'Mixed berries', 'Flax seed 1 tbsp', 'Almond milk', 'Honey 1 tsp'] },
    { id: 'b2', name: 'Vegetable poha', kcal: 340, tag: 'Fiber', cuisine: 'Indian', prepMin: 15, protein: 8, carbs: 62, fat: 6, ingredients: ['Poha 1 cup', 'Onion, peas', 'Turmeric', 'Curry leaves', 'Peanuts'] },
    { id: 'b3', name: 'Egg white omelette', kcal: 320, tag: 'Protein', cuisine: 'Continental', prepMin: 10, protein: 22, carbs: 20, fat: 12, ingredients: ['Egg whites x4', 'Spinach', 'Whole wheat toast', 'Cottage cheese'] },
    { id: 'b4', name: 'Millet upma', kcal: 360, tag: 'Low-GI', cuisine: 'Indian', prepMin: 15, protein: 10, carbs: 60, fat: 8, ingredients: ['Foxtail millet', 'Mixed veg', 'Mustard seeds', 'Curry leaves'] },
    { id: 'b5', name: 'Smoothie bowl', kcal: 350, tag: 'Antioxidants', cuisine: 'Continental', prepMin: 8, protein: 14, carbs: 52, fat: 9, ingredients: ['Frozen banana', 'Berries', 'Greek yogurt', 'Chia seeds', 'Granola'] },
    { id: 'b6', name: 'Idli + sambar', kcal: 360, tag: 'Fiber', cuisine: 'South Indian', prepMin: 20, protein: 11, carbs: 65, fat: 5, ingredients: ['Idli x4', 'Sambar', 'Coconut chutney'] },
    { id: 'b7', name: 'Avocado toast', kcal: 400, tag: 'Healthy fats', cuisine: 'Continental', prepMin: 8, protein: 12, carbs: 42, fat: 20, ingredients: ['Multigrain bread x2', 'Avocado 1/2', 'Egg', 'Chilli flakes'] },
  ],
  lunch: [
    { id: 'l1', name: 'Grilled chicken salad', kcal: 480, tag: 'Protein', cuisine: 'Continental', prepMin: 20, protein: 42, carbs: 22, fat: 20, ingredients: ['Chicken breast 120g', 'Mixed greens', 'Cherry tomato', 'Olive oil', 'Lemon'] },
    { id: 'l2', name: 'Quinoa bowl', kcal: 520, tag: 'Protein', cuisine: 'Mediterranean', prepMin: 25, protein: 22, carbs: 68, fat: 16, ingredients: ['Quinoa 1 cup', 'Roasted veg', 'Chickpeas', 'Feta', 'Tahini'] },
    { id: 'l3', name: 'Palak paneer + roti', kcal: 550, tag: 'Iron', cuisine: 'Indian', prepMin: 30, protein: 24, carbs: 55, fat: 22, ingredients: ['Palak', 'Paneer 100g', '2 whole wheat rotis'] },
    { id: 'l4', name: 'Dal + brown rice', kcal: 500, tag: 'Fiber', cuisine: 'Indian', prepMin: 25, protein: 20, carbs: 78, fat: 8, ingredients: ['Yellow dal', 'Brown rice 1 cup', 'Salad', 'Curd'] },
    { id: 'l5', name: 'Chickpea curry + rice', kcal: 540, tag: 'Fiber', cuisine: 'Indian', prepMin: 30, protein: 22, carbs: 82, fat: 10, ingredients: ['Chana masala', 'Brown rice', 'Onion salad'] },
    { id: 'l6', name: 'Mixed veg thali', kcal: 580, tag: 'Balanced', cuisine: 'Indian', prepMin: 35, protein: 20, carbs: 76, fat: 18, ingredients: ['Roti x2', 'Dal', 'Sabzi', 'Rice', 'Curd', 'Salad'] },
    { id: 'l7', name: 'Lentil pasta', kcal: 510, tag: 'Fiber', cuisine: 'Continental', prepMin: 20, protein: 24, carbs: 68, fat: 12, ingredients: ['Lentil pasta', 'Marinara', 'Basil', 'Parmesan'] },
    { id: 'l8', name: 'Rajma + brown rice', kcal: 560, tag: 'Protein', cuisine: 'Indian', prepMin: 40, protein: 22, carbs: 82, fat: 10, ingredients: ['Kidney beans', 'Brown rice', 'Onion tomato gravy'] },
  ],
  snack: [
    { id: 's1', name: 'Roasted chana', kcal: 180, tag: 'Low-GI', cuisine: 'Indian', prepMin: 2, protein: 10, carbs: 22, fat: 4, ingredients: ['Roasted chana 30g', 'Chaat masala'] },
    { id: 's2', name: 'Greek yogurt + nuts', kcal: 200, tag: 'Protein', cuisine: 'Continental', prepMin: 2, protein: 14, carbs: 12, fat: 10, ingredients: ['Greek yogurt 150g', 'Almonds & walnuts'] },
    { id: 's3', name: 'Apple + almonds', kcal: 190, tag: 'Low-GI', cuisine: 'Any', prepMin: 1, protein: 6, carbs: 22, fat: 10, ingredients: ['Apple 1', 'Almonds 10-12'] },
    { id: 's4', name: 'Trail mix', kcal: 210, tag: 'Healthy fats', cuisine: 'Continental', prepMin: 1, protein: 8, carbs: 18, fat: 14, ingredients: ['Almonds', 'Walnuts', 'Dark chocolate chips', 'Cranberries'] },
    { id: 's5', name: 'Sprouts chaat', kcal: 170, tag: 'Fiber', cuisine: 'Indian', prepMin: 5, protein: 12, carbs: 22, fat: 3, ingredients: ['Moong sprouts', 'Onion tomato', 'Lemon', 'Chaat masala'] },
    { id: 's6', name: 'Buttermilk + fruit', kcal: 160, tag: 'Probiotic', cuisine: 'Indian', prepMin: 3, protein: 6, carbs: 24, fat: 3, ingredients: ['Buttermilk 1 glass', 'Seasonal fruit'] },
  ],
  dinner: [
    { id: 'd1', name: 'Steamed fish', kcal: 460, tag: 'Omega-3', cuisine: 'Continental', prepMin: 25, protein: 42, carbs: 20, fat: 18, ingredients: ['Salmon/rohu 150g', 'Steamed veg', 'Lemon herbs'] },
    { id: 'd2', name: 'Grilled tofu stir-fry', kcal: 470, tag: 'Protein', cuisine: 'Asian', prepMin: 20, protein: 26, carbs: 42, fat: 20, ingredients: ['Tofu 150g', 'Broccoli', 'Bell peppers', 'Soy sauce', 'Ginger'] },
    { id: 'd3', name: 'Chicken tikka + salad', kcal: 460, tag: 'Protein', cuisine: 'Indian', prepMin: 30, protein: 40, carbs: 20, fat: 22, ingredients: ['Chicken tikka 150g', 'Green salad', 'Mint chutney'] },
    { id: 'd4', name: 'Vegetable soup + salad', kcal: 380, tag: 'Light', cuisine: 'Continental', prepMin: 25, protein: 14, carbs: 42, fat: 12, ingredients: ['Minestrone soup', 'Greek salad', 'Whole grain bread'] },
    { id: 'd5', name: 'Baked salmon + veg', kcal: 490, tag: 'Omega-3', cuisine: 'Continental', prepMin: 30, protein: 40, carbs: 22, fat: 22, ingredients: ['Salmon 150g', 'Asparagus', 'Sweet potato'] },
    { id: 'd6', name: 'Grilled paneer bowl', kcal: 450, tag: 'Protein', cuisine: 'Indian', prepMin: 25, protein: 26, carbs: 30, fat: 22, ingredients: ['Paneer tikka 120g', 'Sautéed veg', 'Mint chutney'] },
  ],
};

/* ---------- Weekly Workout Schedule ---------- */
export type Exercise = { name: string; sets?: number; reps?: string; duration?: string; rest?: string; notes?: string };
export type DetailedWorkout = {
  title: string;
  duration: string;
  intensity: 'Low' | 'Moderate' | 'High';
  icon: string;
  focus: string;
  howto: string;
  exercises: Exercise[];
};

export type WeeklyWorkoutDay = {
  id: string;
  day: string;
  short: string;
  date: number;
  isToday?: boolean;
  isRest?: boolean;
  workout: DetailedWorkout | null;
};

export const weeklyWorkoutSchedule: WeeklyWorkoutDay[] = [
  { id: 'ww0', day: 'Wednesday', short: 'Wed', date: 20, isToday: true, workout: {
    title: 'Brisk Walk', duration: '30 min', intensity: 'Low', icon: 'walk-outline', focus: 'Cardio · Zone 2',
    howto: 'Walk at a pace where you can talk but not sing. Keep heart rate in 108–128 bpm range. Warm up 5 min, main effort 20 min, cool down 5 min.',
    exercises: [
      { name: 'Warm-up walk', duration: '5 min', notes: 'Slow, easy pace' },
      { name: 'Main effort', duration: '20 min', notes: 'Zone 2 · 108-128 bpm' },
      { name: 'Cool-down', duration: '5 min', notes: 'Slow down gradually' },
    ],
  }},
  { id: 'ww1', day: 'Thursday', short: 'Thu', date: 21, workout: {
    title: 'Strength Training', duration: '25 min', intensity: 'Moderate', icon: 'barbell-outline', focus: 'Lower body',
    howto: '2 rounds of the circuit below. Rest 60 sec between exercises, 90 sec between rounds. Keep form strict — quality over speed.',
    exercises: [
      { name: 'Bodyweight squats', sets: 2, reps: '15 reps', rest: '60 sec' },
      { name: 'Reverse lunges', sets: 2, reps: '10 each leg', rest: '60 sec' },
      { name: 'Glute bridges', sets: 2, reps: '15 reps', rest: '60 sec' },
      { name: 'Standing calf raises', sets: 2, reps: '20 reps', rest: '60 sec' },
      { name: 'Plank hold', sets: 2, duration: '30 sec', rest: '60 sec' },
    ],
  }},
  { id: 'ww2', day: 'Friday', short: 'Fri', date: 22, workout: {
    title: 'Yoga Flow', duration: '20 min', intensity: 'Low', icon: 'leaf-outline', focus: 'Mobility · Recovery',
    howto: 'Move slowly through each pose, breathing 5 breaths per pose. Focus on hip openers and spinal mobility. End with 3-min savasana.',
    exercises: [
      { name: 'Sun salutation A', sets: 3, reps: '1 round', notes: 'Full flow' },
      { name: 'Warrior II hold', duration: '30 sec each side' },
      { name: 'Triangle pose', duration: '30 sec each side' },
      { name: 'Pigeon pose', duration: '60 sec each side' },
      { name: 'Seated forward fold', duration: '90 sec' },
      { name: 'Savasana', duration: '3 min' },
    ],
  }},
  { id: 'ww3', day: 'Saturday', short: 'Sat', date: 23, isRest: true, workout: null },
  { id: 'ww4', day: 'Sunday', short: 'Sun', date: 24, workout: {
    title: 'HIIT Cardio', duration: '15 min', intensity: 'High', icon: 'flash-outline', focus: 'Fat burn',
    howto: '20 sec work / 40 sec rest for 12 rounds. Alternate between the 4 exercises below. Push hard during work intervals.',
    exercises: [
      { name: 'Jumping jacks', duration: '20 sec on / 40 rest' },
      { name: 'Mountain climbers', duration: '20 sec on / 40 rest' },
      { name: 'Squat jumps', duration: '20 sec on / 40 rest' },
      { name: 'High knees', duration: '20 sec on / 40 rest' },
    ],
  }},
  { id: 'ww5', day: 'Monday', short: 'Mon', date: 25, workout: {
    title: 'Brisk Walk', duration: '35 min', intensity: 'Low', icon: 'walk-outline', focus: 'Cardio · Zone 2',
    howto: 'Slightly longer walk than Wednesday. Try a new route to keep it engaging. Include 3 x 1-min pickups if feeling strong.',
    exercises: [
      { name: 'Warm-up walk', duration: '5 min' },
      { name: 'Main effort', duration: '25 min', notes: 'Add 3 x 1-min pickups if strong' },
      { name: 'Cool-down', duration: '5 min' },
    ],
  }},
  { id: 'ww6', day: 'Tuesday', short: 'Tue', date: 26, isRest: true, workout: null },
];

export const alternativeWorkouts: DetailedWorkout[] = [
  { title: 'Swimming', duration: '30 min', intensity: 'Moderate', icon: 'water-outline', focus: 'Full-body cardio', howto: 'Freestyle or breast stroke. Alternate easy and moderate laps.', exercises: [] },
  { title: 'Cycling', duration: '40 min', intensity: 'Moderate', icon: 'bicycle-outline', focus: 'Cardio', howto: 'Flat route, steady pace. Keep cadence 70-90 rpm.', exercises: [] },
  { title: 'Resistance Bands', duration: '20 min', intensity: 'Moderate', icon: 'fitness-outline', focus: 'Full body', howto: '10 exercises, 12 reps each, 2 rounds.', exercises: [] },
  { title: 'Pilates', duration: '25 min', intensity: 'Low', icon: 'body-outline', focus: 'Core · Mobility', howto: 'Follow along video for core-focused mat pilates.', exercises: [] },
  { title: 'Dance Cardio', duration: '20 min', intensity: 'Moderate', icon: 'musical-notes-outline', focus: 'Fun cardio', howto: 'Zumba-style workout. Fun way to hit cardio goals.', exercises: [] },
];

/* ---------- Weekly Habits ---------- */
export type WeeklyHabit = {
  id: string;
  title: string;
  target: string;
  frequency: string;
  weekProgress: boolean[];
  icon: string;
  category: 'diet' | 'workout' | 'wellness';
};

export const weeklyHabits: WeeklyHabit[] = [
  { id: 'wh1', title: 'Drink 2L water daily', target: '2 L', frequency: 'Daily', weekProgress: [true, true, true, true, false, false, false], icon: 'water-outline', category: 'wellness' },
  { id: 'wh2', title: 'Morning walk', target: '30 min', frequency: '5×/week', weekProgress: [true, true, false, true, false, false, false], icon: 'walk-outline', category: 'workout' },
  { id: 'wh3', title: 'Eat 5 servings fruit/veg', target: '5×/day', frequency: 'Daily', weekProgress: [true, false, true, true, false, false, false], icon: 'nutrition-outline', category: 'diet' },
  { id: 'wh4', title: 'Mindful breathing', target: '10 min', frequency: '3×/week', weekProgress: [true, false, false, true, false, false, false], icon: 'leaf-outline', category: 'wellness' },
  { id: 'wh5', title: 'Sleep 7+ hours', target: '7 h', frequency: 'Daily', weekProgress: [true, true, false, true, false, false, false], icon: 'moon-outline', category: 'wellness' },
  { id: 'wh6', title: 'Take medication', target: '1×/day', frequency: 'Daily', weekProgress: [true, true, true, true, true, false, false], icon: 'medical-outline', category: 'wellness' },
  { id: 'wh7', title: 'No sugar/soda', target: 'Zero', frequency: 'Daily', weekProgress: [true, true, true, false, false, false, false], icon: 'ban-outline', category: 'diet' },
];

/* ---------- Plan Preferences ---------- */
export type PlanPreferences = {
  dietType: 'veg' | 'nonveg' | 'vegan' | 'pescatarian' | 'eggetarian';
  cuisines: string[];
  dislikes: string[];
  workoutTypes: string[];
  equipment: 'none' | 'basic' | 'full-gym';
  duration: '15' | '30' | '45' | '60';
  workoutDays: string[];
  timing: 'morning' | 'afternoon' | 'evening';
};

export const defaultPreferences: PlanPreferences = {
  dietType: 'nonveg',
  cuisines: ['Indian', 'Continental'],
  dislikes: [],
  workoutTypes: ['Walking', 'Yoga'],
  equipment: 'none',
  duration: '30',
  workoutDays: ['Mon', 'Wed', 'Fri', 'Sun'],
  timing: 'morning',
};

export const weekMeta = {
  range: 'Nov 20 – Nov 26',
  focus: 'Heart-healthy · Low-GI',
  weekNum: 47,
  avgKcal: 1720,
  workoutsCount: 5,
  restDays: 2,
};
