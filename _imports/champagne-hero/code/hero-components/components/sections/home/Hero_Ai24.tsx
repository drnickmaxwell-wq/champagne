'use client';

import React from 'react';
import ToothViewer from '@/components/3d/ToothViewer';
import CoastalWaves from '@/components/effects/CoastalWaves';
import ParticleSystem from '@/components/effects/ParticleSystem';
import { asset, hasCDN } from '@/lib/assets';

export default function Hero_Ai24() {
  const poster = hasCDN ? asset('/videos/ai24/hero/poster.jpg') : undefined;
  const videoSrc = hasCDN ? asset('/videos/ai24/hero/background.mp4') : undefined;

  return (
    <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-[var(--smh-surface-elevated)] px-6 py-16 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-12 lg:flex lg:items-center lg:gap-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center">
        <CoastalWaves className="h-64 w-[min(90%,48rem)]" />
      </div>
      <div className="smh-anim relative flex-1 space-y-6 lg:max-w-xl">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          AI 24 • Signature Smiles
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Beautifully modern dentistry, guided by <span className="text-[var(--smh-gold)]">AI precision</span>
        </h1>
        <p className="text-balance text-lg text-white/70">
          Elevate every appointment with immersive previews, real-time treatment planning, and concierge-level follow up. The
          AI24 experience keeps your patients informed, inspired, and ready to say yes.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <div className="smh-anim inline-flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Average Case Acceptance</span>
            <span className="mt-1 text-2xl font-semibold text-[var(--smh-gold)]">+34%</span>
          </div>
          <div className="smh-anim inline-flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Treatment Planning Time</span>
            <span className="mt-1 text-2xl font-semibold text-[var(--smh-gold)]">-45%</span>
          </div>
        </div>
        {hasCDN ? (
          <video
            className="smh-anim mt-4 w-full max-w-md rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            poster={poster}
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <p className="text-sm text-white/60">
            Video preview available when CDN assets are connected.
          </p>
        )}
      </div>
      <div className="smh-anim mt-12 flex flex-1 flex-col items-center gap-6 lg:mt-0">
        <div className="relative w-full max-w-xl">
          <ParticleSystem className="absolute inset-0" density={32} />
          <ToothViewer />
        </div>
        <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ['Ultra HD Smile Simulations', 'Preview transformations within minutes.'],
            ['Guided Consultations', 'Step-by-step storytelling that closes cases.'],
            ['Patient Concierge', 'Automated check-ins that feel bespoke.'],
          ].map(([title, copy]) => (
            <div key={title} className="smh-anim rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
