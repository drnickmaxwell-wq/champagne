"use client";

import React from "react";
import clsx from "clsx";

/**
 * SectionShell
 * -------------
 * A universal wrapper for every Champagne Section.
 * Provides:
 * - spacing rules
 * - width constraints
 * - optional background surfaces
 * - optional FX props (when fx.ts is active)
 */

export interface SectionShellProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  background?: string;
  padding?: "none" | "tight" | "normal" | "loose";
}

export function SectionShell({
  id,
  className,
  children,
  background = "surface.section",
  padding = "normal",
}: SectionShellProps) {
  const paddingMap = {
    none: "",
    tight: "py-8 md:py-10",
    normal: "py-12 md:py-16",
    loose: "py-20 md:py-28",
  };

  return (
    <section
      id={id}
      className={clsx(
        "relative w-full",
        background && `bg-[var(--${background})]`,
        paddingMap[padding],
        className
      )}
      data-section
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">{children}</div>
    </section>
  );
}

export default SectionShell;
