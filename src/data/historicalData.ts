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
    id: 'gym-old',
    name: 'Old Gym',
    period: 'Up to ~22 Aug 2026',
    maxDumbbell: '50 lb (~22.7 kg)',
    smithMachine: true,
    shoulderPressMachine: true,
    notes: 'Had Smith machine (Smith squat PR 90-100 kg), dumbbells capped at 50 lb.'
  },
  {
    id: 'gym-new',
    name: 'New Gym',
    period: '22 Aug 2026 - Present',
    maxDumbbell: '35 kg - 40 kg',
    smithMachine: false,
    shoulderPressMachine: false,
    notes: 'Heavy dumbbells up to 40 kg. No Smith machine, no dedicated shoulder press machine.'
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
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'First 9 reps unassisted; slight spotter support on rep 10',
    isPR: true,
    notes: 'Progressed from 22.5 kg × 10 (11 Sep) -> 30 kg × 9 (29 Sep) -> 30 kg × 9+1 (13 Oct). New gym has 35 kg dumbbells.'
  },
  {
    id: 'pr-2',
    exerciseName: 'Leg Press (45°)',
    muscle: 'Quads',
    recordValue: '260 kg × 7–8 (Half ROM)',
    rawWeightKg: 260,
    reps: '7-8',
    date: 'Historical',
    gymId: 'gym-old',
    gymName: 'Old Gym',
    romContext: 'Half Range of Motion (Old gym context)',
    isPR: true,
    notes: 'Crucial context: Old gym had 250 kg × 13 (half ROM) & 260 kg × 7-8 PR. New gym performance: 250 kg × 7 @ 2 RIR.'
  },
  {
    id: 'pr-3',
    exerciseName: 'Conventional Deadlift',
    muscle: 'Back / Glutes / Hamstrings',
    recordValue: '110 kg × 1',
    rawWeightKg: 110,
    reps: 1,
    date: '2026-09-12',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Conventional stance (dead stop)',
    isPR: true,
    notes: 'First deadlift was 75 kg × 5. Hit 110 kg × 1 on 12 Sep 2026. Glute cramps recorded on 3 Oct.'
  },
  {
    id: 'pr-4',
    exerciseName: 'Sumo Deadlift',
    muscle: 'Legs / Back',
    recordValue: '90 kg × 2',
    rawWeightKg: 90,
    reps: 2,
    date: '2026-09-19',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Sumo stance',
    isPR: false,
    notes: 'Tracked separately from Conventional to preserve stance technique.'
  },
  {
    id: 'pr-5',
    exerciseName: 'Smith Machine Squat',
    muscle: 'Quads',
    recordValue: '90–100 kg × 7–8',
    rawWeightKg: 100,
    reps: '7-8',
    date: 'Historical',
    gymId: 'gym-old',
    gymName: 'Old Gym',
    romContext: 'Smith Machine Track',
    isPR: true,
    notes: 'Old gym PR. New gym has NO Smith machine, so free barbell squats are tracked (up to 60 kg total: 20kg bar + 20kg/side).'
  },
  {
    id: 'pr-6',
    exerciseName: 'Flat Chest Press (Machine)',
    muscle: 'Chest',
    recordValue: '80 kg × 4',
    rawWeightKg: 80,
    reps: 4,
    date: 'Historical',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Slight support on final reps',
    isPR: true,
    notes: 'Machine chest press with heavy load.'
  },
  {
    id: 'pr-7',
    exerciseName: 'Lat Pulldown',
    muscle: 'Back / Lats',
    recordValue: '75 kg × 3',
    rawWeightKg: 75,
    reps: 3,
    date: 'Historical',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Full stretch lat pulldown',
    isPR: true,
    notes: 'User pulled 75 kg × 3.'
  },
  {
    id: 'pr-8',
    exerciseName: 'Bodyweight Pull-ups',
    muscle: 'Back / Lats / Biceps',
    recordValue: '2 clean bodyweight reps',
    rawWeightKg: 84,
    reps: 2,
    date: 'Historical',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Strict bodyweight pull-up',
    isPR: true,
    notes: 'Progression from assisted pull-up (80 lb assistance × 7 wide, × 10 close) to 2 full bodyweight pull-ups at ~82-84 kg bodyweight.'
  },
  {
    id: 'pr-9',
    exerciseName: 'Dumbbell Shoulder Press',
    muscle: 'Shoulders',
    recordValue: '22.5 kg each × 5–6',
    rawWeightKg: 22.5,
    reps: '5-6',
    date: 'Historical',
    gymId: 'gym-new',
    gymName: 'New Gym',
    romContext: 'Seated DB shoulder press',
    isPR: true,
    notes: 'New gym has no shoulder press machine, so seated dumbbell press is primary compound overhead move.'
  },
  {
    id: 'pr-10',
    exerciseName: 'Leg Extension',
    muscle: 'Quads',
    recordValue: '75 kg × 10',
    rawWeightKg: 75,
    reps: 10,
    date: 'Historical',
    gymId: 'gym-new',
    gymName: 'New Gym',
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
      { date: 'Old Gym (PR)', weightKg: 260.0, reps: 8, note: '260 kg × 7-8 PR (Half ROM context)' },
      { date: 'New Gym (Set 1)', weightKg: 140.0, reps: 13, note: '140 kg × 13 @ 2-3 RIR' },
      { date: 'New Gym (Set 2)', weightKg: 220.0, reps: 8, note: '220 kg × 8 @ 2 RIR' },
      { date: 'New Gym (Set 3)', weightKg: 250.0, reps: 7, note: '250 kg × 7 @ 2 RIR' }
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
  },
  {
    id: 'two-a-day',
    name: 'Historical Two-a-Day Split (Tested > 3 weeks)',
    description: 'Historical trial plan with AM/PM sessions and 2 km hike.',
    status: 'HISTORICAL_ARCHIVED',
    schedule: [
      { day: 'AM Session', muscle: 'Back + Chest + Legs', focus: 'Heavy compound session' },
      { day: 'PM Session', muscle: 'Biceps + Triceps + Shoulders', focus: 'Arms & delts accessory' },
      { day: 'Cardio', muscle: 'Cardio / Hike', focus: '2 km outdoor hike; ~6.5–7.5 hrs sleep' }
    ]
  },
  {
    id: 'bro-split',
    name: 'Older Bro Split (Single Muscle / Day)',
    description: 'Older routine: 1 muscle per day.',
    status: 'HISTORICAL_ARCHIVED',
    schedule: [
      { day: 'Monday', muscle: 'Back', focus: 'Back isolation' },
      { day: 'Tuesday', muscle: 'Shoulders', focus: 'Shoulders' },
      { day: 'Wednesday', muscle: 'Chest', focus: 'Chest' },
      { day: 'Thursday', muscle: 'Biceps', focus: 'Biceps' },
      { day: 'Friday', muscle: 'Triceps', focus: 'Triceps' },
      { day: 'Saturday', muscle: 'Legs', focus: 'Legs' },
      { day: 'Sunday', muscle: 'Not Specified', focus: 'Rest' }
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
  { food: 'Soybean (Raw)', costPer100g: '₹10–15', proteinPer100g: '36–38 g', affordability: 'Highest (Value champion)' },
  { food: 'Eggs (Whole)', costPer100g: '₹20–25 (3 eggs)', proteinPer100g: '18–20 g', affordability: 'High' },
  { food: 'Cow Milk', costPer100g: '₹6–8 / 100ml', proteinPer100g: '3.2 g', affordability: 'High' },
  { food: 'Curd / Dahi', costPer100g: '₹7–10 / 100g', proteinPer100g: '3.5–4 g', affordability: 'High' },
  { food: 'High-Protein Oats (Pinola)', costPer100g: '₹40 / 100g', proteinPer100g: '22 g', affordability: 'Medium-High' },
  { food: 'Low-Fat Paneer', costPer100g: '₹35–45 / 100g', proteinPer100g: '18–20 g', affordability: 'Medium' },
  { food: 'Peanut Butter', costPer100g: '₹30 / 100g', proteinPer100g: '25–28 g', affordability: 'High' },
  { food: 'Chicken Breast / Curry Cut', costPer100g: '₹30–35 / 100g', proteinPer100g: '22–26 g', affordability: 'Medium' },
  { food: 'Whey Protein (MB / ON)', costPer100g: '₹65–85 / scoop (25g P)', proteinPer100g: '75–80 g / 100g', affordability: 'Moderate (Capped at 1 scoop/day for budget)' }
];

export const SUPPLEMENT_STACK: SupplementEntry[] = [
  {
    id: 'supp-1',
    name: 'Wellcore Creatine Monohydrate (Fruit Fusion)',
    brand: 'Wellcore (122g pack)',
    dose: '3.0 g / day (Scoop ~3.7g)',
    frequency: 'Daily',
    time: 'With cold water / Post-workout',
    status: 'Daily Active',
    notes: 'Asked about taking in cold water & creatine-related water retention weight.'
  },
  {
    id: 'supp-2',
    name: 'Biozyme Performance / Performance Whey',
    brand: 'MuscleBlaze / Optimum Nutrition',
    dose: '1 – 1.5 scoops (~25–37g protein)',
    frequency: 'Daily / 1x daily due to budget constraints',
    time: 'Morning or Post-workout in water/milk',
    status: 'Daily Active',
    notes: 'Budget consideration: user explicitly noted whey is prioritized 1x daily to manage expenses.'
  },
  {
    id: 'supp-3',
    name: 'Blood Shower Pre-Workout',
    brand: 'Nutrition Planet',
    dose: '½ scoop',
    frequency: 'Occasional / Historical',
    time: 'Pre-workout',
    status: 'Historical/Pre-workout',
    notes: 'Reported tingling/burning sensations.'
  },
  {
    id: 'supp-4',
    name: 'Karnage Black Pre-Workout',
    brand: 'BigMuscles',
    dose: '1 full scoop',
    frequency: 'Occasional / Historical',
    time: 'Pre-workout',
    status: 'Historical/Pre-workout',
    notes: 'Experienced strong stimulation; mild chest discomfort was historically discussed after a pre-workout event. Logged as historical record without medical diagnosis.'
  },
  {
    id: 'supp-5',
    name: 'Neurobion Forte (Vitamin B12)',
    brand: 'Doctor Advised',
    dose: 'Per physician guidance',
    frequency: 'Medical guidance',
    time: 'Post meal',
    status: 'Medical/Doctor Advised',
    notes: 'Historically very low B12 lab result noted. Logged in health records; not treated as an automatic fitness recommendation.'
  }
];

export const HISTORICAL_RECOVERY_LOGS: RecoveryLog[] = [
  {
    id: 'rec-1',
    date: '2026-10-03',
    sleepHours: 6.8,
    sleepQuality: 'Fair',
    soreness: 7,
    fatigue: 6,
    energy: 7,
    readiness: 6,
    restDay: false,
    sleepNotes: 'Sleep approx 6.5–7.5 hrs. Woke to urinate, back asleep after 5 mins.',
    sorenessNotes: 'Glute cramps occurred after heavy deadlifting on 3 Oct 2026.'
  },
  {
    id: 'rec-2',
    date: '2026-10-26',
    sleepHours: 7.2,
    sleepQuality: 'Good',
    soreness: 3,
    fatigue: 3,
    energy: 10,
    readiness: 10,
    restDay: false,
    sleepNotes: 'Full 7+ hours rested.',
    sorenessNotes: 'User reported feeling 100% in back + biceps session (T-bar, Lat pulldown, Cable row, Shrugs, Curls).'
  },
  {
    id: 'rec-3',
    date: '2026-11-12',
    sleepHours: 6.0,
    sleepQuality: 'Fair',
    soreness: 6,
    fatigue: 7,
    energy: 8,
    readiness: 7,
    restDay: false,
    sleepNotes: 'Practical 6 hours sleep. 7 hours not always possible with work/schedule.',
    sorenessNotes: 'Hard gym session + 20 minutes intense cardio performed.'
  }
];

export const HISTORICAL_PROGRESS_PHOTOS: ProgressPhotoRecord[] = [
  {
    id: 'photo-1',
    date: '2026-10-31',
    bodyweight: 82.5,
    view: 'Back',
    pose: 'Flexed',
    lighting: 'Gym downlighting',
    focusMuscles: ['Lats', 'Traps', 'Rear Delts'],
    notes: 'Assessment: Looking for wider V-taper and upper back thickness. Realistic natural physique, zero artificial muscle augmentation.',
    photoPlaceholder: 'back_lat_spread'
  },
  {
    id: 'photo-2',
    date: '2026-11-07',
    bodyweight: 83.0,
    view: 'Front',
    pose: 'Relaxed',
    lighting: 'Natural room light',
    focusMuscles: ['Shoulders', 'Chest', 'Abdominal fat / Side handles'],
    notes: 'Checking waistline and side handles reduction while maintaining shoulder fullness.',
    photoPlaceholder: 'front_relaxed'
  },
  {
    id: 'photo-3',
    date: '2026-11-12',
    bodyweight: 84.0,
    view: 'Side',
    pose: 'Flexed',
    lighting: 'Direct overhead light',
    focusMuscles: ['Arms', 'Forearms', 'Chest thickness'],
    notes: 'Weight at 84 kg. User assessing arm & forearm vascularity and chest thickness during cut.',
    photoPlaceholder: 'side_chest'
  }
];

export const INITIAL_MEASUREMENTS: MeasurementRecord[] = [
  {
    id: 'meas-baseline',
    date: '2026-11-12',
    waistCm: null, // NOT AVAILABLE
    chestCm: null, // NOT AVAILABLE
    shouldersCm: null, // NOT AVAILABLE
    bicepsLeftCm: null, // NOT AVAILABLE
    bicepsRightCm: null, // NOT AVAILABLE
    forearmsCm: null, // NOT AVAILABLE
    thighsCm: null, // NOT AVAILABLE
    calvesCm: null, // NOT AVAILABLE
    bodyFatPct: null, // NOT AVAILABLE
    muscleMassKg: null, // NOT AVAILABLE
    notes: 'Historical body circumferences and body-fat % are currently Not Available. Stored as null (never zero) awaiting user measurements.'
  }
];
