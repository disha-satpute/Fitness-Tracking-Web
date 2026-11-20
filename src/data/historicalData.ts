import {
  UserProfile,
  WeightRecord,
  CalorieProfile,
  GymLocation,
  PersonalRecord,
  DailyNutritionLog,
  RecoveryLog,
  SupplementEntry,
  ProgressPhotoRecord,
  MeasurementRecord
} from '../types/fitness';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_historical_01',
  name: 'Athlete Profile (Recomposition Cut)',
  age: 24,
  ageStatus: 'CONFIRMED',
  gender: 'Male',
  heightFt: 5.9,
  heightCmInferred: 180,
  currentWeight: 84, // Explicit latest: 12 Nov 2026
  startingWeight: 90, // Historical starting point
  previousRecentWeight: '82–83 kg (31 Oct / early Nov 2026)',
  previousWeight: 80,
  targetWeight: null, // NOT AVAILABLE - No fixed weight established
  bodyFatPct: null, // NOT AVAILABLE
  muscleMass: null, // NOT AVAILABLE
  bodyType: 'Not Confirmed',
  gymExperienceClaim: '9 months consistent; conflicting start claims: June 2025 vs 17 Nov 2025',
  fitnessLevel: 'Intermediate (Inferred - heavy compound load, 6-day split, RIR aware)',
  primaryGoal: 'Body recomposition / cutting while maintaining muscle, size & strength'
};

export const INITIAL_CALORIE_PROFILE: CalorieProfile = {
  cuttingTarget: 1940,
  userStatedMaintenance: 2200,
  appEstimatedMaintenance: 3000,
  appBMR: 2852,
  plausibleBMR: 1840,
  proteinTargetMin: 130,
  proteinTargetMax: 150,
  waterTargetMin: 3.0,
  waterTargetMax: 4.0,
  stepsTargetMin: 7500,
  stepsTargetMax: 10000
};

export const HISTORICAL_WEIGHT_RECORDS: WeightRecord[] = [
  {
    id: 'w-1',
    date: '2025-11-17',
    periodLabel: 'Gym-Start Period',
    weight: 90.0,
    status: 'ESTIMATED',
    notes: 'User stated gym journey began around ~90 kg.'
  },
  {
    id: 'w-2',
    date: '2026-04-15',
    periodLabel: '~5 months after start',
    weight: 82.0,
    status: 'ESTIMATED',
    notes: 'User described ~8 kg loss.'
  },
  {
    id: 'w-3',
    date: '2026-06-20',
    periodLabel: '~7 months after start',
    weight: 80.0,
    status: 'ESTIMATED',
    notes: 'Historical low: User described ~10 kg total loss from ~90 kg.'
  },
  {
    id: 'w-4',
    date: '2026-10-31',
    periodLabel: 'Late October 2026',
    weight: 82.5,
    weightRangeMax: 83.0,
    status: 'CONFIRMED',
    notes: 'Recent physique discussion: weight sitting around 82–83 kg.'
  },
  {
    id: 'w-5',
    date: '2026-11-07',
    periodLabel: 'Early November 2026',
    weight: 82.5,
    weightRangeMax: 83.0,
    status: 'CONFIRMED',
    notes: 'Photo/body assessment context.'
  },
  {
    id: 'w-6',
    date: '2026-11-12',
    periodLabel: 'Latest Explicit Update',
    weight: 84.0,
    status: 'CONFIRMED',
    notes: 'Weight increased from 80 kg to 84 kg. Simultaneous fat reduction & muscle gain recomposition context.'
  }
];

export const GYMS: GymLocation[] = [
  {
    id: 'gym-main',
    name: 'Gym',
    period: 'Current',
    maxDumbbell: '40 kg',
    smithMachine: false,
    shoulderPressMachine: false,
    notes: 'Primary training facility'
  }
];

export const HISTORICAL_PRS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseName: 'Incline Dumbbell Press',
    muscle: 'Chest',
    recordValue: '30 kg each × 9 (+1 assisted)',
    rawWeightKg: 30,
    reps: '9 + 1 assisted',
    date: '2026-10-13',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'First 9 reps unassisted; slight spotter support on rep 10',
    isPR: true,
    notes: 'Progressed from 22.5 kg × 10 -> 30 kg × 9 -> 30 kg × 9+1.',
    history: [
      { id: 'h-1-1', date: '2026-08-15', weightKg: 22.5, reps: '10', notes: 'Baseline form' },
      { id: 'h-1-2', date: '2026-09-20', weightKg: 27.5, reps: '8', notes: 'Solid control' },
      { id: 'h-1-3', date: '2026-10-02', weightKg: 30, reps: '9', notes: '9 clean unassisted' }
    ]
  },
  {
    id: 'pr-2',
    exerciseName: 'Leg Press (45°)',
    muscle: 'Quads',
    recordValue: '260 kg × 7–8 (Half ROM)',
    rawWeightKg: 260,
    reps: '7-8',
    date: '2026-10-18',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Half Range of Motion',
    isPR: true,
    notes: '260 kg × 7-8 PR. Working set performance: 250 kg × 7 @ 2 RIR.',
    history: [
      { id: 'h-2-1', date: '2026-08-20', weightKg: 200, reps: '10', notes: 'Warmup benchmark' },
      { id: 'h-2-2', date: '2026-09-28', weightKg: 250, reps: '7', notes: 'Full depth 2 RIR' }
    ]
  },
  {
    id: 'pr-3',
    exerciseName: 'Conventional Deadlift',
    muscle: 'Back / Legs',
    recordValue: '110 kg × 1',
    rawWeightKg: 110,
    reps: 1,
    date: '2026-09-12',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Conventional stance',
    isPR: true,
    notes: 'First deadlift was 75 kg × 5. Hit 110 kg × 1 on 12 Sep 2026.',
    history: [
      { id: 'h-3-1', date: '2026-07-10', weightKg: 75, reps: '5', notes: 'First session learning form' },
      { id: 'h-3-2', date: '2026-08-14', weightKg: 95, reps: '3', notes: 'Hook grip milestone' }
    ]
  },
  {
    id: 'pr-4',
    exerciseName: 'Sumo Deadlift',
    muscle: 'Legs / Back',
    recordValue: '90 kg × 2',
    rawWeightKg: 90,
    reps: 2,
    date: '2026-09-19',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Sumo stance',
    isPR: false,
    notes: 'Tracked separately from Conventional.',
    history: [
      { id: 'h-4-1', date: '2026-08-30', weightKg: 80, reps: '3', notes: 'Stance adjustment' }
    ]
  },
  {
    id: 'pr-5',
    exerciseName: 'Smith Machine Squat',
    muscle: 'Quads',
    recordValue: '90–100 kg × 7–8',
    rawWeightKg: 100,
    reps: '7-8',
    date: '2026-10-05',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Machine Track',
    isPR: true,
    notes: 'Squat PR.',
    history: [
      { id: 'h-5-1', date: '2026-08-25', weightKg: 80, reps: '8', notes: 'Deep track' }
    ]
  },
  {
    id: 'pr-6',
    exerciseName: 'Flat Chest Press (Machine)',
    muscle: 'Chest',
    recordValue: '80 kg × 4',
    rawWeightKg: 80,
    reps: 4,
    date: '2026-10-10',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Slight support on final reps',
    isPR: true,
    notes: 'Machine chest press with heavy load.',
    history: [
      { id: 'h-6-1', date: '2026-09-05', weightKg: 70, reps: '6', notes: 'Controlled tempo' }
    ]
  },
  {
    id: 'pr-7',
    exerciseName: 'Lat Pulldown',
    muscle: 'Back / Lats',
    recordValue: '75 kg × 3',
    rawWeightKg: 75,
    reps: 3,
    date: '2026-10-22',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Full stretch lat pulldown',
    isPR: true,
    notes: 'User pulled 75 kg × 3.',
    history: [
      { id: 'h-7-1', date: '2026-08-18', weightKg: 65, reps: '8', notes: 'Form perfection' },
      { id: 'h-7-2', date: '2026-09-30', weightKg: 70, reps: '5', notes: 'Full stretch' }
    ]
  },
  {
    id: 'pr-8',
    exerciseName: 'Bodyweight Pull-ups',
    muscle: 'Back / Biceps',
    recordValue: '2 clean bodyweight reps',
    rawWeightKg: 84,
    reps: 2,
    date: '2026-10-25',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Strict bodyweight pull-up',
    isPR: true,
    notes: 'Progression to 2 full bodyweight pull-ups at ~84 kg bodyweight.',
    history: [
      { id: 'h-8-1', date: '2026-09-10', weightKg: 84, reps: '1', notes: 'First clean pull-up' }
    ]
  },
  {
    id: 'pr-9',
    exerciseName: 'Dumbbell Shoulder Press',
    muscle: 'Shoulders',
    recordValue: '22.5 kg each × 5–6',
    rawWeightKg: 22.5,
    reps: '5-6',
    date: '2026-10-28',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Seated DB shoulder press',
    isPR: true,
    notes: 'Seated dumbbell press compound overhead move.',
    history: [
      { id: 'h-9-1', date: '2026-08-22', weightKg: 17.5, reps: '8', notes: 'Warmup progression' },
      { id: 'h-9-2', date: '2026-09-24', weightKg: 20, reps: '7', notes: 'Solid lockouts' }
    ]
  },
  {
    id: 'pr-10',
    exerciseName: 'Leg Extension',
    muscle: 'Quads',
    recordValue: '75 kg × 10',
    rawWeightKg: 75,
    reps: 10,
    date: '2026-11-02',
    gymId: 'gym-main',
    gymName: 'Gym',
    romContext: 'Pin-loaded machine',
    isPR: true,
    notes: 'Progression: 65 kg × 15 -> 70 kg × 12 -> 75 kg × 10.'
  }
];

export const HISTORICAL_EXERCISE_PROGRESSION = [
  {
    exercise: 'Incline Dumbbell Press',
    history: [
      { date: '11 Sep 2026', weightKg: 22.5, reps: 10, note: 'Attempted 27.5 kg after' },
      { date: 'Mid Sep 2026', weightKg: 25.0, reps: 8, note: '25 kg each × 7-8 & 8-9' },
      { date: '29 Sep 2026', weightKg: 30.0, reps: 9, note: 'Major milestone: 30 kg each × 9' },
      { date: '13 Oct 2026', weightKg: 30.0, reps: 9, note: '30 kg × 9 self + 1 supported rep' }
    ]
  },
  {
    exercise: '45° Leg Press',
    history: [
      { date: 'Historical (PR)', weightKg: 260.0, reps: 8, note: '260 kg × 7-8 PR (Half ROM)' },
      { date: 'Set 1', weightKg: 140.0, reps: 13, note: '140 kg × 13 @ 2-3 RIR' },
      { date: 'Set 2', weightKg: 220.0, reps: 8, note: '220 kg × 8 @ 2 RIR' },
      { date: 'Set 3', weightKg: 250.0, reps: 7, note: '250 kg × 7 @ 2 RIR' }
    ]
  },
  {
    exercise: 'Barbell Free Squat',
    history: [
      { date: 'Set 1', weightKg: 20.0, reps: 15, note: 'Empty Olympic bar (20 kg)' },
      { date: 'Set 2', weightKg: 40.0, reps: 8, note: 'Bar + 10 kg/side' },
      { date: 'Set 3', weightKg: 60.0, reps: 7, note: 'Bar + 20 kg/side' }
    ]
  },
  {
    exercise: 'Deadlift',
    history: [
      { date: 'Initial', weightKg: 75.0, reps: 5, note: 'First conventional deadlift' },
      { date: '12 Sep 2026', weightKg: 110.0, reps: 1, note: '110 kg × 1 PR' },
      { date: '19 Sep 2026', weightKg: 90.0, reps: 2, note: '90 kg × 2 Sumo Deadlift' }
    ]
  }
];

export const WORKOUT_SPLITS = [
  {
    id: 'trainer-split',
    name: "Trainer's Current / Recent 6-Day Split (Active)",
    description: 'Current preferred routine: 2 muscle groups/day, 6 gym days + 1 rest day.',
    status: 'ACTIVE_PREFERENCE',
    schedule: [
      { day: 'Monday', muscle: 'Back + Biceps', focus: 'Lats, Rows, Traps (Shrugs), Curls' },
      { day: 'Tuesday', muscle: 'Chest + Triceps', focus: 'Incline DB Press, Flat Press, Pec Fly, Triceps' },
      { day: 'Wednesday', muscle: 'Legs + Shoulders', focus: 'Quads (Leg Press, Squat), Seated DB Press, Lateral Raises' },
      { day: 'Thursday', muscle: 'Back + Biceps', focus: 'T-Bar Row, Pulldowns, Cable Row, Incline Curls, Traps' },
      { day: 'Friday', muscle: 'Chest + Triceps', focus: 'Barbell Bench, Machine Press, Flyes, Triceps Pushdowns' },
      { day: 'Saturday', muscle: 'Legs + Shoulders', focus: 'Leg Press, Hamstrings, DB Shoulder Press, Lateral Raises' },
      { day: 'Sunday', muscle: 'Rest & Recovery', focus: 'Mobility, Hydration, Recovery' }
    ]
  }
];

export const HISTORICAL_NUTRITION_DAYS: DailyNutritionLog[] = [
  {
    id: 'nutr-1',
    date: '2026-10-13',
    targetCalories: 1940,
    targetProtein: 140,
    waterIntakeL: 3.5,
    waterTargetL: 3.5,
    notes: 'Estimated daily total: ~1,820–2,000 kcal | ~121–132 g protein against 1,940 kcal target.',
    estimatedStatus: 'ESTIMATED',
    meals: [
      {
        mealName: 'Breakfast',
        items: [
          { id: 'f1', name: 'Saffola Oats', quantity: 50, unit: 'g', calories: 190, protein: 6, carbs: 32, fat: 4, rawOrCooked: 'raw' },
          { id: 'f2', name: 'MuscleBlaze Biozyme Whey', brand: 'MuscleBlaze', quantity: 1, unit: 'scoop', calories: 144, protein: 25, carbs: 3, fat: 2, rawOrCooked: 'na' },
          { id: 'f3', name: 'Cow Milk', quantity: 350, unit: 'ml', calories: 215, protein: 11, carbs: 16, fat: 11, rawOrCooked: 'na' },
          { id: 'f4', name: 'Vegetable Soup', quantity: 1, unit: 'bowl', calories: 45, protein: 1.5, carbs: 8, fat: 0.5, rawOrCooked: 'cooked' }
        ]
      },
      {
        mealName: 'Lunch',
        items: [
          { id: 'f5', name: 'Low-oil Poha', quantity: 1, unit: 'plate', calories: 240, protein: 5, carbs: 46, fat: 4, rawOrCooked: 'cooked' },
          { id: 'f6', name: 'Whey in Water', brand: 'MuscleBlaze', quantity: 1, unit: 'scoop', calories: 144, protein: 25, carbs: 3, fat: 2, rawOrCooked: 'na' },
          { id: 'f7', name: 'Cucumber', quantity: 1, unit: 'whole', calories: 25, protein: 1, carbs: 4, fat: 0, rawOrCooked: 'raw' }
        ]
      },
      {
        mealName: 'Post-Workout',
        items: [
          { id: 'f8', name: 'High-Protein Oats', brand: 'Pinola', quantity: 60, unit: 'g', calories: 245, protein: 13, carbs: 36, fat: 5, rawOrCooked: 'raw', affordablePillar: true },
          { id: 'f9', name: 'Peanut Butter', quantity: 10, unit: 'g', calories: 65, protein: 2.8, carbs: 2, fat: 5.2, rawOrCooked: 'na' },
          { id: 'f10', name: 'Cow Milk', quantity: 250, unit: 'ml', calories: 155, protein: 8, carbs: 12, fat: 8, rawOrCooked: 'na' }
        ]
      },
      {
        mealName: 'Dinner',
        items: [
          { id: 'f11', name: 'Soybean Chapatis', quantity: 2, unit: 'rotis', calories: 220, protein: 12, carbs: 34, fat: 3, rawOrCooked: 'cooked', affordablePillar: true },
          { id: 'f12', name: 'Soybean Sabji', quantity: 1, unit: 'bowl', calories: 210, protein: 16, carbs: 14, fat: 9, rawOrCooked: 'cooked', affordablePillar: true },
          { id: 'f13', name: 'Jaggery Kharwas', quantity: 2, unit: 'bites', calories: 60, protein: 2, carbs: 10, fat: 1.5, rawOrCooked: 'na' }
        ]
      }
    ]
  },
  {
    id: 'nutr-2',
    date: '2026-11-11',
    targetCalories: 1940,
    targetProtein: 140,
    waterIntakeL: 3.2,
    waterTargetL: 3.5,
    notes: 'Historical calculation at lunch point: ~1,374 kcal & ~115 g protein logged (~566 kcal & 15-25g protein remaining). Final daily total: Not Available.',
    estimatedStatus: 'ESTIMATED',
    meals: [
      {
        mealName: 'Breakfast',
        items: [
          { id: 'f21', name: 'Cow Milk', quantity: 300, unit: 'ml', calories: 185, protein: 9.5, carbs: 14, fat: 9, rawOrCooked: 'na' },
          { id: 'f22', name: 'MuscleBlaze Biozyme Whey', brand: 'MuscleBlaze', quantity: 1.5, unit: 'scoops', calories: 216, protein: 37.5, carbs: 4.5, fat: 3, rawOrCooked: 'na' },
          { id: 'f23', name: 'Small Chapatis', quantity: 2, unit: 'rotis', calories: 160, protein: 5.5, carbs: 30, fat: 1.5, rawOrCooked: 'cooked' },
          { id: 'f24', name: '2-Egg Omelette (little oil)', quantity: 2, unit: 'eggs', calories: 180, protein: 13, carbs: 1.5, fat: 13, rawOrCooked: 'cooked' }
        ]
      },
      {
        mealName: 'Lunch',
        items: [
          { id: 'f25', name: 'High-Protein Oats', brand: 'Pinola', quantity: 60, unit: 'g', calories: 245, protein: 13, carbs: 36, fat: 5, rawOrCooked: 'raw' },
          { id: 'f26', name: 'Cow Milk', quantity: 250, unit: 'ml', calories: 155, protein: 8, carbs: 12, fat: 8, rawOrCooked: 'na' },
          { id: 'f27', name: 'Banana', quantity: 1, unit: 'medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, rawOrCooked: 'raw' }
        ]
      },
      {
        mealName: 'Post-Workout',
        items: [
          { id: 'f28', name: 'Whey in Water', brand: 'MuscleBlaze', quantity: 1, unit: 'scoop', calories: 144, protein: 25, carbs: 3, fat: 2, rawOrCooked: 'na' }
        ]
      }
    ]
  },
  {
    id: 'nutr-3',
    date: '2026-11-12',
    targetCalories: 1940,
    targetProtein: 140,
    waterIntakeL: 3.6,
    waterTargetL: 3.5,
    notes: 'Optimum Nutrition whey (1.5 scoops), boiled eggs, raw soybean (49g) and almond barfi bites. Final exact daily total: Not Available.',
    estimatedStatus: 'ESTIMATED',
    meals: [
      {
        mealName: 'Breakfast',
        items: [
          { id: 'f31', name: 'ON Performance Whey', brand: 'Optimum Nutrition', quantity: 1.5, unit: 'scoops', calories: 215, protein: 36, carbs: 5, fat: 3, rawOrCooked: 'na' },
          { id: 'f32', name: 'Cow Milk', quantity: 315, unit: 'ml', calories: 195, protein: 10, carbs: 15, fat: 10, rawOrCooked: 'na' },
          { id: 'f33', name: 'Saffola Oats', quantity: 50, unit: 'g', calories: 190, protein: 6, carbs: 32, fat: 4, rawOrCooked: 'raw' }
        ]
      },
      {
        mealName: 'Lunch',
        items: [
          { id: 'f34', name: 'Cooked Rice', quantity: 150, unit: 'g', calories: 195, protein: 3.8, carbs: 42, fat: 0.5, rawOrCooked: 'cooked' },
          { id: 'f35', name: 'Boiled Eggs', quantity: 3, unit: 'eggs', calories: 215, protein: 18, carbs: 1.2, fat: 14.5, rawOrCooked: 'cooked' },
          { id: 'f36', name: 'Max Protein Bar', brand: 'Max Protein', quantity: 1, unit: 'bar', calories: 250, protein: 20, carbs: 22, fat: 7, rawOrCooked: 'na' }
        ]
      },
      {
        mealName: 'Dinner',
        items: [
          { id: 'f37', name: 'Raw Soybean (Cooked into curry)', quantity: 49, unit: 'g', calories: 215, protein: 18, carbs: 15, fat: 9.5, rawOrCooked: 'raw', affordablePillar: true },
          { id: 'f38', name: 'Cooked Rice', quantity: 120, unit: 'g', calories: 155, protein: 3, carbs: 34, fat: 0.4, rawOrCooked: 'cooked' },
          { id: 'f39', name: 'Chocolate Coated Almond Barfi', quantity: 3, unit: 'small pieces', calories: 140, protein: 2.5, carbs: 18, fat: 6, rawOrCooked: 'na' }
        ]
      }
    ]
  }
];

export const AFFORDABLE_PROTEIN_PILLARS = [
  { food: 'Soybean (Raw)', proteinPer100g: '36–38g Protein / 100g' },
  { food: 'Eggs (Whole)', proteinPer100g: '18–20g Protein (3 eggs)' },
  { food: 'Cow Milk', proteinPer100g: '10g Protein / 300ml' },
  { food: 'Curd / Dahi', proteinPer100g: '7–8g Protein / 200g' },
  { food: 'High-Protein Oats (Pinola)', proteinPer100g: '13g Protein / 60g' },
  { food: 'Low-Fat Paneer', proteinPer100g: '18–20g Protein / 100g' },
  { food: 'Peanut Butter', proteinPer100g: '25–28g Protein / 100g' },
  { food: 'Chicken Breast', proteinPer100g: '24–26g Protein / 100g' }
];

export const SUPPLEMENT_STACK: SupplementEntry[] = [
  {
    id: 'supp-1',
    name: 'Wellcore Creatine Monohydrate',
    brand: 'Wellcore',
    dose: '3.0 g / day',
    frequency: 'Daily',
    time: 'With cold water / Post-workout',
    status: 'Daily Active',
    notes: 'Creatine monohydrate daily.'
  },
  {
    id: 'supp-2',
    name: 'Biozyme Performance Whey',
    brand: 'MuscleBlaze',
    dose: '1 scoop (~25g protein)',
    frequency: 'Daily',
    time: 'Post-workout',
    status: 'Daily Active',
    notes: 'Daily whey intake.'
  }
];

export const HISTORICAL_RECOVERY_LOGS: RecoveryLog[] = [
  {
    id: 'rec-1',
    date: '2026-11-20',
    sleepHours: 7.0,
    sleepQuality: 'Good',
    soreness: 4,
    fatigue: 4,
    energy: 8,
    readiness: 8,
    restDay: false,
    sleepNotes: '7 hours rested sleep.',
    sorenessNotes: 'Normal muscle soreness.'
  }
];

export const HISTORICAL_PROGRESS_PHOTOS: ProgressPhotoRecord[] = [];

export const INITIAL_MEASUREMENTS: MeasurementRecord[] = [
  {
    id: 'meas-baseline',
    date: '2026-11-20',
    waistCm: null,
    chestCm: null,
    shouldersCm: null,
    bicepsLeftCm: null,
    bicepsRightCm: null,
    forearmsCm: null,
    thighsCm: null,
    calvesCm: null,
    bodyFatPct: null,
    muscleMassKg: null,
    notes: 'Baseline'
  }
];
