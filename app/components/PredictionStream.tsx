"use client";

import { useEffect, useState } from "react";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export default function PredictionStream({
  match
}: {
  match: Match;
}) {
  const [prediction, setPrediction] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    let cancelled = false;

    async function fetchPrediction() {

      setLoading(true);
      setPrediction("");
      setError("");

      try {

        const response = await fetch(
          "/api/predictions",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              matchId: match.id
            })
          }
        );

        if (!response.ok) {

          const data =
            await response.json();

          throw new Error(
            data.error ||
              "Erreur de génération"
          );
        }

        if (!response.body) {
          throw new Error(
            "Flux indisponible"
          );
        }

        const reader =
          response.body.getReader();

        const decoder =
          new TextDecoder();

        while (!cancelled) {

          const { done, value } =
            await reader.read();

          if (done) break;

          const text =
            decoder.decode(value, {
              stream: true
            });

          setPrediction(
            (previous) =>
              previous + text
          );
        }

      } catch (err) {

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur inconnue"
          );
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    }

    fetchPrediction();

    return () => {
      cancelled = true;
    };

  }, [match.id]);

  return (
    <div className="min-h-64">

      <h3 className="text-lg font-bold text-white mb-3">
        {match.homeTeam} vs {match.awayTeam}
      </h3>

      {loading && (
        <div className="text-center py-8">

          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />

          <p className="text-gray-400 text-sm mt-2">
            Génération du pronostic...
          </p>

        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded">
          {error}
        </div>
      )}

      {prediction && (
        <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
          {prediction}
        </div>
      )}

    </div>
  );
}
