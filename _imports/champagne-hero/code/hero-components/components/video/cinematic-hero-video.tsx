'use client';

export interface CinematicHeroVideoProps {
  poster?: string;
  src?: string;
  className?: string;
  [key: string]: unknown;
}

export default function CinematicHeroVideo({
  poster = '/videos/posters/hero-4k.jpg',
  src = '/videos/dental-hero-4k.mp4',
  className,
}: CinematicHeroVideoProps) {
  const wrapperClassName = ['relative aspect-[16/9] overflow-hidden rounded-xl', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'var(--smh-gradient)', zIndex: -1 }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        autoPlay
        muted
        loop
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
