// Explicit playback only. Also shared by annotated-media; no in-view playback.
export function initWritingPlayback(root: HTMLElement, video: HTMLVideoElement): () => boolean {
  const toggle = root.querySelector<HTMLButtonElement>('[data-media-toggle]');
  const replay = root.querySelector<HTMLButtonElement>('[data-media-replay]');
  let played = false;

  const label = (): void => {
    if (toggle) toggle.textContent = video.paused ? 'Play' : 'Pause';
  };
  const play = (): void => {
    video.play().catch(label);
  };
  video.addEventListener('play', () => {
    played = true;
    if (replay) replay.hidden = false;
    label();
  });
  video.addEventListener('pause', label);
  video.addEventListener('ended', label);
  video.addEventListener('emptied', label);
  toggle?.addEventListener('click', () => {
    if (video.paused) play();
    else video.pause();
  });
  replay?.addEventListener('click', () => {
    video.currentTime = 0;
    play();
  });
  video.controls = false;
  const controls = root.querySelector<HTMLElement>('[data-media-controls]');
  if (controls) controls.hidden = false;
  label();
  return () => played;
}

export function initMediaSwitch(root: HTMLElement): void {
  const versions = Array.from(root.querySelectorAll<HTMLElement>('[data-media-version]'));
  const videos = versions.map((version) => version.querySelector<HTMLVideoElement>('[data-media-video]'));
  const controls = root.querySelector<HTMLElement>('[data-media-controls]');
  const group = root.querySelector<HTMLElement>('[data-media-versions]');
  const video = videos[0];
  if (!video || !controls || !group || versions.length < 2 || videos.some((item) => !item)) return;

  const sources = videos.map((item) => ({
    src: item!.getAttribute('src')!,
    poster: item!.poster,
    label: item!.getAttribute('aria-label')!,
  }));

  initWritingPlayback(root, video);
  let selected = -1;
  const buttons: HTMLButtonElement[] = [];
  const select = (index: number): void => {
    if (index === selected) return;
    const source = sources[index];
    const resume = !video.paused;
    video.pause();
    video.src = source.src;
    video.poster = source.poster;
    video.setAttribute('aria-label', source.label);
    // Keep a single playback frame; each fallback figure retains its caption.
    const plate = versions[index].querySelector<HTMLElement>('[data-media-plate]')!;
    plate.prepend(video.parentElement!);
    plate.append(controls);
    versions.forEach((version, i) => { version.hidden = i !== index; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    selected = index;
    if (resume) video.play().catch(() => {
      const toggle = controls.querySelector<HTMLButtonElement>('[data-media-toggle]');
      if (toggle) toggle.textContent = video.paused ? 'Play' : 'Pause';
    });
  };

  for (const [index, version] of versions.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'writing-control';
    button.textContent = version.dataset.mediaVersion!;
    button.addEventListener('click', () => select(index));
    group.append(button);
    buttons.push(button);
  }
  // Both native videos are present without JS. Only the shared video is used with JS.
  videos.slice(1).forEach((item) => { item!.parentElement!.remove(); });
  select(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0);
}
