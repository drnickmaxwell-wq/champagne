import type { CSSProperties } from "react";
import Link from "next/link";
import { getMainNavItems } from "@champagne/manifests";

import styles from "./FooterLuxe.module.css";

const footerStyle = {
  "--smh-footer-bg":
    "radial-gradient(140% 140% at 18% 0%, color-mix(in srgb, var(--smh-primary-teal, var(--brand-teal)) 16%, transparent) 0%, transparent 55%)," +
    "radial-gradient(120% 160% at 80% 8%, color-mix(in srgb, var(--smh-primary-magenta, var(--brand-magenta)) 14%, transparent) 0%, transparent 58%)," +
    "linear-gradient(135deg, color-mix(in srgb, var(--smh-ink) 90%, transparent) 0%, color-mix(in srgb, var(--smh-ink-soft, var(--smh-ink)) 86%, transparent) 50%, color-mix(in srgb, var(--smh-navy-900, var(--smh-ink)) 94%, transparent) 100%)",
  "--smh-footer-particles": "url('/assets/champagne/particles/particles-gold.webp')",
  "--smh-footer-button-shadow":
    "0 22px 48px color-mix(in srgb, var(--smh-ink) 42%, transparent), 0 0 0 1px color-mix(in srgb, var(--smh-accent-gold, var(--brand-gold)) 22%, transparent)",
} as const;

export function Footer() {
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
            <Link className={styles.socialLink} href="/patient-portal?intent=login" aria-label="Patient portal">
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
