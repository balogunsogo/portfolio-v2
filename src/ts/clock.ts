// Live local time for Lagos (Africa/Lagos, GMT+1), updated on the minute.

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function initClock(element: HTMLTimeElement): void {
  const render = (): void => {
    const now = new Date();
    element.textContent = formatter.format(now);
    element.dateTime = now.toISOString();
  };

  render();

  // Align the first tick to the next minute boundary, then tick every minute.
  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  window.setTimeout(() => {
    render();
    window.setInterval(render, 60_000);
  }, msToNextMinute);
}
