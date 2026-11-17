// Section navigation: a desktop-only "On this page" list in the right page margin,
// built from the page's own [data-toc] headings. CSS hides it below 1024 and in TL;DR.

const APPEAR_AT = 0.6; // the first listed heading has risen to 60% down the viewport
const LEAVE_AT = 0.55; // the footer ([data-toc-end]) has risen above 55%
const ACTIVE_AT = 0.4; // the current section: the last heading at or above 40%

interface SectionNavOptions {
  /** Called after a jump, like the reading switch's onJump (re-syncs the top bar). */
  onJump?: () => void;
}

export function initSectionNav(options: SectionNavOptions = {}): void {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('[data-toc]')).filter((heading) => heading.id);
  if (headings.length < 2) return;
  const end = document.querySelector<HTMLElement>('[data-toc-end]');

  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', 'On this page');
  const marks = document.createElement('div');
  marks.className = 'section-nav__marks';
  marks.setAttribute('aria-hidden', 'true');
  const list = document.createElement('ol');
  list.className = 'section-nav__panel';

  const rows: { mark: HTMLElement; rowMark: HTMLElement; link: HTMLAnchorElement }[] = [];
  for (const heading of headings) {
    const mark = document.createElement('span');
    mark.className = 'section-nav__mark';
    marks.append(mark);

    const link = document.createElement('a');
    link.className = 'section-nav__link';
    link.href = `#${heading.id}`;
    const title = document.createElement('span');
    title.className = 'section-nav__title';
    // data-toc="" uses the heading's own text; a value is an optional shorter label.
    title.textContent = (heading.dataset.toc || heading.textContent || '').replace(/\s+/g, ' ').trim();
    const rowMark = document.createElement('span');
    rowMark.className = 'section-nav__mark';
    rowMark.setAttribute('aria-hidden', 'true');
    link.append(title, rowMark);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      heading.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${heading.id}`);
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      options.onJump?.();
    });

    const item = document.createElement('li');
    item.append(link);
    list.append(item);
    rows.push({ mark, rowMark, link });
  }
  nav.append(marks, list);
  const topBar = document.querySelector('[data-case-top]');
  if (topBar) topBar.after(nav);
  else document.body.append(nav);

  let current = -1;
  let frame = 0;
  const update = (): void => {
    frame = 0;
    const height = window.innerHeight;
    let active = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= height * ACTIVE_AT) active = index;
    });
    const first = headings[0].getBoundingClientRect().top;
    const endTop = end ? end.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
    // Short footers cannot reach LEAVE_AT before scrolling ends; hide there too.
    const atBottom = Math.ceil(window.scrollY + height) >= document.documentElement.scrollHeight;
    nav.classList.toggle('is-visible', first <= height * APPEAR_AT && endTop > height * LEAVE_AT && !atBottom);
    if (active === current) return;
    current = active;
    rows.forEach((row, index) => {
      const on = index === active;
      row.mark.classList.toggle('is-active', on);
      row.rowMark.classList.toggle('is-active', on);
      row.link.classList.toggle('is-active', on);
      if (on) row.link.setAttribute('aria-current', 'location');
      else row.link.removeAttribute('aria-current');
    });
  };
  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  // Full story / TL;DR changes the layout without necessarily scrolling.
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  update();
}
