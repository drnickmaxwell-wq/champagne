import type { HTMLAttributes } from 'react';

import styles from './particles.module.css';

export type ParticlesProps = HTMLAttributes<HTMLDivElement>;

export function Particles({ className = '', ...props }: ParticlesProps) {
  return <div data-layer="particles" className={`${styles.layer}${className ? ` ${className}` : ''}`} {...props} />;
}

export default Particles;
