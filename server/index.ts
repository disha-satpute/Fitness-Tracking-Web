import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql, isDbConfigured, initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health & Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseConnected: isDbConfigured,
    timestamp: new Date().toISOString()
  });
});

// ========================
// DAILY STEPS ENDPOINTS
// ========================
app.get('/api/steps', async (req, res) => {
  if (!sql) return res.json({ success: true, data: [] });
  try {
    const rows = await sql`SELECT date, steps FROM daily_steps ORDER BY date ASC;`;
    res.json({ success: true, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/steps', async (req, res) => {
  const { date, steps } = req.body;
  if (!date || typeof steps !== 'number') {
    return res.status(400).json({ success: false, error: 'date and steps required' });
  }

  if (!sql) return res.json({ success: true, synced: false, message: 'DB not configured' });

  try {
    await sql`
      INSERT INTO daily_steps (date, steps, updated_at)
      VALUES (${date}, ${steps}, CURRENT_TIMESTAMP)
      ON CONFLICT (date) DO UPDATE 
      SET steps = EXCLUDED.steps, updated_at = CURRENT_TIMESTAMP;
    `;
    res.json({ success: true, synced: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// PERSONAL RECORDS ENDPOINTS
// ========================
app.get('/api/prs', async (req, res) => {
  if (!sql) return res.json({ success: true, data: [] });
  try {
    const rows = await sql`SELECT * FROM personal_records ORDER BY updated_at DESC;`;
    const formatted = rows.map((r: any) => ({
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
      history: r.history || []
    }));
    res.json({ success: true, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/prs', async (req, res) => {
  const pr = req.body;
  if (!pr || !pr.id || !pr.exerciseName) {
    return res.status(400).json({ success: false, error: 'Invalid PR payload' });
  }

  if (!sql) return res.json({ success: true, synced: false });

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
    res.json({ success: true, synced: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/prs/:id', async (req, res) => {
  const { id } = req.params;
  if (!sql) return res.json({ success: true, synced: false });
  try {
    await sql`DELETE FROM personal_records WHERE id = ${id};`;
    res.json({ success: true, synced: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// WORKOUT SESSIONS ENDPOINTS
// ========================
app.get('/api/workouts/:date', async (req, res) => {
  const { date } = req.params;
  if (!sql) return res.json({ success: true, data: null });
  try {
    const rows = await sql`SELECT * FROM workout_sessions WHERE date = ${date} LIMIT 1;`;
    if (rows.length === 0) return res.json({ success: true, data: null });
    const r = rows[0];
    res.json({
      success: true,
      data: {
        id: r.id,
        date: r.date,
        dayName: r.day_name,
        splitName: r.split_name,
        activeTrainingMin: r.active_training_min,
        totalGymMin: r.total_gym_min,
        energyLevel: r.energy_level,
        recoveryLevel: r.recovery_level,
        notes: r.notes,
        exercises: r.exercises || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/workouts', async (req, res) => {
  const workout = req.body;
  if (!workout || !workout.id || !workout.date) {
    return res.status(400).json({ success: false, error: 'Invalid workout' });
  }
  if (!sql) return res.json({ success: true, synced: false });
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
    res.json({ success: true, synced: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 [Backend Server] Listening on http://localhost:${PORT}`);
  await initDb();
});
