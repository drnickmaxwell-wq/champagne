export const UI_RATE_LIMIT_COOLDOWN_SECONDS = 20;
export const PRIVACY_TRIPWIRE_PREFIX = "For your privacy,";

export function isRateLimit429Payload(status: number, payload: unknown): boolean {
  if (status !== 429) return false;
  const errorText =
    payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
      ? payload.error.trim().toLowerCase()
      : "";
  return errorText === "rate limit exceeded";
}

export function isBlockedHttpStatus(status: number): boolean {
  return status === 403;
}

export function isBlockedNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof DOMException && error.name === "AbortError") return true;
  if (!(error instanceof Error)) return false;
  return /failed to fetch|networkerror|load failed|network request failed/i.test(error.message);
}

export function isPrivacyTripwireContent(content: string): boolean {
  return content.trimStart().startsWith(PRIVACY_TRIPWIRE_PREFIX);
}

export function createCooldownUntil(now: number = Date.now(), seconds = UI_RATE_LIMIT_COOLDOWN_SECONDS): number {
  return now + seconds * 1000;
}

export function getCooldownRemainingMs(cooldownUntil: number | null, now: number = Date.now()): number {
  if (!cooldownUntil) return 0;
  return Math.max(0, cooldownUntil - now);
}

export function getCooldownRemainingSeconds(cooldownUntil: number | null, now: number = Date.now()): number {
  return Math.ceil(getCooldownRemainingMs(cooldownUntil, now) / 1000);
}

export function buildConverseHeaders(options: { debugEnabled: boolean; isDev: boolean }): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.isDev && options.debugEnabled) {
    headers["x-debug-chat"] = "1";
  }

  return headers;
}
