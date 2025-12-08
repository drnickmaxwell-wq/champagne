"use client";

import { useEffect, useState } from "react";
import HeroLuxury from "@/components/sections/HeroLuxury";

type TokenSnapshot = {
  gradient: string;
  magenta: string;
  teal: string;
  gold: string;
  glassStrong: string;
  glassBorder: string;
};

type StyleSnapshot = {
  background?: string;
  backgroundColor?: string;
  opacity?: string;
  filter?: string;
  mixBlendMode?: string;
  backdropFilter?: string;
};

type StylesheetReport = {
  href: string | null;
  rules: string[];
  error?: string;
};

type DebugState = {
  tokens: TokenSnapshot;
  heroStyles: StyleSnapshot | null;
  paneStyles: StyleSnapshot | null;
  stylesheets: StylesheetReport[];
};

const RELEVANT_SELECTORS = ["section[data-hero=\"champagne\"]", ".glass-pane"];

const pickStyle = (style: CSSStyleDeclaration | null): StyleSnapshot | null => {
  if (!style) return null;
  return {
    background: style.getPropertyValue("background").trim(),
    backgroundColor: style.getPropertyValue("background-color").trim(),
    opacity: style.getPropertyValue("opacity").trim(),
    filter: style.getPropertyValue("filter").trim(),
    mixBlendMode: style.getPropertyValue("mix-blend-mode").trim(),
    backdropFilter: style.getPropertyValue("backdrop-filter").trim(),
  };
};

const describeRule = (rule: CSSRule): string => {
  if (rule.type === CSSRule.MEDIA_RULE) {
    return `@media ${(rule as CSSMediaRule).conditionText}`;
  }
  if (rule.type === CSSRule.SUPPORTS_RULE) {
    return `@supports ${(rule as CSSSupportsRule).conditionText}`;
  }
  if (rule.type === CSSRule.DOCUMENT_RULE) {
    return "@document";
  }
  return rule.cssText.split("{")[0]?.trim() ?? "";
};

export default function WhyHeroGreyPage() {
  const [state, setState] = useState<DebugState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const heroEl = document.querySelector<HTMLElement>("section[data-hero=\"champagne\"]");
    const paneEl = heroEl?.querySelector<HTMLElement>(".glass-pane") ?? null;

    const heroComputed = heroEl ? getComputedStyle(heroEl) : null;
    const paneComputed = paneEl ? getComputedStyle(paneEl) : null;

    const heroBackground = heroComputed?.getPropertyValue("background").trim() ?? "";
    const paneBackground = paneComputed?.getPropertyValue("background").trim() ?? "";

    const tokens: TokenSnapshot = {
      gradient: rootStyles.getPropertyValue("--smh-gradient").trim(),
      magenta: rootStyles.getPropertyValue("--smh-primary-magenta").trim(),
      teal: rootStyles.getPropertyValue("--smh-primary-teal").trim(),
      gold: rootStyles.getPropertyValue("--smh-accent-gold").trim(),
      glassStrong: rootStyles.getPropertyValue("--glass-bg-strong").trim(),
      glassBorder: rootStyles.getPropertyValue("--glass-border").trim(),
    };

    console.log("[champagne-preview] hero surfaces", {
      "--glass-border": tokens.glassBorder,
      heroBackground,
      paneBackground,
    });

    const gatherRules = (rules: CSSRuleList | undefined | null, context?: string): string[] => {
      if (!rules) return [];

      const collected: string[] = [];

      Array.from(rules).forEach((rule) => {
        if (rule.type === CSSRule.STYLE_RULE) {
          const styleRule = rule as CSSStyleRule;
          const selectorText = styleRule.selectorText ?? "";
          const matchesSelector = RELEVANT_SELECTORS.some((selector) =>
            selectorText
              .split(",")
              .map((segment) => segment.trim())
              .some((segment) => segment.includes(selector)),
          );
          const ruleText = styleRule.cssText;
          const definesGradient = ruleText.includes("--smh-gradient");

          if (matchesSelector || definesGradient) {
            collected.push(context ? `${context} { ${ruleText} }` : ruleText);
          }
        } else {
          const nestedRules = (rule as CSSRule & { cssRules?: CSSRuleList }).cssRules;

          if (nestedRules && nestedRules.length) {
            const descriptor = describeRule(rule);
            const results = gatherRules(nestedRules, descriptor);
            collected.push(...results);
          }
        }
      });

      return collected;
    };

    const stylesheetReports: StylesheetReport[] = Array.from(document.styleSheets).map((sheet) => {
      try {
        const href = sheet.href ?? "inline";
        const rules = gatherRules(sheet.cssRules, undefined);
        return rules.length
          ? {
              href,
              rules,
            }
          : {
              href,
              rules: [],
            };
      } catch (error) {
        return {
          href: sheet.href ?? "inline",
          rules: [],
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });

    setState({
      tokens,
      heroStyles: pickStyle(heroComputed),
      paneStyles: pickStyle(paneComputed),
      stylesheets: stylesheetReports.filter((sheet) => sheet.rules.length || sheet.error),
    });
  }, []);

  return (
    <main className="min-h-screen space-y-12 bg-slate-900/5 px-6 py-12">
      <header className="max-w-4xl">
        <h1 className="text-3xl font-semibold">Champagne hero diagnostics</h1>
        <p className="mt-2 text-base text-slate-600">
          Runtime inspection of the tokens, computed hero styles, and author stylesheets that touch the Champagne hero.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm">
          <h2 className="text-xl font-medium">Computed tokens</h2>
          {state ? (
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {Object.entries(state.tokens).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-100/70 p-3">
                  <dt className="font-semibold text-slate-700">{key}</dt>
                  <dd className="break-words font-mono text-slate-900">{value || "<empty>"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-slate-600">Sampling token values…</p>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm">
          <h2 className="text-xl font-medium">Computed hero styles</h2>
          {state ? (
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-slate-700">section[data-hero=&quot;champagne&quot;]</h3>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-100/70 p-3 font-mono text-xs text-slate-900">
                  {JSON.stringify(state.heroStyles, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">.glass-pane</h3>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-100/70 p-3 font-mono text-slate-900">
                  {JSON.stringify(state.paneStyles, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Sampling computed styles…</p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm">
        <h2 className="text-xl font-medium">Stylesheets touching the gradient or hero selectors</h2>
        {state ? (
          state.stylesheets.length ? (
            <ul className="space-y-4 text-sm">
              {state.stylesheets.map((sheet) => (
                <li key={sheet.href} className="rounded-lg bg-slate-100/70 p-3">
                  <div className="font-semibold text-slate-700">{sheet.href}</div>
                  {sheet.error ? (
                    <p className="mt-2 font-mono text-xs text-red-600">Error: {sheet.error}</p>
                  ) : (
                    <pre className="mt-2 overflow-x-auto rounded bg-white/70 p-3 font-mono text-xs text-slate-900">
                      {sheet.rules.join("\n\n")}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">No author stylesheets reported matching rules.</p>
          )
        ) : (
          <p className="text-sm text-slate-600">Inspecting stylesheets…</p>
        )}
      </section>

      <HeroLuxury />
    </main>
  );
}
