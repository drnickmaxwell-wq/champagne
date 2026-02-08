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
            <p className={styles.heading}>Champagne finish</p>
            <p className={styles.copy}>
              Luxe ink gradient with soft particle bloom, tuned for calm reading and brand gold accents. Crafted for
              the Champagne ecosystem runtime shell.
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
                <Link href="/newsletter" className={styles.link}>
                  Newsletter
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
            <p className={styles.heading}>Stay in sync</p>
            <p className={styles.copy}>Sign up to hear about new treatments and Champagne build milestones.</p>
            <div className={styles.form} aria-label="Subscribe to updates" role="form">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                className={styles.input}
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
              <button type="button" className={styles.button}>
                Join list
              </button>
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <p>© {currentYear} St Mary&apos;s House Dental. Champagne luxe footer promotion.</p>
          <div className={styles.socialList}>
            <Link className={styles.socialLink} href="/contact" aria-label="Contact us">
              ✉️
            </Link>
            <Link className={styles.socialLink} href={portalHref} aria-label="Patient portal">
              ↗️
            </Link>
            <Link className={styles.socialLink} href="/treatments" aria-label="View treatments">
              ✨
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
