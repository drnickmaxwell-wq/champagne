import styles from "./heroV3Diagnostic.module.css";

export const HERO_V3_STATIC_SURFACE_VERSION = "HERO_V3_STATIC_COMPOSITION_SURFACE_V1";

export type HeroV3StaticCandidateId =
  | "v3-editorial-current"
  | "v3-velvet-ribbon"
  | "v3-luminous-tide";

type Props = {
  candidate: HeroV3StaticCandidateId;
};

export function HeroV3StaticCompositionSurface({ candidate }: Props) {
  return (
    <div
      className={styles.v3StaticSurface}
      data-h3-v3-surface={HERO_V3_STATIC_SURFACE_VERSION}
      data-h3-v3-candidate={candidate}
      aria-hidden="true"
    >
      <svg className={styles.v3StaticSvg} viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <linearGradient id={`${candidate}-porcelain`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className={styles.stopPorcelainWarm} />
            <stop offset="0.48" className={styles.stopPorcelainLift} />
            <stop offset="1" className={styles.stopPersianSoft} />
          </linearGradient>
          <linearGradient id={`${candidate}-spectrum`} x1="0" y1="0.15" x2="1" y2="0.82">
            <stop offset="0" className={styles.stopMagenta} />
            <stop offset="0.46" className={styles.stopTurquoise} />
            <stop offset="0.78" className={styles.stopGold} />
            <stop offset="1" className={styles.stopMagentaSoft} />
          </linearGradient>
          <linearGradient id={`${candidate}-velvet`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" className={styles.stopPersianDeep} />
            <stop offset="0.52" className={styles.stopPersianClear} />
            <stop offset="1" className={styles.stopPersianTransparent} />
          </linearGradient>
          <radialGradient id={`${candidate}-light`} cx="0.68" cy="0.42" r="0.58">
            <stop offset="0" className={styles.stopPorcelainGlow} />
            <stop offset="0.56" className={styles.stopGoldGlow} />
            <stop offset="1" className={styles.stopTransparent} />
          </radialGradient>
          <filter id={`${candidate}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <rect width="1440" height="820" fill={`url(#${candidate}-porcelain)`} />
        <path className={styles.v3VelvetField} d="M0 0H845C705 184 618 342 579 520C541 694 397 798 0 820Z" fill={`url(#${candidate}-velvet)`} />
        <ellipse className={styles.v3LightField} cx="1000" cy="340" rx="560" ry="430" fill={`url(#${candidate}-light)`} />

        <g className={styles.v3WaveSculpture}>
          <path d="M-90 610C186 478 292 167 566 190C834 213 861 567 1170 547C1315 538 1438 445 1530 342" />
          <path d="M-100 676C212 548 333 246 590 264C836 282 902 638 1194 606C1337 590 1455 507 1537 418" />
          <path d="M-80 739C250 632 372 331 629 341C871 350 950 696 1222 659C1367 640 1472 570 1538 500" />
        </g>

        <path
          className={styles.v3SpectralRibbon}
          d="M-105 648C176 521 306 213 579 228C836 243 900 592 1194 574C1341 565 1453 481 1545 388"
          stroke={`url(#${candidate}-spectrum)`}
        />
        <path
          className={styles.v3SpectralHighlight}
          d="M-80 619C205 503 326 204 582 222C833 240 895 574 1188 561C1326 555 1447 466 1525 390"
          stroke={`url(#${candidate}-spectrum)`}
          filter={`url(#${candidate}-soft)`}
        />
        <g className={styles.v3EditorialConstellation}>
          <circle cx="1065" cy="192" r="4" />
          <circle cx="1112" cy="220" r="2.5" />
          <circle cx="1157" cy="174" r="3" />
          <circle cx="1204" cy="237" r="2" />
          <circle cx="1252" cy="197" r="3.5" />
          <circle cx="1299" cy="253" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
