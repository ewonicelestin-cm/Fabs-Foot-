import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const result = await sql`
      SELECT
        id,
        home_team AS "homeTeam",
        away_team AS "awayTeam",
        start_time AS "startTime",
        home_score AS "homeScore",
        away_score AS "awayScore",
        status
      FROM matches
      WHERE start_time >= NOW() - INTERVAL '7 days'
      ORDER BY start_time ASC
      LIMIT 50
    `;

    return Response.json(result.rows);
  } catch (error) {
    console.error("GET /api/matches error:", error);

    return Response.json(
      {
        error: "Impossible de récupérer les matchs."
      },
      {
        status: 500
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const homeTeam = String(
      body.homeTeam ?? ""
    ).trim();

    const awayTeam = String(
      body.awayTeam ?? ""
    ).trim();

    const startTime = String(
      body.startTime ?? ""
    ).trim();

    if (!homeTeam || !awayTeam || !startTime) {
      return Response.json(
        {
          error:
            "homeTeam, awayTeam et startTime sont requis."
        },
        {
          status: 400
        }
      );
    }

    const result = await sql`
      INSERT INTO matches (
        home_team,
        away_team,
        start_time
      )
      VALUES (
        ${homeTeam},
        ${awayTeam},
        ${startTime}
      )
      RETURNING
        id,
        home_team AS "homeTeam",
        away_team AS "awayTeam",
        start_time AS "startTime",
        home_score AS "homeScore",
        away_score AS "awayScore",
        status
    `;

    return Response.json(
      result.rows[0],
      {
        status: 201
      }
    );
  } catch (error) {
    console.error("POST /api/matches error:", error);

    return Response.json(
      {
        error: "Impossible de créer le match."
      },
      {
        status: 500
      }
    );
  }
}
