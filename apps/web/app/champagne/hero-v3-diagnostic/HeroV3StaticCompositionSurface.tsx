import styles from "./heroV3Diagnostic.module.css";

export const HERO_V3_STATIC_SURFACE_VERSION = "HERO_V3_STATIC_COMPOSITION_SURFACE_V1";
export const HERO_V3_STATIC_CANDIDATE_ID = "v3-champagne-sculpted-current" as const;

export function HeroV3StaticCompositionSurface() {
  return (
    <div className={styles.v3StaticSurface} data-h3-v3-surface={HERO_V3_STATIC_SURFACE_VERSION} data-h3-v3-candidate={HERO_V3_STATIC_CANDIDATE_ID} aria-hidden="true">
      <svg className={styles.v3StaticSvg} viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <linearGradient id="h3r-persian-depth" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className={styles.stopPersianDeep} /><stop offset="0.54" className={styles.stopPersianClear} /><stop offset="1" className={styles.stopPersianSoft} />
          </linearGradient>
          <linearGradient id="h3r-porcelain-lift" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0" className={styles.stopPorcelainWarm} /><stop offset="0.55" className={styles.stopPorcelainLift} /><stop offset="1" className={styles.stopPorcelainFade} />
          </linearGradient>
          <linearGradient id="h3r-turquoise-current" x1="0" y1="0" x2="1" y2="0.7">
            <stop offset="0" className={styles.stopTurquoiseDeep} /><stop offset="0.55" className={styles.stopTurquoise} /><stop offset="1" className={styles.stopTurquoiseFade} />
          </linearGradient>
          <linearGradient id="h3r-magenta-current" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" className={styles.stopMagentaFade} /><stop offset="0.52" className={styles.stopMagenta} /><stop offset="1" className={styles.stopMagentaDeep} />
          </linearGradient>
          <radialGradient id="h3r-luminous-field" cx="0.72" cy="0.22" r="0.7">
            <stop offset="0" className={styles.stopPorcelainGlow} /><stop offset="0.55" className={styles.stopTurquoiseGlow} /><stop offset="1" className={styles.stopTransparent} />
          </radialGradient>
        </defs>

        <rect width="1440" height="820" fill="url(#h3r-persian-depth)" />
        <ellipse className={styles.luminousField} cx="1050" cy="165" rx="640" ry="530" fill="url(#h3r-luminous-field)" />

        <g className={styles.desktopComposition}>
          <path className={styles.waveShadow} d="M-120 780C210 606 354 315 620 326C882 337 966 631 1210 605C1372 588 1478 468 1560 354V900H-120Z" />
          <path className={styles.waveTealBack} d="M-110 756C208 570 350 280 620 292C889 304 971 601 1217 571C1362 554 1488 421 1555 324V900H-110Z" fill="url(#h3r-turquoise-current)" />
          <path className={styles.wavePorcelain} d="M-100 704C221 535 370 242 633 260C895 278 971 557 1217 530C1379 512 1489 393 1550 308C1450 440 1337 617 1154 651C879 702 827 407 600 390C354 371 269 634-100 808Z" fill="url(#h3r-porcelain-lift)" />
          <path className={styles.waveTealFront} d="M-95 739C223 606 362 337 616 356C857 374 946 670 1205 628C1368 602 1475 506 1550 412V900H-95Z" fill="url(#h3r-turquoise-current)" />
          <path className={styles.waveMagenta} d="M-110 792C248 690 403 493 647 501C887 509 978 730 1238 689C1368 668 1474 606 1550 535V900H-110Z" fill="url(#h3r-magenta-current)" />
          <path className={styles.goldEdge} d="M-80 695C242 522 379 244 633 261C894 279 969 558 1218 530C1378 512 1488 393 1548 309" />
          <path className={styles.goldEdgeSoft} d="M-74 742C238 610 373 339 615 357C857 375 946 669 1205 628C1364 603 1471 506 1546 414" />
        </g>

        <g className={styles.mobileComposition}>
          <path className={styles.waveShadow} d="M-250 755C50 565 297 467 563 506C845 547 971 772 1243 704C1392 666 1514 570 1630 420V920H-250Z" />
          <path className={styles.waveTealBack} d="M-230 731C61 529 305 433 574 474C850 516 986 734 1247 667C1401 628 1524 526 1620 403V920H-230Z" fill="url(#h3r-turquoise-current)" />
          <path className={styles.wavePorcelain} d="M-213 683C76 498 315 403 582 445C846 487 997 690 1252 632C1401 598 1516 507 1614 385C1480 594 1338 743 1112 752C833 763 755 577 541 559C284 538 94 685-213 822Z" fill="url(#h3r-porcelain-lift)" />
          <path className={styles.waveTealFront} d="M-220 757C85 627 321 544 576 577C847 612 985 811 1245 743C1397 703 1516 622 1618 500V920H-220Z" fill="url(#h3r-turquoise-current)" />
          <path className={styles.waveMagenta} d="M-240 820C91 739 346 674 600 701C852 728 1010 867 1264 807C1406 774 1525 717 1620 628V920H-240Z" fill="url(#h3r-magenta-current)" />
          <path className={styles.goldEdge} d="M-212 683C77 498 315 403 582 445C846 487 997 690 1252 632C1401 598 1516 507 1614 385" />
        </g>

        <g className={styles.goldConstellation}><circle cx="1088" cy="190" r="3.5" /><circle cx="1141" cy="226" r="2" /><circle cx="1200" cy="170" r="2.75" /><circle cx="1260" cy="242" r="2" /><circle cx="1320" cy="202" r="3" /></g>
      </svg>
    </div>
  );
}
