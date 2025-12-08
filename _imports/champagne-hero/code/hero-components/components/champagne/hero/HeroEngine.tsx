import { headers } from "next/headers";

import { HeroFrame } from "./HeroFrame";
import { validateHeroSchema, type HeroSchema } from "@/lib/champagne/hero-schema";

import "@/styles/champagne/hero-engine.css";

type HeroEngineProps = {
  schema: Partial<HeroSchema>;
  allowNonPreview?: boolean;
};

function isPreviewRoute() {
  const hdrs = headers();
  const matchedPath = hdrs.get("x-matched-path") || hdrs.get("next-url") || hdrs.get("referer") || "";
  if (!matchedPath) return true;
  return matchedPath.includes("/preview/");
}

export function HeroEngine({ schema, allowNonPreview = false }: HeroEngineProps) {
  if (!allowNonPreview && !isPreviewRoute()) return null;

  const safeSchema = validateHeroSchema(schema);

  return <HeroFrame schema={safeSchema} />;
}
