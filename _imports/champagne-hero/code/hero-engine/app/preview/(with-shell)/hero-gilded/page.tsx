"use client";

import { useEffect, useState } from "react";

import PreviewHeroGildedClient from "./PreviewHeroGildedClient";
import "@/styles/champagne/hero-gilded-tweaks.css";
import "@/styles/champagne/hero-polish.css";

function ensureVeilLayer() {
  if (typeof document === "undefined") {
    return;
  }

  const hero = document.querySelector<HTMLElement>(".preview-hero-gilded");
  if (!hero || hero.querySelector(".veil-layer")) {
    return;
  }

  const veil = document.createElement("div");
  veil.className = "veil-layer";

  const gradient = hero.querySelector(".hero-gradient-base");
  if (gradient?.parentElement === hero) {
    gradient.insertAdjacentElement("afterend", veil);
    return;
  }

  hero.prepend(veil);
}

function syncMotionState(prefersReducedMotion: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  const hero = document.querySelector<HTMLElement>(".preview-hero-gilded");
  if (!hero) {
    return;
  }

  if (prefersReducedMotion) {
    hero.setAttribute("data-prm", "true");
  } else {
    hero.removeAttribute("data-prm");
  }

  const videos = hero.querySelectorAll<HTMLVideoElement>("video");
  videos.forEach((video) => {
    const originalPreload =
      video.getAttribute("data-preload-default") ?? video.getAttribute("preload") ??
      "auto";

    if (!video.hasAttribute("data-preload-default")) {
      video.setAttribute("data-preload-default", originalPreload);
    }

    if (prefersReducedMotion) {
      try {
        video.pause();
      } catch {
        // Ignore pause errors for streams that are not ready.
      }

      try {
        video.currentTime = 0;
      } catch {
        // Safari may throw while seeking metadata-only resources; ignore.
      }

      video.setAttribute("preload", "metadata");

      return;
    }

    const defaultPreload = video.getAttribute("data-preload-default");
    if (defaultPreload) {
      video.setAttribute("preload", defaultPreload);
    } else {
      video.removeAttribute("preload");
    }

    if (!video.hasAttribute("autoplay")) {
      return;
    }

    const playPromise = video.play();
    if (typeof playPromise?.catch === "function") {
      playPromise.catch(() => {});
    }
  });
}

export default function Page() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [goldOn, setGoldOn] = useState(false);

  useEffect(() => {
    ensureVeilLayer();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);

      return () => {
        mediaQuery.removeEventListener("change", updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  useEffect(() => {
    syncMotionState(prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setGoldOn(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".preview-hero-gilded");
    if (!hero) {
      return;
    }

    const boosted = !prefersReducedMotion && goldOn;
    hero.dataset.gold = boosted ? "on" : "off";
    hero.style.setProperty("--gold-boost", boosted ? "1.2" : "1.0");
  }, [goldOn, prefersReducedMotion]);

  return (
    <main
      className="min-h-screen"
      data-prm={prefersReducedMotion ? "true" : undefined}
      style={{
        backgroundColor: "var(--smh-ink)",
        color: "var(--smh-text)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 20,
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          fontSize: "0.875rem",
          background: "color-mix(in srgb, var(--smh-ink) 85%, transparent)",
          border: "1px solid color-mix(in srgb, var(--smh-ink) 55%, transparent)",
          borderRadius: "999px",
          padding: "0.35rem 0.65rem",
          boxShadow: "0 8px 24px rgba(15, 17, 26, 0.18)",
          backdropFilter: "blur(18px)",
        }}
      >
        <span style={{ opacity: 0.8 }}>Gold boost</span>
        <button
          type="button"
          onClick={() => setGoldOn((prev) => !prev)}
          disabled={prefersReducedMotion}
          style={{
            appearance: "none",
            border: "1px solid color-mix(in srgb, var(--smh-text) 45%, transparent)",
            borderRadius: "999px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            background: prefersReducedMotion
              ? "color-mix(in srgb, var(--smh-ink) 70%, transparent)"
              : goldOn
                ? "color-mix(in srgb, var(--smh-text) 28%, transparent)"
                : "transparent",
            color: "var(--smh-text)",
            cursor: prefersReducedMotion ? "not-allowed" : "pointer",
            transition: "background 180ms ease, color 180ms ease",
          }}
        >
          {prefersReducedMotion ? "PRM" : goldOn ? "On" : "Off"}
        </button>
      </div>

      <PreviewHeroGildedClient />
    </main>
  );
}
