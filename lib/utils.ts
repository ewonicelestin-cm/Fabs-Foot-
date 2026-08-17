export function formatDate(
  date: Date | string
): string {
  const parsedDate =
    typeof date === "string"
      ? new Date(date)
      : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date invalide";
  }

  return parsedDate.toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

export function formatTime(
  date: Date | string
): string {
  const parsedDate =
    typeof date === "string"
      ? new Date(date)
      : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "--:--";
  }

  return parsedDate.toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

export function calculateAccuracy(
  correct: number,
  total: number
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round(
    (correct / total) * 100
  );
}

export function isMatchLive(
  status: string
): boolean {
  return (
    status === "LIVE" ||
    status === "IN_PROGRESS"
  );
}

export function isValidDate(
  date: Date | string
): boolean {
  const parsedDate =
    typeof date === "string"
      ? new Date(date)
      : date;

  return !Number.isNaN(
    parsedDate.getTime()
  );
}
