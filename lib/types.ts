export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prediction {
  id: string;
  matchId: string;
  prediction: string;
  confidence: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchApiResponse {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
}
