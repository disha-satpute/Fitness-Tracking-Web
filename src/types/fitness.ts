export type StatusTag = 'CONFIRMED' | 'ESTIMATED' | 'NOT_AVAILABLE' | 'CONFLICTING';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  ageStatus: StatusTag;
  gender: string;
  heightFt: number;
  heightCmInferred: number;
  currentWeight: number; // 84 kg on 12 Nov 2026
  startingWeight: number; // ~90 kg
  previousRecentWeight: string; // "82–83 kg"
  previousWeight: number; // 80 kg
  targetWeight: number | null; // null => Not Available
  bodyFatPct: number | null; // Not Available
  muscleMass: number | null; // Not Available
  bodyType: string; // "Not Confirmed"
  gymExperienceClaim: string; // e.g. "9 months consistent (Claims: June 2025 vs 17 Nov 2025)"
  fitnessLevel: string; // "Intermediate (Inferred)"
  primaryGoal: string; // "Body recomposition / cutting while maintaining muscle & size"
}

export interface WeightRecord {
  id: string;
  date: string;
  periodLabel: string;
  weight: number;
  weightRangeMax?: number;
  status: StatusTag;
  notes: string;
}

export interface CalorieProfile {
  cuttingTarget: number; // 1940
  userStatedMaintenance: number; // 2200
  appEstimatedMaintenance: number; // 3000
  appBMR: number; // 2852
  plausibleBMR: number; // 1840
  proteinTargetMin: number; // 130
  proteinTargetMax: number; // 150
  waterTargetMin: number; // 3.0
  waterTargetMax: number; // 4.0
  stepsTargetMin: number; // 7500
  stepsTargetMax: number; // 10000
}

export interface GymLocation {
  id: string;
  name: string;
  period: string;
  maxDumbbell: string;
  smithMachine: boolean;
  shoulderPressMachine: boolean;
  notes: string;
}

export interface SetEntry {
  setNumber: number;
  weight: number | null; // null for BW or NA
  unit: 'kg' | 'lb' | 'assistance_lb' | 'bodyweight';
  reps: number | null;
  rir?: number | null;
  rpe?: number | null;
  setType: 'warmup' | 'working' | 'drop' | 'failure' | 'pr' | 'backoff' | 'assisted';
  completed: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles?: string[];
  equipment: string;
  gymId: string;
  sets: SetEntry[];
  historicalBest?: string;
  lastPerformance?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  dayName: string;
  splitName: string;
  gymId: string;
  activeTrainingMin?: number;
  totalGymMin?: number;
  energyLevel?: number; // 1-10
  recoveryLevel?: number; // 1-10
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  rawOrCooked: 'raw' | 'cooked' | 'na';
  affordablePillar?: boolean;
  notes?: string;
}

export interface DailyNutritionLog {
  id: string;
  date: string;
  targetCalories: number;
  targetProtein: number;
  waterIntakeL: number;
  waterTargetL: number;
  meals: {
    mealName: 'Breakfast' | 'Lunch' | 'Post-Workout' | 'Dinner' | 'Snacks';
    items: FoodItem[];
  }[];
  notes?: string;
  estimatedStatus?: StatusTag;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  muscle: string;
  recordValue: string;
  rawWeightKg: number;
  reps: number | string;
  date: string;
  gymId: string;
  gymName: string;
  romContext: string; // e.g. "Half ROM context", "Full ROM", "Conventional", "Sumo"
  isPR: boolean;
  notes: string;
}

export interface RecoveryLog {
  id: string;
  date: string;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  soreness: number; // 1-10
  fatigue: number; // 1-10
  energy: number; // 1-10
  readiness: number; // 1-10
  restDay: boolean;
  sleepNotes?: string;
  sorenessNotes?: string;
}

export interface SupplementEntry {
  id: string;
  name: string;
  brand: string;
  dose: string;
  frequency: string;
  time: string;
  status: 'Daily Active' | 'Variable' | 'Historical/Pre-workout' | 'Medical/Doctor Advised';
  notes: string;
}

export interface ProgressPhotoRecord {
  id: string;
  date: string;
  bodyweight: number;
  view: 'Front' | 'Back' | 'Side' | 'Other';
  pose: 'Relaxed' | 'Flexed';
  lighting: string;
  focusMuscles: string[];
  notes: string;
  photoPlaceholder: string;
}

export interface MeasurementRecord {
  id: string;
  date: string;
  waistCm: number | null;
  chestCm: number | null;
  shouldersCm: number | null;
  bicepsLeftCm: number | null;
  bicepsRightCm: number | null;
  forearmsCm: number | null;
  thighsCm: number | null;
  calvesCm: number | null;
  bodyFatPct: number | null;
  muscleMassKg: number | null;
  notes: string;
}
