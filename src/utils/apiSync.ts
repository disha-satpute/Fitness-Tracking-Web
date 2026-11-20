import { neon } from '@neondatabase/serverless';
import { PersonalRecord, DailyStepRecord, WorkoutSession, DailyNutritionLog } from '../types/fitness';

// Use pooler endpoint for resilient HTTP connections across all network environments
const connectionString = 
  import.meta.env.VITE_NEON_DATABASE_URL || 
  'postgresql://neondb_owner:npg_7WwYgCcjfF0t@ep-cold-fire-b3w32043-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sql = connectionString ? neon(connectionString) : null;

export const apiSync = {
  // Check backend / database health
  async checkHealth(): Promise<{ databaseConnected: boolean }> {
    if (!sql) return { databaseConnected: false };
    try {
      const res = await sql`SELECT 1 as test;`;
      return { databaseConnected: Boolean(res && res.length > 0) };
    } catch (e) {
      console.warn('Neon connection check failed:', e);
      return { databaseConnected: false };
    }
  },

  // Steps
  async getSteps(): Promise<DailyStepRecord[] | null> {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT date, steps FROM daily_steps ORDER BY date ASC;`;
      return rows.map((r: any) => ({
        date: r.date,
        steps: Number(r.steps)
      }));
    } catch (err) {
      console.error('Failed to get steps from Neon:', err);
      return null;
    }
  },

  async saveSteps(date: string, steps: number): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`
        INSERT INTO daily_steps (date, steps, updated_at)
        VALUES (${date}, ${steps}, CURRENT_TIMESTAMP)
        ON CONFLICT (date) DO UPDATE 
        SET steps = EXCLUDED.steps, updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`✅ [Neon Live] Step record saved for ${date}: ${steps} steps`);
      return true;
    } catch (err) {
      console.error('Failed to save steps to Neon:', err);
      return false;
    }
  },

  // PRs
  async getPrs(): Promise<PersonalRecord[] | null> {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT * FROM personal_records ORDER BY updated_at DESC;`;
      return rows.map((r: any) => ({
        id: r.id,
        exerciseName: r.exercise_name,
        muscle: r.muscle,
        recordValue: r.record_value,
        rawWeightKg: parseFloat(r.raw_weight_kg),
        reps: r.reps,
        date: r.date,
        gymId: r.gym_id || 'gym-main',
        gymName: r.gym_name || 'Gym',
        romContext: r.rom_context || 'Standard PR',
        isPR: r.is_pr,
        notes: r.notes || '',
        history: Array.isArray(r.history) ? r.history : []
      }));
    } catch (err) {
      console.error('Failed to get PRs from Neon:', err);
      return null;
    }
  },

  async savePr(pr: PersonalRecord): Promise<boolean> {
    if (!sql) return false;
    try {
      const historyJson = JSON.stringify(pr.history || []);
      await sql`
        INSERT INTO personal_records (
          id, exercise_name, muscle, record_value, raw_weight_kg, reps, date,
          gym_id, gym_name, rom_context, is_pr, notes, history, updated_at
        ) VALUES (
          ${pr.id}, ${pr.exerciseName}, ${pr.muscle}, ${pr.recordValue},
          ${pr.rawWeightKg}, ${pr.reps.toString()}, ${pr.date},
          ${pr.gymId || 'gym-main'}, ${pr.gymName || 'Gym'}, ${pr.romContext || 'Standard PR'},
          ${pr.isPR !== false}, ${pr.notes || ''}, ${historyJson}::jsonb, CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          exercise_name = EXCLUDED.exercise_name,
          muscle = EXCLUDED.muscle,
          record_value = EXCLUDED.record_value,
          raw_weight_kg = EXCLUDED.raw_weight_kg,
          reps = EXCLUDED.reps,
          date = EXCLUDED.date,
          rom_context = EXCLUDED.rom_context,
          notes = EXCLUDED.notes,
          history = EXCLUDED.history,
          updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`✅ [Neon Live] PR record saved for ${pr.exerciseName}: ${pr.recordValue}`);
      return true;
    } catch (err) {
      console.error('Failed to save PR to Neon:', err);
      return false;
    }
  },

  async deletePr(id: string): Promise<boolean> {
    if (!sql) return false;
    try {
      await sql`DELETE FROM personal_records WHERE id = ${id};`;
      console.log(`✅ [Neon Live] PR deleted: ${id}`);
      return true;
    } catch (err) {
      console.error('Failed to delete PR from Neon:', err);
      return false;
    }
  },

  // Daily Nutrition
  async getNutritionLogs(): Promise<DailyNutritionLog[] | null> {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT * FROM daily_nutrition ORDER BY date DESC;`;
      return rows.map((r: any) => ({
        id: r.id,
        date: r.date,
        targetCalories: r.target_calories || 1940,
        targetProtein: r.target_protein || 140,
        waterIntakeL: parseFloat(r.water_intake_l) || 2.5,
        waterTargetL: parseFloat(r.water_target_l) || 3.5,
        meals: Array.isArray(r.meals) ? r.meals : [],
        notes: r.notes || ''
      }));
    } catch (err) {
      console.error('Failed to get nutrition logs from Neon:', err);
      return null;
    }
  },

  async saveNutritionLog(log: DailyNutritionLog): Promise<boolean> {
    if (!sql) return false;
    try {
      const mealsJson = JSON.stringify(log.meals || []);
      await sql`
        INSERT INTO daily_nutrition (
          id, date, target_calories, target_protein, water_intake_l, water_target_l, meals, notes, updated_at
        ) VALUES (
          ${log.id}, ${log.date}, ${log.targetCalories || 1940}, ${log.targetProtein || 140},
          ${log.waterIntakeL || 2.5}, ${log.waterTargetL || 3.5}, ${mealsJson}::jsonb,
          ${log.notes || ''}, CURRENT_TIMESTAMP
        )
        ON CONFLICT (date) DO UPDATE SET
          target_calories = EXCLUDED.target_calories,
          target_protein = EXCLUDED.target_protein,
          water_intake_l = EXCLUDED.water_intake_l,
          water_target_l = EXCLUDED.water_target_l,
          meals = EXCLUDED.meals,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`✅ [Neon Live] Nutrition logged for ${log.date}`);
      return true;
    } catch (err) {
      console.error('Failed to save nutrition to Neon:', err);
      return false;
    }
  },

  // Workouts
  async getWorkout(date: string): Promise<WorkoutSession | null> {
    if (!sql) return null;
    try {
      const rows = await sql`SELECT * FROM workout_sessions WHERE date = ${date} LIMIT 1;`;
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        date: r.date,
        dayName: r.day_name,
        splitName: r.split_name,
        gymId: 'gym-main',
        activeTrainingMin: r.active_training_min,
        totalGymMin: r.total_gym_min,
        energyLevel: r.energy_level,
        recoveryLevel: r.recovery_level,
        notes: r.notes,
        exercises: Array.isArray(r.exercises) ? r.exercises : []
      };
    } catch (err) {
      console.error('Failed to get workout from Neon:', err);
      return null;
    }
  },

  async saveWorkout(workout: WorkoutSession): Promise<boolean> {
    if (!sql) return false;
    try {
      const exJson = JSON.stringify(workout.exercises || []);
      await sql`
        INSERT INTO workout_sessions (
          id, date, day_name, split_name, active_training_min, total_gym_min,
          energy_level, recovery_level, notes, exercises, updated_at
        ) VALUES (
          ${workout.id}, ${workout.date}, ${workout.dayName}, ${workout.splitName},
          ${workout.activeTrainingMin || 0}, ${workout.totalGymMin || 0},
          ${workout.energyLevel || 8}, ${workout.recoveryLevel || 8},
          ${workout.notes || ''}, ${exJson}::jsonb, CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          split_name = EXCLUDED.split_name,
          exercises = EXCLUDED.exercises,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`✅ [Neon Live] Workout session saved for ${workout.date}`);
      return true;
    } catch (err) {
      console.error('Failed to save workout to Neon:', err);
      return false;
    }
  }
};
