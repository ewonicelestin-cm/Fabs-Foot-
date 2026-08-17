import { sql } from "@vercel/postgres";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const teamId =
      searchParams.get("teamId");

    if (!teamId) {
      return Response.json(
        {
          error: "teamId est requis."
        },
        {
          status: 400
        }
      );
    }

    const result = await sql`
      WITH team_matches AS (
        SELECT
          id,
          home_team,
          away_team,
          home_score,
          away_score,
          status
        FROM matches
        WHERE
          home_team = ${teamId}
          OR away_team = ${teamId}
      )
      SELECT
        COUNT(*)::int AS matches_played,

        COUNT(*) FILTER (
          WHERE
            (
              home_team = ${teamId}
              AND home_score > away_score
            )
            OR
            (
              away_team = ${teamId}
              AND away_score > home_score
            )
        )::int AS wins,

        COUNT(*) FILTER (
          WHERE home_score = away_score
        )::int AS draws,

        COUNT(*) FILTER (
          WHERE
            (
              home_team = ${teamId}
              AND home_score < away_score
            )
            OR
            (
              away_team = ${teamId}
              AND away_score < home_score
            )
        )::int AS losses,

        COALESCE(
          AVG(
            CASE
              WHEN home_team = ${teamId}
              THEN home_score
              ELSE away_score
            END
          ),
          0
        ) AS avg_goals_for,

        COALESCE(
          AVG(
            CASE
              WHEN home_team = ${teamId}
              THEN away_score
              ELSE home_score
            END
          ),
          0
        ) AS avg_goals_against

      FROM team_matches
    `;

    return Response.json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "GET /api/stats error:",
      error
    );

    return Response.json(
      {
        error:
          "Impossible de récupérer les statistiques."
      },
      {
        status: 500
      }
    );
  }
}
