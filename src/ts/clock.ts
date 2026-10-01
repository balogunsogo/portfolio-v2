// Live local time for Lagos (Africa/Lagos, GMT+1), updated on the minute.
// The time is written as text and, when hands are passed, drawn on the analog clock.

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

interface ClockHands {
  hour: SVGElement;
  minute: SVGElement;
  /** Digital time printed on the face. */
  readout?: SVGElement | null;
}

// Centre of the clock's viewBox, which the hands turn around.
const CENTRE = 48;

export function initClock(element: HTMLTimeElement, hands?: ClockHands): void {
  const render = (): void => {
    const now = new Date();
    const parts = formatter.formatToParts(now);
    const part = (type: string): number => Number(parts.find((p) => p.type === type)?.value ?? 0);
    const hour = part('hour');
    const minute = part('minute');

    element.textContent = formatter.format(now);
    element.dateTime = now.toISOString();

    if (hands) {
      const rotate = (degrees: number): string => `rotate(${degrees} ${CENTRE} ${CENTRE})`;
      hands.hour.setAttribute('transform', rotate(((hour % 12) + minute / 60) * 30));
      hands.minute.setAttribute('transform', rotate(minute * 6));
      if (hands.readout) hands.readout.textContent = formatter.format(now);
    }
  };

  render();

  // Align the first tick to the next minute boundary, then tick every minute.
  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  window.setTimeout(() => {
    render();
    window.setInterval(render, 60_000);
  }, msToNextMinute);
}
