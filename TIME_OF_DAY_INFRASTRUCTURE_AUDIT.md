# TIME_OF_DAY_INFRASTRUCTURE_AUDIT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Time-of-day infrastructure exists only in partial form.

Implemented:

- Hero type support for `day`, `evening`, and `night`.
- Hero runtime option `timeOfDay`.
- Hero weather manifest entries for day/evening/night.
- Hero preview mapping from light/dark query state to day/night.
- Token CSS selectors for dawn/dusk/night on `:root[data-theme]`.
- Canon-level time-of-day schemas and recipes.

Not implemented:

- No global `TimeOfDayProvider` or atmosphere provider found.
- No automatic clock/local-time scheduler found.
- No app-wide day/night theme controller found.
- No persisted user time-of-day preference found.
- No route-level time-of-day manifest found.
- No seasonal calendar or holiday layer found.
- No wiring from canon dawn/midday/goldenHour/inkfall into runtime day/evening/night.

## Evidence

### Hero type and runtime

`HeroConfig.ts` defines `HeroTimeOfDay` as `"day" | "evening" | "night"`, and `HeroVariantConfig` can carry `timeOfDay`. `HeroRuntime.ts` accepts `timeOfDay` in runtime options, uses it to select a matching variant, and uses it to read `manifests.weather[options.timeOfDay]`.

Key runtime behavior:

1. Explicit `variantId` wins.
2. Treatment slug match wins next.
3. `timeOfDay` match is checked after treatment slug matching.
4. Default variant is used if none match.
5. Weather config is merged from `manifests.weather[options.timeOfDay]`.

This means time-of-day is available as a hero input, but it is not the primary routing selector if variant or treatment selection already resolves.

### Hero manifests

`sacred_hero_base.json` defaults tone to `night`, declares the default atmospheric surface stack, allowlists motion layers, and disables video.

`sacred_hero_weather.json` defines:

- day: tone day, teal particles, glass shimmer motion.
- evening: tone evening, gold particles, `overlay.goldDust` motion.
- night: tone night, primary particles, caustics motion.

`sacred_hero_variants.json` contains one explicit `timeOfDay: day` variant. Most variants are tone night or treatment/family particle/energy variants without time-of-day metadata.

### Hero preview

The hero preview page maps `theme=light` to `timeOfDay="day"` and all other theme values to `timeOfDay="night"`. There is no preview path for evening except direct runtime usage elsewhere if provided.

### Token CSS

`packages/champagne-tokens/styles/champagne/time-of-day.css` defines three root selectors:

- `:root[data-theme='dawn']`
- `:root[data-theme='dusk']`
- `:root[data-theme='night']`

Only `--bg-ink` is changed. There are no CSS variables for canon parameters such as particle visibility, glass opacity, lighting temperature, vignette strength, or sheen intensity.

### Canon-level time states

The canon fx schema defines temporal states `dawn`, `midday`, `goldenHour`, and `inkfall`. The lighting/shimmer recipes describe dawn, midday, golden hour, and inkfall behaviors. Narrative canon maps chapters to dawn, midday, goldenHour, ceremonial, and inkfall.

This vocabulary is not aligned with the hero runtime day/evening/night vocabulary.

## Day/night truth

Day/night exists in the hero layer and preview layer, not as an app-wide system.

- Night is the sacred hero base default.
- Day can be requested through preview `theme=light` and runtime `timeOfDay="day"`.
- Evening is typed and present in weather manifest, but no preview mapping or app-wide invocation was found.

## Risks

1. Vocabulary split: CSS uses dawn/dusk/night; hero uses day/evening/night; canon uses dawn/midday/goldenHour/inkfall.
2. Evening weather references `overlay.goldDust`, while most motion manifests use `overlay.goldDustDrift`.
3. Time-of-day runtime exists but is not globally sourced from user, clock, route, or environment.
4. Current CSS time-of-day selector only affects `--bg-ink`, so it is not sufficient for the full canon-defined atmospheric behavior.

## Readiness

Time-of-day readiness is `PARTIAL_FOUNDATION`.

A future implementation could safely start from the existing hero runtime hook and token CSS import structure, but must first reconcile vocabulary, decide source of truth, and validate evening motion token IDs.
