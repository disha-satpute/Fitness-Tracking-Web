export const getDayName = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getFormattedDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const getISODate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFormattedTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
};

export interface DaySplitMapping {
  dayName: string;
  splitTitle: string;
  muscleGroups: string;
  isRest: boolean;
  focusExercises: string[];
}

export const WEEKLY_TRAINER_SCHEDULE: Record<string, DaySplitMapping> = {
  Monday: {
    dayName: 'Monday',
    splitTitle: 'Back + Biceps',
    muscleGroups: 'Lats, Rows, Traps & Biceps',
    isRest: false,
    focusExercises: ['Lat Pulldowns', 'T-Bar Rows', 'Heavy Shrugs (Traps)', 'Incline DB Curls', 'Hammer Curls']
  },
  Tuesday: {
    dayName: 'Tuesday',
    splitTitle: 'Chest + Triceps',
    muscleGroups: 'Upper Chest, Flat Press & Triceps',
    isRest: false,
    focusExercises: ['Incline DB Press (30kg DBs)', 'Flat Chest Machine', 'Pec Deck Flyes', 'Triceps Cable Extensions']
  },
  Wednesday: {
    dayName: 'Wednesday',
    splitTitle: 'Legs + Shoulders',
    muscleGroups: 'Quads, Hamstrings & Delts',
    isRest: false,
    focusExercises: ['45° Leg Press (Heavy)', 'Barbell Free Squats', 'Seated DB Shoulder Press (22.5kg)', 'DB Lateral Raises']
  },
  Thursday: {
    dayName: 'Thursday',
    splitTitle: 'Back + Biceps',
    muscleGroups: 'Back Thickness, Traps & Arms',
    isRest: false,
    focusExercises: ['Seated Cable Rows', 'Lat Pulldowns', 'Shrugs (2x weekly)', 'Incline Curls']
  },
  Friday: {
    dayName: 'Friday',
    splitTitle: 'Chest + Triceps',
    muscleGroups: 'Chest Volume & Triceps',
    isRest: false,
    focusExercises: ['Barbell Bench Press', 'Incline Machine Press', 'Pec Flyes', 'Overhead Triceps Extensions']
  },
  Saturday: {
    dayName: 'Saturday',
    splitTitle: 'Legs + Shoulders',
    muscleGroups: 'Leg Volume & Shoulder Width',
    isRest: false,
    focusExercises: ['45° Leg Press', 'Leg Extensions', 'Lateral Raises (DB + Machine)', 'Treadmill Incline Walk']
  },
  Sunday: {
    dayName: 'Sunday',
    splitTitle: 'Rest & Full Recovery',
    muscleGroups: 'Systemic Nervous System Recovery',
    isRest: true,
    focusExercises: ['Light Mobility / 2km Walk', 'Hydration Focus (3.5L)', 'Sleep Optimization']
  }
};
