export const TOKENS = {
  white: 'var(--smh-white)',
  ink: 'var(--smh-ink, var(--smh-primary-ink)',
  graySubtle: 'var(--smh-gray-200)',
  champagne: 'var(--smh-champagne)',
  silver: 'var(--smh-silver)',
  navy: 'var(--smh-navy-800)',
  urgent: 'var(--smh-urgent)'
} as const;

export type NeutralToken = keyof typeof TOKENS;

export default TOKENS;
