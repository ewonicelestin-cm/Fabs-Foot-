"use client";

interface LeaderboardEntry {
  id: string;
  userId: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
}

export default function Leaderboard() {

  const leaders: LeaderboardEntry[] = [
    {
      id: "1",
      userId: "User1",
      correctPredictions: 45,
      totalPredictions: 50,
      accuracy: 90
    },
    {
      id: "2",
      userId: "User2",
      correctPredictions: 42,
      totalPredictions: 50,
      accuracy: 84
    },
    {
      id: "3",
      userId: "User3",
      correctPredictions: 40,
      totalPredictions: 50,
      accuracy: 80
    }
  ];

  return (
    <div className="glass-effect p-6 rounded-lg">

      <h3 className="text-xl font-bold text-white mb-4">
        🏅 Top Prédicteurs
      </h3>

      <div className="space-y-2">

        {leaders.map((leader, index) => (

          <div
            key={leader.id}
            className="flex items-center justify-between p-2 hover:bg-slate-700/50 rounded transition"
          >

            <div className="flex items-center gap-3">

              <span className="font-bold text-lg text-blue-400">
                #{index + 1}
              </span>

              <div>

                <p className="text-white font-semibold">
                  {leader.userId}
                </p>

                <p className="text-xs text-gray-400">
                  {leader.correctPredictions}/
                  {leader.totalPredictions}
                </p>

              </div>

            </div>

            <span className="text-green-400 font-bold">
              {leader.accuracy}%
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}
