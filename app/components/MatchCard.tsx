"use client";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  isSelected: boolean;
}

export default function MatchCard({
  match,
  onClick,
  isSelected
}: MatchCardProps) {

  const isLive =
    match.status === "LIVE" ||
    match.status === "IN_PROGRESS";

  const formattedTime =
    new Date(match.startTime).toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg text-left border-2 transition-all duration-200 ${
        isSelected
          ? "bg-blue-600/50 border-blue-400 shadow-lg shadow-blue-500/20"
          : "glass-effect border-slate-600 hover:border-slate-500"
      }`}
    >

      <div className="flex justify-between items-center gap-4">

        <div className="flex-1">

          <p className="text-white font-semibold">
            {match.homeTeam}
          </p>

          <p
            className={`text-sm ${
              isLive
                ? "text-red-400 font-bold"
                : "text-gray-400"
            }`}
          >
            {isLive
              ? "🔴 EN DIRECT"
              : formattedTime}
          </p>

        </div>

        <div className="text-center px-4">

          <p className="text-white font-bold text-2xl">
            {match.homeScore} - {match.awayScore}
          </p>

          <p className="text-gray-400 text-xs">
            {match.status}
          </p>

        </div>

        <div className="flex-1 text-right">

          <p className="text-white font-semibold">
            {match.awayTeam}
          </p>

          <p className="text-gray-400 text-sm">
            vs
          </p>

        </div>

      </div>

    </button>
  );
}
