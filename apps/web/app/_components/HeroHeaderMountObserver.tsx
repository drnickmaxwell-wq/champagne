"use client";

import { useEffect } from "react";

type HeroHeaderMountObserverProps = {
  enabled?: boolean;
};

const HERO_SELECTOR = "[data-hero-engine]";
const HEADER_SELECTOR = "header";

const hasSelectorMatch = (node: Node, selector: string) => {
  if (!(node instanceof Element)) {
    return false;
  }
  return node.matches(selector) || Boolean(node.querySelector(selector));
};

const logChange = (label: string, action: "inserted" | "removed", selector: string) => {
  const count = document.querySelectorAll(selector).length;
  const timestamp = new Date().toISOString();
  console.log(`[hero-debug] ${timestamp} ${label} ${action} count=${count}`);
};

export function HeroHeaderMountObserver({ enabled }: HeroHeaderMountObserverProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      let heroInserted = false;
      let heroRemoved = false;
      let headerInserted = false;
      let headerRemoved = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!heroInserted && hasSelectorMatch(node, HERO_SELECTOR)) {
            heroInserted = true;
          }
          if (!headerInserted && hasSelectorMatch(node, HEADER_SELECTOR)) {
            headerInserted = true;
          }
        }
        for (const node of mutation.removedNodes) {
          if (!heroRemoved && hasSelectorMatch(node, HERO_SELECTOR)) {
            heroRemoved = true;
          }
          if (!headerRemoved && hasSelectorMatch(node, HEADER_SELECTOR)) {
            headerRemoved = true;
          }
        }
      }

      if (heroInserted) {
        logChange("hero", "inserted", HERO_SELECTOR);
      }
      if (heroRemoved) {
        logChange("hero", "removed", HERO_SELECTOR);
      }
      if (headerInserted) {
        logChange("header", "inserted", HEADER_SELECTOR);
      }
      if (headerRemoved) {
        logChange("header", "removed", HEADER_SELECTOR);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return null;
}
