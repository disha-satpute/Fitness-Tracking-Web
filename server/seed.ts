import { sql, isDbConfigured } from './db.js';
import { HISTORICAL_PRS, INITIAL_STEP_RECORDS } from '../src/data/historicalData.js';

async function seedData() {
  if (!isDbConfigured || !sql) {
    console.log('Database not configured');
    return;
  }

  console.log('🌱 Seeding initial records into Neon PostgreSQL...');

  // Seed PRs
  for (const pr of HISTORICAL_PRS) {
    const historyJson = JSON.stringify(pr.history || []);
    await sql`
      INSERT INTO personal_records (
        id, exercise_name, muscle, record_value, raw_weight_kg, reps, date,
        gym_id, gym_name, rom_context, is_pr, notes, history
      ) VALUES (
        ${pr.id}, ${pr.exerciseName}, ${pr.muscle}, ${pr.recordValue},
        ${pr.rawWeightKg}, ${pr.reps.toString()}, ${pr.date},
        ${pr.gymId || 'gym-main'}, ${pr.gymName || 'Gym'}, ${pr.romContext || 'Standard PR'},
        ${pr.isPR !== false}, ${pr.notes || ''}, ${historyJson}::jsonb
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  // Seed Steps
  for (const s of INITIAL_STEP_RECORDS) {
    await sql`
      INSERT INTO daily_steps (date, steps)
      VALUES (${s.date}, ${s.steps})
      ON CONFLICT (date) DO NOTHING;
    `;
  }

  console.log('✅ Seeding completed successfully!');
  const prCount = await sql`SELECT count(*) FROM personal_records;`;
  const stepCount = await sql`SELECT count(*) FROM daily_steps;`;
  console.log(`📊 Neon Database Status: ${prCount[0].count} PRs, ${stepCount[0].count} Step records loaded.`);
}

seedData().catch(console.error);
