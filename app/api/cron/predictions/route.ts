import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { sql } from "@vercel/postgres";

export const maxDuration = 60;

export async function GET(
  request: Request
) {
  const authorization =
    request.headers.get("authorization");

  const expected =
    `Bearer ${process.env.CRON_SECRET}`;

  if (
    !process.env.CRON_SECRET ||
    authorization !== expected
  ) {
    return Response.json(
      {
        error: "Unauthorized"
      },
      {
        status: 401
      }
    );
  }

  try {
    const matches = await sql`
      SELECT
        id,
        home_team,
        away_team,
        home_score,
        away_score,
        status
      FROM matches
      WHERE
        status IN (
          'LIVE',
          'IN_PROGRESS'
        )
        OR (
          start_time <= NOW()
          AND start_time > NOW() - INTERVAL '2 hours'
        )
      ORDER BY start_time DESC
      LIMIT 10
    `;

    let updatedCount = 0;

    for (const match of matches.rows) {
      try {
        const result =
          await generateText({
            model: openai("gpt-4o-mini"),

            system: `
Tu es un analyste sportif.
Analyse les informations disponibles
sans présenter le résultat comme garanti.
            `,

            prompt: `
Match :

${match.home_team}
vs
${match.away_team}

Score :
${match.home_score} - ${match.away_score}

Statut :
${match.status}

Donne une analyse courte de
2 à 4 phrases en français.
            `
          });

        await sql`
          INSERT INTO predictions (
            match_id,
            prediction,
            confidence
          )
          VALUES (
            ${match.id},
            ${result.text},
            NULL
          )
        `;

        updatedCount++;
      } catch (error) {
        console.error(
          `Erreur match ${match.id}:`,
          error
        );
      }
    }

    return Response.json({
      success: true,
      processed: matches.rows.length,
      updated: updatedCount,
      timestamp:
        new Date().toISOString()
    });
  } catch (error) {
    console.error(
      "Cron predictions error:",
      error
    );

    return Response.json(
      {
        error:
          "Erreur lors de la mise à jour des pronostics."
      },
      {
        status: 500
      }
    );
  }
}
