# Phase 1 — Hero V2 Truth Receipt Upgrade (Table Logger)

Status: **INSTRUMENTED — RUNTIME RECEIPT PENDING**

## Change summary

Added a Hero V2 truth-table logger that emits a single table after settle (1500ms) for each `[data-surface-id]`, including computed opacity, mix-blend-mode, z-index, background image or video `currentSrc`, filter, and visibility/display. The content z-index is logged alongside the table.

## Evidence & rationale

**Evidence required by task:** a single table after settle that includes the computed compositing fields for each surface, plus content z-index. This logger is now installed inside `HeroRendererV2.tsx`, scoped to `HERO_V2_DEBUG` or `?heroTruth=1` sessions. This phase makes no visual changes.

## Diff snippet (Phase 1)

```diff
+            const logTruthTable = () => {
+              const heroRoot = document.querySelector('.hero-renderer-v2[data-hero-root="true"]');
+              if (!heroRoot) {
+                console.groupCollapsed('HERO_V2_TRUTH_TABLE');
+                console.log('HERO_V2_TRUTH_TABLE_DATA', { found: false });
+                console.groupEnd();
+                return;
+              }
+              const surfaceElements = Array.from(heroRoot.querySelectorAll('[data-surface-id]'));
+              const rows = surfaceElements.map((element) => {
+                const styles = window.getComputedStyle(element);
+                const isVideo = element instanceof HTMLVideoElement;
+                const currentSrc = isVideo ? element.currentSrc : null;
+                return {
+                  id: element.getAttribute('data-surface-id') ?? 'unknown',
+                  opacity: styles.opacity,
+                  mixBlendMode: styles.mixBlendMode,
+                  zIndex: styles.zIndex,
+                  backgroundImage: currentSrc || styles.backgroundImage,
+                  filter: styles.filter,
+                  visibility: styles.visibility,
+                  display: styles.display,
+                };
+              });
+              console.groupCollapsed('HERO_V2_TRUTH_TABLE');
+              console.table(rows);
+              const content = heroRoot.querySelector('.hero-content');
+              const contentZIndex = content ? window.getComputedStyle(content).zIndex : 'missing';
+              console.log('HERO_V2_TRUTH_CONTENT_ZINDEX', contentZIndex);
+              console.groupEnd();
+            };
```

## Hero truth receipts

**Before (Phase 0):** No `HERO_V2_TRUTH_TABLE` output existed. No table receipt available.

**After (Phase 1):** Logger is installed. Runtime capture is **pending** until a V2 homepage session is exercised with `HERO_V2_DEBUG=1` or `?heroTruth=1`.

## Next evidence required

- Capture `HERO_V2_TRUTH_TABLE` output on the V2 homepage after 1500ms settle.
- Confirm content z-index vs surface z-index ordering.

## Rollback

```bash
git checkout -- apps/web/app/components/hero/v2/HeroRendererV2.tsx
rm reports/hero/phase1-hero-v2-truth-table-upgrade.md
```
