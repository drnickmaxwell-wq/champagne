import type { CSSProperties } from "react";
import Link from "next/link";
import { getMainNavItems } from "@champagne/manifests";

import styles from "./FooterLuxe.module.css";

const footerStyle = {
  "--smh-footer-bg":
    "var(--smh-ink)",
  "--smh-footer-particles": "url('/assets/champagne/particles/particles-gold.webp')",
  "--smh-footer-rim": "var(--smh-accent-gold, var(--brand-gold))",
  "--smh-footer-button-shadow":
    "var(--shadow-soft)",
} as const;

export function Footer() {
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL?.trim() || "";
  const portalHref = portalBase
    ? `${portalBase.replace(/\/$/, "")}/?intent=login`
    : "/patient-portal?intent=login";
  const currentYear = new Date().getFullYear();
  const navItems = getMainNavItems();
  const primaryNav = navItems.slice(0, 4);
  const secondaryNav = navItems.slice(4);

  return (
    <footer className={styles.footer} style={footerStyle as CSSProperties}>
      <div className={styles.rim} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <p className={styles.heading}>Private dental care</p>
            <p className={styles.copy}>
              St Mary&apos;s House Dental Care offers carefully planned private dentistry in Shoreham-by-Sea, with
              patients also visiting from Brighton, Hove, Lancing, Portslade, Worthing, and Southwick.
            </p>
          </div>

          <div>
            <p className={styles.heading}>Explore</p>
            <ul className={styles.linkList}>
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.heading}>Support</p>
            <ul className={styles.linkList}>
              {secondaryNav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/legal/privacy" className={styles.link}>
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className={styles.link}>
                  Cookies policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className={styles.link}>
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/accessibility" className={styles.link}>
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/legal/complaints" className={styles.link}>
                  Complaints policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.link}>
                  Contact the practice
                </Link>
              </li>
              <li>
                <Link href="/downloads" className={styles.link}>
                  Downloads
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.newsletter}>
            <p className={styles.heading}>Practice updates</p>
            <p className={styles.copy}>
              Updates from the practice are shared through service notes, treatment guidance, and direct patient
              support. This website does not currently offer a newsletter sign-up.
            </p>
            <p className={styles.copy}>
              If you would like help, or want the team to guide the right next step, please contact the practice
              directly.
            </p>
            <div className={styles.actionRow}>
              <Link href="/contact" className={styles.actionPill}>
                Contact the practice
              </Link>
              <Link href="/treatments" className={styles.actionPill}>
                Explore treatments
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <p>Copyright {currentYear} St Mary&apos;s House Dental Care. Shoreham-by-Sea private dental practice.</p>
          <div className={styles.socialList}>
            <Link className={styles.socialLink} href="/contact" aria-label="Contact us">
              Email
            </Link>
            <Link className={styles.socialLink} href={portalHref} aria-label="Patient portal">
              Portal
            </Link>
            <Link className={styles.socialLink} href="/treatments" aria-label="View treatments">
              Care
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
