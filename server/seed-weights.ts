import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { HISTORICAL_WEIGHT_RECORDS } from '../src/data/historicalData.js';

dotenv.config();

const connectionString = process.env.VITE_NEON_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(connectionString!);

async function seedWeights() {
  console.log('⚖️ Seeding historical weight records into Neon...');
  for (const w of HISTORICAL_WEIGHT_RECORDS) {
    await sql`
      INSERT INTO weight_records (id, date, weight, period_label, notes, updated_at)
      VALUES (${w.id}, ${w.date}, ${w.weight}, ${w.periodLabel}, ${w.notes || ''}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        weight = EXCLUDED.weight,
        period_label = EXCLUDED.period_label,
        notes = EXCLUDED.notes;
    `;
  }
  const count = await sql`SELECT count(*) FROM weight_records;`;
  console.log(`✅ Weight records in Neon: ${count[0].count} rows!`);
}

seedWeights().catch(console.error);
