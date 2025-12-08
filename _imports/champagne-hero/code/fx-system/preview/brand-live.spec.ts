import { test, expect } from '@playwright/test';

test.describe('SMH Champagne surface lock', () => {
  test('surface + glass baseline remain pristine', async ({ page }) => {
    await page.goto('/preview/brand-live');

    const diagnostics = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const surface = document.querySelector('.champagne-surface, .champagne-surface-lux') as HTMLElement | null;
      const glass = document.querySelector('.champagne-glass') as HTMLElement | null;
      const surfaceStyles = surface ? getComputedStyle(surface) : null;
      const computedSurface = surfaceStyles?.backgroundImage.trim() ?? '';
      const gradientMatch = computedSurface.match(/linear-gradient\([^)]*\))/i);
      const firstGradient = gradientMatch ? gradientMatch[0].replace(/\s+/g, '') : '';
      const computedGlass = glass ? getComputedStyle(glass).backgroundColor.trim() : '';
      const grain = surfaceStyles?.getPropertyValue('--smh-grain-alpha').trim() ?? '';
      const vignette = surfaceStyles?.getPropertyValue('--smh-vignette-alpha').trim() ?? '';
      const particles = surfaceStyles?.getPropertyValue('--smh-particles-alpha').trim() ?? '';

      return {
        gradient: root.getPropertyValue('--smh-gradient').replace(/\s+/g, ''),
        surfaceGradient: firstGradient,
        surface: computedSurface,
        glass: computedGlass,
        grain,
        vignette,
        particles,
      };
    });

    expect(diagnostics.surfaceGradient).toBe(diagnostics.gradient);
    expect(diagnostics.glass).toBe('rgba(0, 0, 0, 0)');
    expect(Math.abs(Number.parseFloat(diagnostics.vignette || '0') - 0.06)).toBeLessThan(0.001);
    expect(Math.abs(Number.parseFloat(diagnostics.grain || '0') - 0.04)).toBeLessThan(0.001);
    expect(Math.abs(Number.parseFloat(diagnostics.particles || '0') - 0.06)).toBeLessThan(0.001);
  });
});
