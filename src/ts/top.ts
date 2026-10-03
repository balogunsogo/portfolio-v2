// Case-study top bar: hides while the page scrolls down and comes back as soon as it
// scrolls up. It always shows near the top of the page, and CSS keeps it visible while
// the name has keyboard focus.

// Movement smaller than this is ignored, so trackpad jitter doesn't flicker the bar.
const TOLERANCE = 6;
// Within this distance of the top the bar always shows (it sits at 28 or 48px).
const TOP_ZONE = 120;

export function initTopBar(bar: HTMLElement): void {
  let lastY = window.scrollY;
  let ticking = false;

  const update = (): void => {
    ticking = false;
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < TOLERANCE) return;

    bar.classList.toggle('is-hidden', delta > 0 && y > TOP_ZONE);
    lastY = y;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
}
