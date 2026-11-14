export function initSoundCompare(root: HTMLElement): void {
  const audios = Array.from(root.querySelectorAll<HTMLAudioElement>('[data-sound-audio]'));
  const buttons: HTMLButtonElement[] = [];
  let generation = 0;
  const stop = (audio: HTMLAudioElement): void => {
    audio.pause();
    audio.currentTime = 0;
  };
  audios.forEach((audio, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'writing-control writing-control--ink';
    button.textContent = audio.dataset.soundAudio!;
    button.setAttribute('aria-pressed', 'false');
    const sync = (): void => { button.setAttribute('aria-pressed', String(!audio.paused && !audio.ended)); };
    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    audio.addEventListener('ended', sync);
    button.addEventListener('click', () => {
      const ticket = ++generation;
      const playing = button.getAttribute('aria-pressed') === 'true';
      audios.forEach(stop);
      buttons.forEach((item) => item.setAttribute('aria-pressed', 'false'));
      if (playing) return;
      button.setAttribute('aria-pressed', 'true');
      audio.play().then(() => {
        if (ticket !== generation) {
          // A newer press owns playback, including another press of this clip.
          if (buttons[index].getAttribute('aria-pressed') !== 'true') stop(audio);
        } else sync();
      }).catch(() => {
        if (ticket === generation) button.setAttribute('aria-pressed', 'false');
      });
    });
    audio.controls = false;
    audio.hidden = true;
    audio.parentElement!.replaceChildren(button, audio);
    buttons.push(button);
  });
  window.addEventListener('pagehide', () => {
    generation++;
    audios.forEach(stop);
    buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
  });
}
