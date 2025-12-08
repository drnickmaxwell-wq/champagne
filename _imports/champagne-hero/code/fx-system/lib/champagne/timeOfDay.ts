export function setTheme(mode: 'dawn' | 'dusk' | 'night') {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', mode);
  }
}
