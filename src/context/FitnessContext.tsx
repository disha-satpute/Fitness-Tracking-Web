import React, { createContext, useContext, useState, useEffect } from 'react';
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
  MeasurementRecord,
  WorkoutSession,
  FoodItem
} from '../types/fitness';
import {
  INITIAL_USER_PROFILE,
  INITIAL_CALORIE_PROFILE,
  HISTORICAL_WEIGHT_RECORDS,
  GYMS,
  HISTORICAL_PRS,
  HISTORICAL_NUTRITION_DAYS,
  HISTORICAL_RECOVERY_LOGS,
  SUPPLEMENT_STACK,
  HISTORICAL_PROGRESS_PHOTOS,
  INITIAL_MEASUREMENTS,
  INITIAL_STEP_RECORDS
} from '../data/historicalData';
import { 
  getISODate, 
  getDayName, 
  WEEKLY_TRAINER_SCHEDULE, 
  DaySplitMapping 
} from '../utils/dateUtils';
import { DailyStepRecord } from '../types/fitness';
import { apiSync } from '../utils/apiSync';

interface FitnessContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  calorieProfile: CalorieProfile;
  updateCalorieProfile: (updated: Partial<CalorieProfile>) => void;
  weightRecords: WeightRecord[];
  addWeightRecord: (record: Omit<WeightRecord, 'id'>) => void;
  gyms: GymLocation[];
  activeGymId: string;
  setActiveGymId: (id: string) => void;
  prs: PersonalRecord[];
  addPr: (record: Omit<PersonalRecord, 'id'>) => void;
  updatePr: (updatedRecord: PersonalRecord) => void;
  deletePr: (id: string) => void;
  dailySteps: DailyStepRecord[];
  updateDailySteps: (date: string, steps: number) => void;
  nutritionLogs: DailyNutritionLog[];
  addFoodLog: (date: string, meal: any, item: any) => void;
  updateFoodItem: (date: string, mealName: string, itemId: string, updatedItem: Partial<FoodItem>) => void;
  deleteFoodItem: (date: string, mealName: string, itemId: string) => void;
  recoveryLogs: RecoveryLog[];
  addRecoveryLog: (log: Omit<RecoveryLog, 'id'>) => void;
  supplements: SupplementEntry[];
  progressPhotos: ProgressPhotoRecord[];
  addProgressPhoto: (photo: Omit<ProgressPhotoRecord, 'id'>) => void;
  measurements: MeasurementRecord[];
  updateMeasurement: (meas: MeasurementRecord) => void;
  todaysWorkout: WorkoutSession;
  updateTodaysWorkout: (workout: WorkoutSession) => void;
  restTimerSeconds: number | null;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  selectedDate: string;
  setSelectedDate: (isoDate: string) => void;
  currentDaySchedule: DaySplitMapping;
}

const buildWorkoutForDay = (dateStr: string): WorkoutSession => {
  const dateObj = new Date(dateStr + 'T12:00:00');
  const dayName = getDayName(dateObj);
  const sched = WEEKLY_TRAINER_SCHEDULE[dayName] || WEEKLY_TRAINER_SCHEDULE['Monday'];

  if (sched.isRest) {
    return {
      id: `workout-${dateStr}`,
      date: dateStr,
      dayName,
      splitName: sched.splitTitle,
      gymId: 'gym-new',
      activeTrainingMin: 0,
      totalGymMin: 0,
      energyLevel: 9,
      recoveryLevel: 9,
      notes: 'Scheduled full systemic rest day. Light mobility & nutrition replenishment.',
      exercises: []
    };
  }

  // Generate real default exercises based on the split
  let generatedExercises = [];
  if (dayName === 'Monday' || dayName === 'Thursday') {
    generatedExercises = [
      {
        id: 'ex-lat',
        name: 'Lat Pulldown',
        muscleGroup: 'Back',
        equipment: 'Cable Lat Machine',
        gymId: 'gym-new',
        historicalBest: '75 kg × 3 (Historical)',
        lastPerformance: '70 kg × 8',
        sets: [
          { setNumber: 1, weight: 55, unit: 'kg' as const, reps: 12, rir: 3, setType: 'warmup' as const, completed: true },
          { setNumber: 2, weight: 65, unit: 'kg' as const, reps: 10, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 3, weight: 75, unit: 'kg' as const, reps: 4, rir: 1, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-tbar',
        name: 'T-Bar Row',
        muscleGroup: 'Back',
        equipment: 'Chest Supported T-Bar',
        gymId: 'gym-new',
        historicalBest: 'Chest supported heavy',
        lastPerformance: '45 kg × 10',
        sets: [
          { setNumber: 1, weight: 35, unit: 'kg' as const, reps: 10, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 45, unit: 'kg' as const, reps: 8, rir: 1, setType: 'working' as const, completed: false }
        ]
      },
      {
        id: 'ex-shrugs',
        name: 'Heavy Shrugs (Traps Focus)',
        muscleGroup: 'Traps',
        equipment: 'Heavy Dumbbells',
        gymId: 'gym-new',
        historicalBest: '2x/week heavy (8–10 reps)',
        lastPerformance: '32 kg DBs × 10',
        sets: [
          { setNumber: 1, weight: 28, unit: 'kg' as const, reps: 10, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 32, unit: 'kg' as const, reps: 9, rir: 1, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-curls',
        name: 'Incline Dumbbell Biceps Curls',
        muscleGroup: 'Biceps',
        equipment: 'Dumbbells & 60° Bench',
        gymId: 'gym-new',
        historicalBest: '12.5 kg each × 10',
        lastPerformance: '12.5 kg × 9',
        sets: [
          { setNumber: 1, weight: 10, unit: 'kg' as const, reps: 12, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 12.5, unit: 'kg' as const, reps: 10, rir: 1, setType: 'working' as const, completed: false }
        ]
      }
    ];
  } else if (dayName === 'Tuesday' || dayName === 'Friday') {
    generatedExercises = [
      {
        id: 'ex-incline-db',
        name: 'Incline Dumbbell Press',
        muscleGroup: 'Chest',
        equipment: '30° Incline Bench & DBs',
        gymId: 'gym-new',
        historicalBest: '30 kg each × 9 (+1 assisted)',
        lastPerformance: '30 kg × 9',
        sets: [
          { setNumber: 1, weight: 22.5, unit: 'kg' as const, reps: 10, rir: 3, setType: 'warmup' as const, completed: true },
          { setNumber: 2, weight: 27.5, unit: 'kg' as const, reps: 8, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 3, weight: 30.0, unit: 'kg' as const, reps: 9, rir: 1, setType: 'pr' as const, completed: true, notes: 'Milestone 30kg load clean control' }
        ]
      },
      {
        id: 'ex-machine-press',
        name: 'Flat Chest Press (Machine)',
        muscleGroup: 'Chest',
        equipment: 'Pin-loaded Chest Press',
        gymId: 'gym-new',
        historicalBest: '80 kg × 4',
        lastPerformance: '80 kg × 4',
        sets: [
          { setNumber: 1, weight: 65, unit: 'kg' as const, reps: 10, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 80, unit: 'kg' as const, reps: 4, rir: 0, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-pec-fly',
        name: 'Pec Deck Fly',
        muscleGroup: 'Chest',
        equipment: 'Pec Fly Machine',
        gymId: 'gym-new',
        historicalBest: 'Full chest stretch',
        lastPerformance: '55 kg × 12',
        sets: [
          { setNumber: 1, weight: 45, unit: 'kg' as const, reps: 12, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 55, unit: 'kg' as const, reps: 10, rir: 1, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-triceps',
        name: 'Cable Triceps Pushdowns',
        muscleGroup: 'Triceps',
        equipment: 'Cable Rope',
        gymId: 'gym-new',
        historicalBest: '~4 direct sets/week',
        lastPerformance: '25 kg × 12',
        sets: [
          { setNumber: 1, weight: 20, unit: 'kg' as const, reps: 12, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 25, unit: 'kg' as const, reps: 10, rir: 1, setType: 'working' as const, completed: true }
        ]
      }
    ];
  } else {
    // Wednesday / Saturday: Legs + Shoulders
    generatedExercises = [
      {
        id: 'ex-legpress',
        name: '45° Leg Press',
        muscleGroup: 'Quads',
        equipment: '45° Plate Loaded Sled',
        gymId: 'gym-new',
        historicalBest: '250 kg × 7 @ 2 RIR',
        lastPerformance: '250 kg × 7',
        sets: [
          { setNumber: 1, weight: 140, unit: 'kg' as const, reps: 13, rir: 3, setType: 'warmup' as const, completed: true },
          { setNumber: 2, weight: 220, unit: 'kg' as const, reps: 8, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 3, weight: 250, unit: 'kg' as const, reps: 7, rir: 2, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-squat',
        name: 'Olympic Free Barbell Squat',
        muscleGroup: 'Quads / Glutes',
        equipment: 'Squat Rack & Olympic Bar',
        gymId: 'gym-new',
        historicalBest: '60 kg total (20kg bar + 20kg/side) × 7',
        lastPerformance: '60 kg × 7',
        sets: [
          { setNumber: 1, weight: 20, unit: 'kg' as const, reps: 15, rir: 4, setType: 'warmup' as const, completed: true },
          { setNumber: 2, weight: 40, unit: 'kg' as const, reps: 8, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 3, weight: 60, unit: 'kg' as const, reps: 7, rir: 2, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-db-shoulder',
        name: 'Seated Dumbbell Shoulder Press',
        muscleGroup: 'Shoulders',
        equipment: '75° Incline Bench & DBs',
        gymId: 'gym-new',
        historicalBest: '22.5 kg each × 5–6',
        lastPerformance: '22.5 kg × 6',
        sets: [
          { setNumber: 1, weight: 17.5, unit: 'kg' as const, reps: 8, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 22.5, unit: 'kg' as const, reps: 6, rir: 1, setType: 'working' as const, completed: true }
        ]
      },
      {
        id: 'ex-lat-raise',
        name: 'Dumbbell Lateral Raise',
        muscleGroup: 'Shoulders',
        equipment: 'Dumbbells',
        gymId: 'gym-new',
        historicalBest: 'Strict form for delt width',
        lastPerformance: '10 kg × 12',
        sets: [
          { setNumber: 1, weight: 7.5, unit: 'kg' as const, reps: 15, rir: 2, setType: 'working' as const, completed: true },
          { setNumber: 2, weight: 10, unit: 'kg' as const, reps: 12, rir: 1, setType: 'working' as const, completed: true }
        ]
      }
    ];
  }

  return {
    id: `workout-${dateStr}`,
    date: dateStr,
    dayName,
    splitName: `${sched.splitTitle} (Trainer Split)`,
    gymId: 'gym-new',
    activeTrainingMin: 75,
    totalGymMin: 115,
    energyLevel: 8,
    recoveryLevel: 7,
    exercises: generatedExercises
  };
};

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gym_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [calorieProfile, setCalorieProfile] = useState<CalorieProfile>(() => {
    const saved = localStorage.getItem('gym_calories');
    return saved ? JSON.parse(saved) : INITIAL_CALORIE_PROFILE;
  });

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('gym_weights');
    return saved ? JSON.parse(saved) : HISTORICAL_WEIGHT_RECORDS;
  });

  const [gyms] = useState<GymLocation[]>(GYMS);
  const [activeGymId, setActiveGymId] = useState<string>('gym-new');

  const [prs, setPrs] = useState<PersonalRecord[]>(() => {
    const saved = localStorage.getItem('gym_prs');
    return saved ? JSON.parse(saved) : HISTORICAL_PRS;
  });

  const [nutritionLogs, setNutritionLogs] = useState<DailyNutritionLog[]>(() => {
    const saved = localStorage.getItem('gym_nutrition');
    return saved ? JSON.parse(saved) : HISTORICAL_NUTRITION_DAYS;
  });

  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>(() => {
    const saved = localStorage.getItem('gym_recovery');
    return saved ? JSON.parse(saved) : HISTORICAL_RECOVERY_LOGS;
  });

  const [supplements] = useState<SupplementEntry[]>(SUPPLEMENT_STACK);

  const [progressPhotos, setProgressPhotos] = useState<ProgressPhotoRecord[]>(() => {
    const saved = localStorage.getItem('gym_photos');
    return saved ? JSON.parse(saved) : HISTORICAL_PROGRESS_PHOTOS;
  });

  const [measurements, setMeasurements] = useState<MeasurementRecord[]>(() => {
    const saved = localStorage.getItem('gym_measurements');
    return saved ? JSON.parse(saved) : INITIAL_MEASUREMENTS;
  });

  const [dailySteps, setDailySteps] = useState<DailyStepRecord[]>(() => {
    const saved = localStorage.getItem('gym_daily_steps');
    return saved ? JSON.parse(saved) : INITIAL_STEP_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem('gym_daily_steps', JSON.stringify(dailySteps));
  }, [dailySteps]);

  // Background initial fetch from Neon DB if available (non-blocking fallback)
  useEffect(() => {
    // 1. Fetch remote steps
    apiSync.getSteps().then((remoteSteps) => {
      if (remoteSteps && remoteSteps.length > 0) {
        setDailySteps(remoteSteps);
      }
    });

    // 2. Fetch remote PRs
    apiSync.getPrs().then((remotePrs) => {
      if (remotePrs && remotePrs.length > 0) {
        setPrs(remotePrs);
      }
    });

    // 3. Fetch remote Nutrition logs
    apiSync.getNutritionLogs().then((remoteNutrition) => {
      if (remoteNutrition && remoteNutrition.length > 0) {
        setNutritionLogs(remoteNutrition);
      }
    });

    // 4. Fetch remote Weight records
    apiSync.getWeightRecords().then((remoteWeights) => {
      if (remoteWeights && remoteWeights.length > 0) {
        setWeightRecords(remoteWeights);
        const latest = remoteWeights[remoteWeights.length - 1];
        if (latest && latest.weight) {
          setProfile((p) => ({ ...p, currentWeight: latest.weight }));
        }
      }
    });
  }, []);

  const updateDailySteps = (date: string, steps: number) => {
    setDailySteps((prev) => {
      const existingIdx = prev.findIndex((s) => s.date === date);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { date, steps };
        return copy;
      }
      return [...prev, { date, steps }].sort((a, b) => a.date.localeCompare(b.date));
    });
    // Async background sync to Neon
    apiSync.saveSteps(date, steps);
  };

  // Real Calendar synchronization
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getISODate(new Date());
  });

  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutSession>(() => {
    const todayISO = getISODate(new Date());
    const saved = localStorage.getItem(`gym_workout_${todayISO}`);
    return saved ? JSON.parse(saved) : buildWorkoutForDay(todayISO);
  });

  // When selectedDate changes, load or build that day's scheduled workout
  useEffect(() => {
    const saved = localStorage.getItem(`gym_workout_${selectedDate}`);
    if (saved) {
      setTodaysWorkout(JSON.parse(saved));
    } else {
      setTodaysWorkout(buildWorkoutForDay(selectedDate));
    }
  }, [selectedDate]);

  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    if (restTimerSeconds === null || restTimerSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestTimerSeconds((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimerSeconds]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gym_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('gym_calories', JSON.stringify(calorieProfile));
  }, [calorieProfile]);

  useEffect(() => {
    localStorage.setItem('gym_weights', JSON.stringify(weightRecords));
  }, [weightRecords]);

  useEffect(() => {
    localStorage.setItem('gym_prs', JSON.stringify(prs));
  }, [prs]);

  useEffect(() => {
    localStorage.setItem(`gym_workout_${todaysWorkout.date}`, JSON.stringify(todaysWorkout));
  }, [todaysWorkout]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const updateCalorieProfile = (updated: Partial<CalorieProfile>) => {
    setCalorieProfile((prev) => ({ ...prev, ...updated }));
  };

  const addWeightRecord = (record: Omit<WeightRecord, 'id'>) => {
    const newRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      ...record
    };
    setWeightRecords((prev) => [...prev, newRecord]);
    setProfile((prev) => ({ ...prev, currentWeight: record.weight }));
    apiSync.saveWeightRecord(newRecord);
  };

  const addPr = (record: Omit<PersonalRecord, 'id'>) => {
    const newPr: PersonalRecord = {
      id: `pr-${Date.now()}`,
      ...record
    };
    setPrs((prev) => [newPr, ...prev]);
    apiSync.savePr(newPr);
  };

  const updatePr = (updatedRecord: PersonalRecord) => {
    setPrs((prev) => prev.map((item) => (item.id === updatedRecord.id ? updatedRecord : item)));
    apiSync.savePr(updatedRecord);
  };

  const deletePr = (id: string) => {
    setPrs((prev) => prev.filter((item) => item.id !== id));
    apiSync.deletePr(id);
  };

  const addFoodLog = (date: string, mealName: any, item: any) => {
    setNutritionLogs((prev) => {
      let updatedDay: DailyNutritionLog;
      const dayIndex = prev.findIndex((d) => d.date === date);
      let newLogs: DailyNutritionLog[];

      if (dayIndex >= 0) {
        const copy = [...prev];
        const day = { ...copy[dayIndex] };
        const meal = day.meals.find((m) => m.mealName === mealName);
        if (meal) {
          meal.items.push(item);
        } else {
          day.meals.push({ mealName, items: [item] });
        }
        copy[dayIndex] = day;
        updatedDay = day;
        newLogs = copy;
      } else {
        updatedDay = {
          id: `nutr-${Date.now()}`,
          date,
          targetCalories: calorieProfile.cuttingTarget,
          targetProtein: calorieProfile.proteinTargetMin,
          waterIntakeL: 2.0,
          waterTargetL: 3.5,
          meals: [{ mealName, items: [item] }]
        };
        newLogs = [updatedDay, ...prev];
      }

      // Sync to Neon
      apiSync.saveNutritionLog(updatedDay);
      return newLogs;
    });
  };

  const updateFoodItem = (date: string, mealName: string, itemId: string, updatedItem: Partial<FoodItem>) => {
    setNutritionLogs((prev) => {
      const dayIndex = prev.findIndex((d) => d.date === date);
      if (dayIndex < 0) return prev;
      const copy = [...prev];
      const day = { ...copy[dayIndex] };
      const meal = day.meals.find((m) => m.mealName === mealName);
      if (meal) {
        meal.items = meal.items.map((i) => (i.id === itemId ? { ...i, ...updatedItem } : i));
        copy[dayIndex] = day;
        apiSync.saveNutritionLog(day);
      }
      return copy;
    });
  };

  const deleteFoodItem = (date: string, mealName: string, itemId: string) => {
    setNutritionLogs((prev) => {
      const dayIndex = prev.findIndex((d) => d.date === date);
      if (dayIndex < 0) return prev;
      const copy = [...prev];
      const day = { ...copy[dayIndex] };
      const meal = day.meals.find((m) => m.mealName === mealName);
      if (meal) {
        meal.items = meal.items.filter((i) => i.id !== itemId);
        // Clean up empty meal slots if needed
        day.meals = day.meals.filter((m) => m.items.length > 0);
        copy[dayIndex] = day;
        apiSync.saveNutritionLog(day);
      }
      return copy;
    });
  };

  const addRecoveryLog = (log: Omit<RecoveryLog, 'id'>) => {
    const newLog: RecoveryLog = {
      id: `rec-${Date.now()}`,
      ...log
    };
    setRecoveryLogs((prev) => [newLog, ...prev]);
  };

  const addProgressPhoto = (photo: Omit<ProgressPhotoRecord, 'id'>) => {
    const newPhoto: ProgressPhotoRecord = {
      id: `photo-${Date.now()}`,
      ...photo
    };
    setProgressPhotos((prev) => [newPhoto, ...prev]);
  };

  const updateMeasurement = (meas: MeasurementRecord) => {
    setMeasurements((prev) => [meas, ...prev.filter((m) => m.id !== meas.id)]);
  };

  const updateTodaysWorkout = (workout: WorkoutSession) => {
    setTodaysWorkout(workout);
  };

  const startRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
  };

  const stopRestTimer = () => {
    setRestTimerSeconds(null);
  };

  const currentDaySchedule = WEEKLY_TRAINER_SCHEDULE[getDayName(new Date(selectedDate + 'T12:00:00'))] || WEEKLY_TRAINER_SCHEDULE['Monday'];

  return (
    <FitnessContext.Provider
      value={{
        profile,
        updateProfile,
        calorieProfile,
        updateCalorieProfile,
        weightRecords,
        addWeightRecord,
        gyms,
        activeGymId,
        setActiveGymId,
        prs,
        addPr,
        updatePr,
        deletePr,
        dailySteps,
        updateDailySteps,
        nutritionLogs,
        addFoodLog,
        updateFoodItem,
        deleteFoodItem,
        recoveryLogs,
        addRecoveryLog,
        supplements,
        progressPhotos,
        addProgressPhoto,
        measurements,
        updateMeasurement,
        todaysWorkout,
        updateTodaysWorkout,
        restTimerSeconds,
        startRestTimer,
        stopRestTimer,
        selectedDate,
        setSelectedDate,
        currentDaySchedule
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) throw new Error('useFitness must be used within a FitnessProvider');
  return context;
};
