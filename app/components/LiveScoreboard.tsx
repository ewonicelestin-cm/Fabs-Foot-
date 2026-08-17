"use client";

import { useEffect, useState } from "react";

interface LiveUpdate {
  matchId: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export default function LiveScoreboard() {

  const [updates, setUpdates] =
    useState<LiveUpdate[]>([]);

  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const response =
          await fetch("/api/matches", {
            cache: "no-store"
          });

        if (!response.ok) return;

        const matches =
          await response.json();

        const liveMatches =
          matches
            .filter(
              (match: LiveUpdate) =>
                match.status === "LIVE" ||
                match.status === "IN_PROGRESS"
            )
            .map((match: any) => ({
              matchId: match.id,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              status: match.status
            }));

        setUpdates(liveMatches);

      } catch (error) {
        console.error(
          "Live scoreboard error:",
          error
        );
      }

    }, 30000);

    return () =>
      clearInterval(interval);

  }, []);

  return (
    <div
      id="live"
      className="glass-effect p-4 rounded-lg"
    >

      <h4 className="font-bold text-white mb-3">
        🔴 Mises à jour en direct
      </h4>

      {updates.length === 0 ? (

        <p className="text-gray-400 text-sm">
          Aucun match en direct actuellement.
        </p>

      ) : (

        <div className="space-y-2">

          {updates.map((update) => (

            <p
              key={update.matchId}
              className="text-sm text-gray-300"
            >
              Match {update.matchId}:{" "}
              {update.homeScore}-
              {update.awayScore}{" "}
              ({update.status})
            </p>

          ))}

        </div>

      )}

    </div>
  );
}
