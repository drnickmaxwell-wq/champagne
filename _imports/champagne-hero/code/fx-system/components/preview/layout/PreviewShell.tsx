import type { ReactNode } from "react";

import ChampagnePreviewFooter from "@/components/preview/layout/ChampagnePreviewFooter";
import ChampagnePreviewHeader from "@/components/preview/layout/ChampagnePreviewHeader";
import styles from "./preview-shell.module.css";

export default function PreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.cpvShell} text-[var(--smh-white)]`} data-theme="preview-dusk">
      <div className={styles.cpvBackdrop} aria-hidden />
      <div className={styles.cpvParticles} aria-hidden />
      <div className={`${styles.cpvInner} flex min-h-screen flex-col`}>
        <ChampagnePreviewHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <ChampagnePreviewFooter />
      </div>
    </div>
  );
}
