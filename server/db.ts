import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

export const isDbConfigured = Boolean(connectionString && !connectionString.includes('YOUR_NEON_DATABASE_URL'));

// Returns sql query runner if configured, else null
export const sql = isDbConfigured ? neon(connectionString) : null;

// Initialize tables automatically
export async function initDb() {
  if (!sql) {
    console.log('⚠️ [Neon DB] DATABASE_URL not set yet. Running in offline/fallback memory mode.');
    return;
  }

  try {
    console.log('🔄 [Neon DB] Checking/initializing database tables...');

    // 1. Daily Steps Table
    await sql`
      CREATE TABLE IF NOT EXISTS daily_steps (
        date VARCHAR(20) PRIMARY KEY,
        steps INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Personal Records Table
    await sql`
      CREATE TABLE IF NOT EXISTS personal_records (
        id VARCHAR(50) PRIMARY KEY,
        exercise_name VARCHAR(255) NOT NULL,
        muscle VARCHAR(100) NOT NULL,
        record_value VARCHAR(100) NOT NULL,
        raw_weight_kg NUMERIC NOT NULL,
        reps VARCHAR(50) NOT NULL,
        date VARCHAR(50) NOT NULL,
        gym_id VARCHAR(50),
        gym_name VARCHAR(100),
        rom_context VARCHAR(255),
        is_pr BOOLEAN DEFAULT TRUE,
        notes TEXT,
        history JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Workouts Log Table
    await sql`
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(20) NOT NULL,
        day_name VARCHAR(20),
        split_name VARCHAR(100),
        active_training_min INTEGER,
        total_gym_min INTEGER,
        energy_level INTEGER,
        recovery_level INTEGER,
        notes TEXT,
        exercises JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Daily Nutrition Table
    await sql`
      CREATE TABLE IF NOT EXISTS daily_nutrition (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(20) UNIQUE NOT NULL,
        target_calories INTEGER,
        target_protein INTEGER,
        water_intake_l NUMERIC,
        water_target_l NUMERIC,
        meals JSONB DEFAULT '[]'::jsonb,
        notes TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Weight Records Table
    await sql`
      CREATE TABLE IF NOT EXISTS weight_records (
        id VARCHAR(50) PRIMARY KEY,
        date VARCHAR(20) NOT NULL,
        weight NUMERIC NOT NULL,
        period_label VARCHAR(50),
        notes TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('✅ [Neon DB] All tables verified and ready!');
  } catch (err) {
    console.error('❌ [Neon DB] Init error:', err);
  }
}
