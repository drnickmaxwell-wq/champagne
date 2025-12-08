import type { CSSProperties, ReactElement } from 'react';
import { cloneElement } from 'react';

import FooterLuxe from '@/components/layout/FooterLuxe';
import { getBrandManifest } from '@/app/brand';

function toUrl(value?: string) {
  return value ? `url(${value})` : undefined;
}

type FooterPreviewStyles = CSSProperties & {
  '--footer-preview-gradient'?: string;
  '--footer-preview-wave'?: string;
  '--footer-preview-wave-mask'?: string;
  '--footer-preview-texture'?: string;
  '--footer-preview-grain'?: string;
};

export default async function FooterLuxePreview() {
  const manifest = await getBrandManifest();
  const gradientVar = manifest.gradientVar ?? '--smh-gradient';
  const waveMask = manifest.waves?.mask;
  const waveBackground = manifest.waves?.background;
  const textures = manifest.textures ?? {};

  const style: FooterPreviewStyles = {
    '--footer-preview-gradient': `var(${gradientVar}, var(--smh-gradient))`,
    '--footer-preview-wave-mask': waveMask ? toUrl(waveMask) : 'var(--wave-mask)',
  };

  const waveBackgroundValue = toUrl(waveBackground);
  if (waveBackgroundValue) {
    style['--footer-preview-wave'] = waveBackgroundValue;
  }

  const softTexture = textures.glassSoft ?? textures.glass;
  const textureValue = toUrl(softTexture);
  if (textureValue) {
    style['--footer-preview-texture'] = textureValue;
  }

  const grainValue = toUrl(textures.filmGrain);
  if (grainValue) {
    style['--footer-preview-grain'] = grainValue;
  }

  const footerElement = <FooterLuxe /> as ReactElement;
  const previewFooter = cloneElement(footerElement, { 'data-preview': 'true' });

  return (
    <section className="footer-luxe-preview" style={style}>
      {previewFooter}
    </section>
  );
}
