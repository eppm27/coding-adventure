// Keep CSS decorations and JavaScript gameplay on the same motion preference.
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function applyPreference() {
  document.documentElement.toggleAttribute('data-reduced-motion',reducedMotion.matches);
}
applyPreference();
reducedMotion.addEventListener?.('change',applyPreference);
