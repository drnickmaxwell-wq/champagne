# SPA_LINK_CLICK_FIRST_FRAME_EVIDENCE

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: production-build SPA transition capture; documentation-only
Evidence date: 2026-06-05

## Tooling limitation

The capture script attempted true Link-click transitions with Playwright and immediate post-click screenshots. This provides an earliest observable post-click frame in this environment, but not a browser compositor filmstrip. The `/` to `/treatments/composite-bonding` transition could not be clicked from the sampled viewport because no direct `a[href="/treatments/composite-bonding"]` link was present on the home page at capture time.

## Transition matrix

| Transition | Phase | Browser path | Click performed | nav pixel | hero-mid pixel | hero-lower pixel | content-start pixel | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` → `/treatments/composite-bonding` | before attempted click | `/` | no | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | No direct anchor found; transition not captured. |
| `/treatments/composite-bonding` → `/` | before click | `/treatments/composite-bonding` | yes | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | Start state. |
| `/treatments/composite-bonding` → `/` | immediate after click | `/` | yes | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | Earliest observed route state retained pre-settle composite. |
| `/treatments/composite-bonding` → `/` | after URL settled | `/` | yes | `#222224` | `#9BBFC8` | `#6EB6B8` | `#84BEAC` | Hero composite settled. |
| `/treatments/composite-bonding` → `/` | post-nav +1500ms | `/` | yes | `#222224` | `#9BBFC8` | `#74B9B8` | `#83BDAC` | Stable hydrated state. |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | before click | `/treatments/composite-bonding` | yes | `#222224` | `#9BBFC8` | `#74B8B8` | `#83BEAC` | Start state. |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | immediate after click | `/treatments/teeth-whitening` | yes | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | Earliest observed route state used initial hero composite, not root-only ink. |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | after URL settled | `/treatments/teeth-whitening` | yes | `#222224` | `#9BBFC8` | `#75B8B8` | `#83BEAC` | Hero composite settled. |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | post-nav +1500ms | `/treatments/teeth-whitening` | yes | `#222224` | `#9BBFC8` | `#76B9B8` | `#83BDAC` | Stable hydrated state. |

## Console/path evidence

- Captured navigation logs included `[HERO_DIAG_NAV] href=/ defaultPrevented=false` for `/treatments/composite-bonding` → `/`.
- Captured navigation logs included `[HERO_DIAG_NAV] href=/treatments/teeth-whitening defaultPrevented=false` for `/treatments/composite-bonding` → `/treatments/teeth-whitening`.
- No console errors, warnings, page errors, or hydration mismatch warnings were captured during the Link-click transitions.

## SPA transition conclusion

The accessible Link-click transitions did not reproduce the full root-ink first-frame state seen on fresh direct loads. They did show a lower-intensity initial hero composite (`#87B2BC` / `#51A8A8` / `#66AC99`) before settling to the later gradient composite (`#9BBFC8` family). This supports a hero-layer settling problem during route transitions, but the strongest root-ink proof remains the fresh direct-load first observable frame.
