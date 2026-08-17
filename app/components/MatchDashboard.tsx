"use client";

import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import PredictionStream from "./PredictionStream";
import Leaderboard from "./Leaderboard";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export default function MatchDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] =
    useState<Match | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        "/api/matches",
        {
          cache: "no-store"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur serveur"
        );
      }

      const receivedMatches =
        Array.isArray(data) ? data : [];

      setMatches(receivedMatches);

      setSelectedMatch((current) => {
        if (current) {
          const updated = receivedMatches.find(
            (match: Match) =>
              match.id === current.id
          );

          return updated || current;
        }

        return receivedMatches[0] || null;
      });

      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    const interval = setInterval(
      fetchMatches,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">

      {/* HERO */}

      <section className="text-center py-12">

        <h2 className="text-5xl font-bold gradient-text mb-4">
          Pronostics Sportifs Intelligents
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Analyses automatisées et prédictions
          sportives alimentées par intelligence
          artificielle.
        </p>

      </section>

      {/* CONTENU */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MATCHS */}

        <div className="lg:col-span-2">

          <div className="glass-effect p-6 rounded-lg">

            <h2 className="text-2xl font-bold text-white mb-4">
              🎯 Matchs
            </h2>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />

                <p className="text-gray-400 mt-3">
                  Chargement des matchs...
                </p>
              </div>
            ) : matches.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Aucun match disponible.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">

                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onClick={() =>
                      setSelectedMatch(match)
                    }
                    isSelected={
                      selectedMatch?.id === match.id
                    }
                  />
                ))}

              </div>
            )}

          </div>

        </div>

        {/* PRONOSTIC */}

        <div className="space-y-6">

          <div className="glass-effect p-6 rounded-lg">

            <h2 className="text-2xl font-bold text-white mb-4">
              🤖 Pronostic IA
            </h2>

            {selectedMatch ? (
              <PredictionStream
                match={selectedMatch}
              />
            ) : (
              <div className="text-gray-400 text-center py-12">
                Sélectionnez un match.
              </div>
            )}

          </div>

          <Leaderboard />

        </div>

      </div>

    </div>
  );
}
