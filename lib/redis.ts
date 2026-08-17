import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  const redisUrl =
    process.env.REDIS_URL;

  if (!redisUrl) {
    return null;
  }

  if (!redis) {
    redis = new Redis(redisUrl);

    redis.on("error", (error) => {
      console.error(
        "Redis error:",
        error
      );
    });

    redis.on("connect", () => {
      console.log(
        "✅ Redis connected"
      );
    });
  }

  return redis;
}

export async function cacheMatch(
  matchId: string,
  data: unknown,
  ttl = 300
): Promise<void> {
  const client = getRedis();

  if (!client) {
    return;
  }

  try {
    await client.setex(
      `match:${matchId}`,
      ttl,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "Redis cache error:",
      error
    );
  }
}

export async function getCachedMatch(
  matchId: string
): Promise<unknown | null> {
  const client = getRedis();

  if (!client) {
    return null;
  }

  try {
    const cached =
      await client.get(
        `match:${matchId}`
      );

    if (!cached) {
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error(
      "Redis get error:",
      error
    );

    return null;
  }
}

export async function deleteCachedMatch(
  matchId: string
): Promise<void> {
  const client = getRedis();

  if (!client) {
    return;
  }

  try {
    await client.del(
      `match:${matchId}`
    );
  } catch (error) {
    console.error(
      "Redis delete error:",
      error
    );
  }
}
