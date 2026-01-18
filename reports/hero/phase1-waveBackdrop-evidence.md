ENGINE:
- HOME hero id: "sacred-home-hero"
- Selected background token: "field.waveBackdrop" (desktop/mobile)

BASE_SNIPPET (packages/champagne-manifests/data/hero/sacred_hero_base.json, 30 lines before/after background selection):
     1	{
     2	  "id": "sacred-home-hero",
     3	  "content": {
     4	    "eyebrow": "Champagne Dentistry",
     5	    "headline": "Advanced cosmetic dentistry crafted with calm precision.",
     6	    "subheadline": "Digital workflows, gentle clinicians, and beautifully layered studio light for confident smiles.",
     7	    "cta": { "label": "Book a consultation", "href": "/contact" },
     8	    "secondaryCta": { "label": "Explore treatments", "href": "/treatments" }
     9	  },
    10	  "defaults": {
    11	    "tone": "night",
    12	    "rendering": {
    13	      "disableInternalOverlays": true
    14	    },
    15	    "motionAllowlist": [
    16	      "overlay.caustics",
    17	      "overlay.glassShimmer",
    18	      "overlay.goldDustDrift",
    19	      "overlay.particlesDrift"
    20	    ],
    21	    "surfaces": {
    22	      "gradient": "gradient.base",
    23	      "waveMask": { "desktop": "mask.waveHeader", "mobile": "mask.waveHeader.mobile" },
    24	      "background": { "desktop": "field.waveBackdrop", "mobile": "field.waveBackdrop" },
    25	      "overlays": { "dots": "field.dotGrid", "field": "field.waveRings" },
    26	      "particles": "overlay.particlesPrimary",
    27	      "grain": { "desktop": "overlay.filmGrain.desktop", "mobile": "overlay.filmGrain.mobile" },
    28	      "motion": ["overlay.caustics", "overlay.glassShimmer", "overlay.goldDustDrift", "overlay.particlesDrift"],
    29	      "video": "__OFF__"
    30	    },
    31	    "layout": {
    32	      "contentAlign": "start",
    33	      "maxWidth": 960,
    34	      "verticalOffset": "0px",
    35	      "padding": "clamp(2rem, 4vw, 3.5rem)"
    36	    },
    37	    "motion": {
    38	      "parallaxDepth": 18,
    39	      "shimmerIntensity": 1,
    40	      "particleDrift": 1,
    41	      "energyMode": "balanced",
    42	      "particles": { "density": 1, "speed": 1, "curve": "sway" }
    43	    },
    44	    "filmGrain": { "enabled": true, "opacity": 0.06 }
    45	  }
    46	}

SURFACES_SNIPPET (packages/champagne-manifests/data/hero/sacred_hero_surfaces.json, 30 lines before/after field.waveBackdrop definition):
     1	{
     2	  "waveMasks": {
     3	    "mask.waveHeader.desktop": "sacred.wave.mask.desktop",
     4	    "mask.waveHeader.mobile": "sacred.wave.mask.mobile",
     5	    "mask.waveHeader": { "asset": "sacred.wave.mask.desktop", "blendMode": "overlay", "opacity": 0.4 },
     6	    "mask.wave.smh": "sacred.wave.mask.smh"
     7	  },
     8	  "surfaceStack": [
     9	    { "id": "gradient.base", "role": "background", "token": "gradient.base", "prmSafe": true },
    10	    { "id": "field.waveBackdrop", "role": "background", "token": "field.waveBackdrop", "prmSafe": true },
    11	    { "id": "field.waveRings", "role": "background", "token": "field.waveRings", "prmSafe": true },
    12	    { "id": "mask.waveHeader", "role": "background", "token": "mask.waveHeader", "prmSafe": true },
    13	    { "id": "field.dotGrid", "role": "background", "token": "field.dotGrid", "prmSafe": true },
    14	    { "id": "overlay.caustics", "role": "fx", "token": "overlay.caustics", "prmSafe": false },
    15	    { "id": "overlay.glassShimmer", "role": "fx", "token": "overlay.glassShimmer", "prmSafe": false },
    16	    { "id": "overlay.goldDustDrift", "role": "fx", "token": "overlay.goldDustDrift", "prmSafe": false },
    17	    { "id": "overlay.particlesDrift", "role": "fx", "token": "overlay.particlesDrift", "prmSafe": false },
    18	    { "id": "overlay.particles", "role": "fx", "token": "overlay.particles" },
    19	    { "id": "overlay.filmGrain", "role": "fx", "token": "overlay.filmGrain", "prmSafe": true },
    20	    { "id": "overlay.lighting", "role": "fx", "token": "overlay.lighting", "prmSafe": true },
    21	    { "id": "hero.contentFrame", "role": "background", "token": "hero.contentFrame", "prmSafe": true }
    22	  ],
    23	  "waveBackgrounds": {
    24	    "field.waveBackdrop": {
    25	      "desktop": { "asset": "sacred.wave.background.desktop", "blendMode": "soft-light", "opacity": 0.24, "prmSafe": true },
    26	      "mobile": { "asset": "sacred.wave.background.mobile", "blendMode": "soft-light", "opacity": 0.24, "prmSafe": true }
    27	    }
    28	  },
    29	  "gradients": {
    30	    "gradient.base": "var(--smh-gradient)"
    31	  },
    32	  "overlays": {
    33	    "field.waveRings": { "asset": "sacred.wave.overlay.field", "blendMode": "soft-light", "opacity": 0.08, "prmSafe": true },
    34	    "field.dotGrid": { "asset": "sacred.wave.overlay.dots", "blendMode": "soft-light", "opacity": 0.05, "prmSafe": true },
    35	    "overlay.lighting": { "blendMode": "soft-light", "opacity": 0, "prmSafe": true }
    36	  },
    37	  "particles": {
    38	    "overlay.particlesPrimary": { "asset": "sacred.particles.home", "blendMode": "screen", "opacity": 0.08 },
    39	    "overlay.particlesGold": { "asset": "sacred.particles.gold", "blendMode": "screen", "opacity": 0.18 },
    40	    "overlay.particlesMagenta": { "asset": "sacred.particles.magenta", "blendMode": "screen", "opacity": 0.18 },
    41	    "overlay.particlesTeal": { "asset": "sacred.particles.teal", "blendMode": "screen", "opacity": 0.18 }
    42	  },
    43	  "grain": {
    44	    "overlay.filmGrain.desktop": { "asset": "sacred.grain.desktop", "blendMode": "overlay", "opacity": 0.07, "prmSafe": true },
    45	    "overlay.filmGrain.mobile": { "asset": "sacred.grain.mobile", "blendMode": "overlay", "opacity": 0.07, "prmSafe": true }
    46	  },
    47	  "motion": {
    48	    "overlay.caustics": {
    49	      "asset": "sacred.motion.waveCaustics",
    50	      "blendMode": "screen",
    51	      "opacity": 0.14,
    52	      "className": "hero-surface--caustics"
    53	    },
    54	    "overlay.glassShimmer": {
    55	      "asset": "sacred.motion.glassShimmer",
    56	      "blendMode": "soft-light",

OFF_SENTINELS (rg -n "__OFF__|OFF|none|disabled|null|false" packages/champagne-manifests/data/hero/sacred_hero_base.json packages/champagne-manifests/data/hero/sacred_hero_surfaces.json):
packages/champagne-manifests/data/hero/sacred_hero_base.json:29:      "video": "__OFF__"
packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:14:    { "id": "overlay.caustics", "role": "fx", "token": "overlay.caustics", "prmSafe": false },
packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:15:    { "id": "overlay.glassShimmer", "role": "fx", "token": "overlay.glassShimmer", "prmSafe": false },
packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:16:    { "id": "overlay.goldDustDrift", "role": "fx", "token": "overlay.goldDustDrift", "prmSafe": false },
packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:17:    { "id": "overlay.particlesDrift", "role": "fx", "token": "overlay.particlesDrift", "prmSafe": false },
packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:74:    "hero.video": { "asset": "sacred.motion.heroVideo", "blendMode": "screen", "prmSafe": false }

COMMANDS:
- rg -n "field\.waveBackdrop|sacred-home|sacred-home-hero|background" packages/champagne-manifests/data/hero
- nl -ba packages/champagne-manifests/data/hero/sacred_hero_base.json | sed -n '1,46p'
- nl -ba packages/champagne-manifests/data/hero/sacred_hero_surfaces.json | sed -n '1,56p'
- rg -n "__OFF__|OFF|none|disabled|null|false" packages/champagne-manifests/data/hero/sacred_hero_base.json packages/champagne-manifests/data/hero/sacred_hero_surfaces.json

STOP POINT:
No changes made.
