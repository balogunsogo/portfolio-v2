// Case-study videos.
//
// A video plays only while at least a quarter of it is in view and pauses when it
// leaves, so nothing downloads or runs off screen (the markup has preload="none" and
// no autoplay attribute). With prefers-reduced-motion nothing starts on its own: the
// poster stays until the person presses play.
//
// Each video has a toggle button next to it in the markup ([data-case-video-toggle]),
// visually hidden until it takes keyboard focus. The button and a click on the video
// both pause or play it. A video the person paused stays paused when it scrolls back
// into view.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Share of the video that must be visible before it plays.
const VISIBLE_THRESHOLD = 0.25;

export function initMedia(videos: readonly HTMLVideoElement[]): void {
  const inView = new WeakSet<HTMLVideoElement>();
  const pausedByPerson = new WeakSet<HTMLVideoElement>();

  // play() rejects when it's interrupted by a pause or blocked by the browser; the
  // poster or the current frame simply stays.
  const play = (video: HTMLVideoElement): void => {
    video.play().catch(() => undefined);
  };

  const toggle = (video: HTMLVideoElement): void => {
    if (video.paused) {
      pausedByPerson.delete(video);
      play(video);
    } else {
      pausedByPerson.add(video);
      video.pause();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE_THRESHOLD) {
          inView.add(video);
          if (!reducedMotion.matches && !pausedByPerson.has(video)) play(video);
        } else {
          inView.delete(video);
          video.pause();
        }
      }
    },
    { threshold: VISIBLE_THRESHOLD },
  );

  for (const video of videos) {
    const button = video.parentElement?.querySelector<HTMLButtonElement>('[data-case-video-toggle]');

    if (button) {
      const label = (): void => {
        button.textContent = video.paused ? 'Play video' : 'Pause video';
      };
      video.addEventListener('play', label);
      video.addEventListener('pause', label);
      button.addEventListener('click', () => toggle(video));
      label();
      button.hidden = false;
    }

    video.addEventListener('click', () => toggle(video));
    observer.observe(video);
  }

  // Reduced motion switched on while the page is open: stop whatever started on its own.
  reducedMotion.addEventListener('change', (event: MediaQueryListEvent) => {
    for (const video of videos) {
      if (event.matches) video.pause();
      else if (inView.has(video) && !pausedByPerson.has(video)) play(video);
    }
  });
}
