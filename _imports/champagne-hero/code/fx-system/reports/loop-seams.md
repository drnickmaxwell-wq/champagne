# Loop Seam QA Report

Generated: 2025-11-03T05:31:51.802Z

## Tooling

- ffprobe: unavailable
- fallback hashing: unavailable

<details>
<summary>Fallback module load errors</summary>

- @ffmpeg.wasm/main: Cannot find package '@ffmpeg.wasm/main' imported from /workspace/please-work/scripts/qa-loop-report.mjs
- @ffmpeg.wasm/ffmpeg: Cannot find package '@ffmpeg.wasm/ffmpeg' imported from /workspace/please-work/scripts/qa-loop-report.mjs
- node-webm: Cannot find package 'node-webm' imported from /workspace/please-work/scripts/qa-loop-report.mjs

</details>

## Clip Summary

| Clip | Status | Seam Delta | Crossfade (ms) | Notes |
| --- | --- | --- | --- | --- |
| public/assets/champagne/motion/glass-shimmer.webm | tool-unavailable | n/a | n/a | Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams. |
| public/assets/champagne/motion/gold-dust-drift.webm | tool-unavailable | n/a | n/a | Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams. |
| public/assets/champagne/motion/particles-drift.webm | tool-unavailable | n/a | n/a | Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams. |
| public/assets/champagne/motion/wave-caustics.webm | tool-unavailable | n/a | n/a | Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams. |
| public/assets/champagne/particles/gold-dust-drift.webm | tool-unavailable | n/a | n/a | Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams. |

```json
[
  {
    "clip": "public/assets/champagne/motion/glass-shimmer.webm",
    "threshold": 8,
    "status": "tool-unavailable",
    "seam_delta": null,
    "crossfade_ms": null,
    "method": "manual-review",
    "note": "Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams."
  },
  {
    "clip": "public/assets/champagne/motion/gold-dust-drift.webm",
    "threshold": 8,
    "status": "tool-unavailable",
    "seam_delta": null,
    "crossfade_ms": null,
    "method": "manual-review",
    "note": "Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams."
  },
  {
    "clip": "public/assets/champagne/motion/particles-drift.webm",
    "threshold": 8,
    "status": "tool-unavailable",
    "seam_delta": null,
    "crossfade_ms": null,
    "method": "manual-review",
    "note": "Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams."
  },
  {
    "clip": "public/assets/champagne/motion/wave-caustics.webm",
    "threshold": 8,
    "status": "tool-unavailable",
    "seam_delta": null,
    "crossfade_ms": null,
    "method": "manual-review",
    "note": "Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams."
  },
  {
    "clip": "public/assets/champagne/particles/gold-dust-drift.webm",
    "threshold": 8,
    "status": "tool-unavailable",
    "seam_delta": null,
    "crossfade_ms": null,
    "method": "manual-review",
    "note": "Install ffmpeg (ffprobe) locally or request Manus for a re-export with tighter loop seams."
  }
]
```

> Threshold (ΔYAVG): 8

If tooling remains unavailable, request Manus to re-export loops with matching first/last frames or supply raw frame sequences.
