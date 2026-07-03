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
