export function isBrandHeroEnabled() {
  const flag = process.env.NEXT_PUBLIC_FEATURE_BRAND_HERO;

  if (flag === undefined) {
    return process.env.NODE_ENV !== "production";
  }

  return flag === "true" || flag === "1";
}
