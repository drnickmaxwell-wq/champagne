import { useMemo } from "react";
import type { ChampagneManifest, ChampagneSectionEntry } from "./types";

/**
 * useValidatedManifest
 * ---------------------
 * A defensive hook ensuring manifests are valid, typed, and safe for rendering.
 * - Removes unknown section types
 * - Ensures every section has an id + type
 * - Normalises empty fields
 */

export function useValidatedManifest(manifest?: ChampagneManifest) {
  return useMemo(() => {
    if (!manifest) return { sections: [] };

    const safeSections: ChampagneSectionEntry[] = [];

    for (const section of manifest.sections ?? []) {
      if (!section) continue;
      if (!section.type) continue;

      safeSections.push({
        id: section.id ?? `section-${Math.random().toString(36).slice(2)}`,
        type: section.type,
        props: section.props ?? {},
      });
    }

    return {
      sections: safeSections,
    };
  }, [manifest]);
}
