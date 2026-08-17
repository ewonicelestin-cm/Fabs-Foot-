import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { sql } from "@vercel/postgres";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const matchId = String(
      body.matchId ?? ""
    ).trim();

    if (!matchId) {
      return Response.json(
        {
          error: "matchId est requis."
        },
        {
          status: 400
        }
      );
    }

    const matchResult = await sql`
      SELECT
        id,
        home_team,
        away_team,
        start_time,
        home_score,
        away_score,
        status
      FROM matches
      WHERE id = ${matchId}
      LIMIT 1
    `;

    if (matchResult.rows.length === 0) {
      return Response.json(
        {
          error: "Match introuvable."
        },
        {
          status: 404
        }
      );
    }

    const match = matchResult.rows[0];

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error:
            "OPENAI_API_KEY n'est pas configurée."
        },
        {
          status: 500
        }
      );
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `
Tu es un analyste sportif spécialisé
dans l'analyse statistique du football.

Tu dois produire une analyse prudente.
Tu ne dois jamais présenter une prédiction
comme une certitude ou une garantie de gain.

Structure ta réponse avec :

1. Analyse du match
2. Situation des deux équipes
3. Tendances disponibles
4. Scénario probable
5. Pronostic principal
6. Niveau de confiance

Lorsque les données statistiques détaillées
ne sont pas disponibles, indique clairement
que l'analyse est limitée.
      `,
      prompt: `
Analyse le match suivant :

${match.home_team}
contre
${match.away_team}

Score actuel :
${match.home_score} - ${match.away_score}

Statut :
${match.status}

Date :
${match.start_time}

Donne une analyse concise et compréhensible
en français.
      `
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error(
      "POST /api/predictions error:",
      error
    );

    return Response.json(
      {
        error:
          "Impossible de générer le pronostic."
      },
      {
        status: 500
      }
    );
  }
}
