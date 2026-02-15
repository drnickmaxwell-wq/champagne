export type RateLimitState = {
  hits: Map<string, number[]>;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __handoffRateLimitState?: RateLimitState;
};

const rateLimitState: RateLimitState =
  globalForRateLimit.__handoffRateLimitState ??
  (globalForRateLimit.__handoffRateLimitState = { hits: new Map() });

export function resolveClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function isRateLimited(clientIp: string): boolean {
  const rateLimitWindowMs = Number(process.env.HANDOFF_RATE_LIMIT_WINDOW_MS ?? 60_000);
  const rateLimitMax = Number(process.env.HANDOFF_RATE_LIMIT_MAX ?? 5);
  const now = Date.now();
  const windowStart = now - rateLimitWindowMs;
  const timestamps = rateLimitState.hits.get(clientIp)?.filter((ts) => ts > windowStart) ?? [];

  if (timestamps.length >= rateLimitMax) {
    rateLimitState.hits.set(clientIp, timestamps);
    return true;
  }

  timestamps.push(now);
  rateLimitState.hits.set(clientIp, timestamps);
  return false;
}

export function resetHandoffRateLimitStateForTests() {
  rateLimitState.hits.clear();
}
