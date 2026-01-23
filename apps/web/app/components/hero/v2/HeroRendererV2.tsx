import type { CSSProperties, ReactNode, Ref } from "react";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";
import heroGlueManifest from "./heroGlue.manifest.json";
import { HeroSurfaceStackV2 } from "./HeroV2Client";

const HERO_V2_DEBUG = process.env.NEXT_PUBLIC_HERO_DEBUG === "1";

export interface HeroRendererV2Props {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
  pageCategory?: "home" | "treatment" | "editorial" | "utility" | "marketing" | string;
  rootStyle?: CSSProperties;
  glueVars?: Partial<{
    waveRingsSize: string;
    waveRingsRepeat: string;
    waveRingsPosition: string;
    waveRingsImageRendering: string;
    dotGridSize: string;
    dotGridRepeat: string;
    dotGridPosition: string;
    dotGridImageRendering: string;
  }>;
}

export interface HeroV2GlueModel {
  dotGrid: {
    path: string;
  };
  waveRings: {
    path: string;
  };
}

export interface HeroV2Model {
  surface: ReturnType<typeof BaseChampagneSurface>;
  glue: HeroV2GlueModel;
  debug: {
    enabled: boolean;
  };
}

function toStablePathKey(pathname: string) {
  const p = (pathname || "/").split("?")[0].split("#")[0];
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

function computeV2GlueModel(opts: {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  pageCategory?: string;
  glueVars?: HeroRendererV2Props["glueVars"];
}) {
  const dotGridEntry = heroGlueManifest.dotGrid;
  const waveRingsEntry = heroGlueManifest.waveRings;

  const dotGridPath = ensureHeroAssetPath(dotGridEntry.path);
  const waveRingsPath = ensureHeroAssetPath(waveRingsEntry.path);

  return {
    glue: {
      dotGrid: { path: dotGridPath },
      waveRings: { path: waveRingsPath },
    },
    glueVars: opts.glueVars,
  };
}

export async function buildHeroV2Model(props: {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  pageCategory?: string;
  rootStyle?: CSSProperties;
  glueVars?: HeroRendererV2Props["glueVars"];
}) {
  const runtime = getHeroRuntime();

  const surface = BaseChampagneSurface({
    runtime,
    mode: props.mode,
    treatmentSlug: props.treatmentSlug,
    prm: props.prm,
    timeOfDay: props.timeOfDay,
    particles: props.particles,
    filmGrain: props.filmGrain,
    diagnosticBoost: props.diagnosticBoost,
    pageCategory: props.pageCategory,
  });

  const glue = computeV2GlueModel({
    mode: props.mode,
    treatmentSlug: props.treatmentSlug,
    prm: props.prm,
    timeOfDay: props.timeOfDay,
    particles: props.particles,
    filmGrain: props.filmGrain,
    diagnosticBoost: props.diagnosticBoost,
    pageCategory: props.pageCategory,
    glueVars: props.glueVars,
  });

  return {
    surface,
    glue: glue.glue,
    debug: {
      enabled: HERO_V2_DEBUG,
    },
  } satisfies HeroV2Model;
}

export function HeroV2Frame(props: {
  children: ReactNode;
} & Record<string, unknown>) {
  const { children, ...rest } = props;

  return (
    <div
      {...rest}
      data-hero-frame="v2"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export function HeroContentV2(_props: HeroRendererV2Props) {
  return null;
}

export function HeroRendererV2(props: HeroRendererV2Props) {
  // NOTE: deterministic mount architecture:
  // - model is built server-side via buildHeroV2Model (HeroMount.tsx)
  // - this component is a rendering facade only
  // - NO "use client" here

  // This component intentionally returns null because the V2 visual stack is rendered by HeroSurfaceStackV2
  // which is mounted by HeroMount inside HeroV2Frame.
  // Keeping this function allows compatibility with existing call sites that expect a HeroRenderer-like API.
  return null;
}

export function HeroSurfaceStackV2Facade(props: {
  model: HeroV2Model;
  surfaceRef?: Ref<HTMLDivElement>;
  rootStyle?: CSSProperties;
}) {
  return <HeroSurfaceStackV2 model={props.model} surfaceRef={props.surfaceRef} rootStyle={props.rootStyle} />;
}
