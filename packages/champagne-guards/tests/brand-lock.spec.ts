import { test, expect } from '@playwright/test';

test.describe('Brand lock surface diagnostics', () => {
  test('gradient stack and assets align with Manus Lux canon', async ({ page }) => {
    await page.goto('/preview/brand-lock');

    const diagnostics = await page.evaluate(() => {
      const surface = document.querySelector<HTMLElement>('.champagne-surface, .champagne-surface-lux');
      if (!surface) {
        throw new Error('Champagne surface not found');
      }
      const surfaceStyles = getComputedStyle(surface);
      const rootStyles = getComputedStyle(document.documentElement);
      const gradientImage = surfaceStyles.backgroundImage.trim();
      const normalizedSurfaceGradient = gradientImage.replace(/\s+/g, '').toLowerCase();
      const normalizedTokenGradient = rootStyles
        .getPropertyValue('--smh-gradient')
        .replace(/\s+/g, '')
        .toLowerCase();

      const resolveToken = (name: string): string => {
        const value = rootStyles.getPropertyValue(name).trim();
        if (!value) return '';
        const match = value.match(/^var\(([^)]+)\)$/);
        if (match) {
          return resolveToken(match[1].trim());
        }
        return value;
      };

      const stopTokens = ['--smh-grad-stop1', '--smh-grad-stop2', '--smh-grad-stop3'] as const;
      const stopValues = stopTokens.map((token, index) => {
        const resolved = resolveToken(token).replace(/\s+/g, '').toLowerCase();
        const suffix = index === 0 ? '0%' : index === 1 ? '60%' : '100%';
        return `${resolved}${suffix}`;
      });

      return {
        normalizedSurfaceGradient,
        normalizedTokenGradient,
        stopValues,
        waveMask: rootStyles.getPropertyValue('--wave-mask').trim(),
        particles: rootStyles.getPropertyValue('--particles').trim(),
        grainDesktop: rootStyles.getPropertyValue('--grain-desktop').trim(),
      };
    });

    expect(diagnostics.normalizedSurfaceGradient).toContain('linear-gradient(');
    expect(diagnostics.normalizedSurfaceGradient).toBe(diagnostics.normalizedTokenGradient);
    diagnostics.stopValues.forEach((stop) => {
      expect(diagnostics.normalizedTokenGradient).toContain(stop);
    });
    expect(diagnostics.waveMask).toContain('/assets/champagne/wave-mask-desktop.webp');
    expect(diagnostics.particles).toContain('/assets/champagne/home-hero-particles.webp');
    expect(diagnostics.grainDesktop).toContain('/assets/champagne/film-grain-desktop.webp');
  });
});
