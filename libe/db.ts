import { sql } from "@vercel/postgres";

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        home_team VARCHAR(255) NOT NULL,
        away_team VARCHAR(255) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        home_score INTEGER DEFAULT 0,
        away_score INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'SCHEDULED',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS predictions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        match_id UUID NOT NULL
          REFERENCES matches(id)
          ON DELETE CASCADE,
        prediction TEXT NOT NULL,
        confidence DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) UNIQUE NOT NULL,
        correct_predictions INTEGER DEFAULT 0,
        total_predictions INTEGER DEFAULT 0,
        accuracy DOUBLE PRECISION DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_matches_status
      ON matches(status)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_matches_start_time
      ON matches(start_time)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_predictions_match_id
      ON predictions(match_id)
    `;

    console.log(
      "✅ Database initialized successfully"
    );
  } catch (error) {
    console.error(
      "❌ Database initialization error:",
      error
    );

    throw error;
  }
}
