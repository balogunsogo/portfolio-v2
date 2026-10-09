export interface Project {
  title: string;
  /** Short "type · role" line shown above the description. */
  meta: string;
  /** First paragraph: what the project is. */
  description: string;
  /** Second paragraph: what I did on it. */
  role: string;
  image: string;
  /** Optional resolution variants of the same preview, without changing its crop. */
  imageSrcset?: string;
  href: string;
  external?: boolean;
  /** Root-absolute path of the project's case study. When set, the list and the sheet link to it instead of `href`. */
  caseStudy?: string;
  previewTone: string;
  previewInk: string;
  stemAligned?: boolean;
  /** Kept in the data but left out of the list, the preview and the sheet. */
  hidden?: boolean;
}

export const projects: readonly Project[] = [
  {
    title: 'Jobtrackr',
    meta: 'Product · Design and engineering',
    description:
      'A workspace for the job search. It keeps every application, interview, document and offer in one place, so it’s always clear what needs doing next.',
    role: 'I designed the product and built it end to end, from the interface to a NestJS API on Supabase.',
    image: 'assets/images/projects/jobtrackr.webp',
    href: 'https://jobtrackr.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/jobtrackr',
    previewTone: '#DCD8CF',
    previewInk: '#4A4843',
  },
  {
    title: 'Morrow Studio',
    meta: 'Website and CMS · Design and engineering',
    description:
      'A portfolio for a fictional creative studio, with ten case studies and a Sanity CMS designed around the people who edit it.',
    role: 'I designed the studio and its site, built it in Next.js and Sanity, and designed the editing experience behind it.',
    image: 'assets/images/projects/morrow-studio.webp',
    imageSrcset:
      'assets/images/projects/morrow-studio-480.webp 480w, assets/images/projects/morrow-studio-800.webp 800w, assets/images/projects/morrow-studio.webp 1200w',
    href: 'https://morrowstudio.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/morrow-studio',
    previewTone: '#DED6CB',
    previewInk: '#4A443C',
    stemAligned: true,
  },
  {
    title: 'Acetrail',
    meta: 'Website · Design and development',
    description:
      'The website for Ace Trail Tutors, an online school that prepares students for the IELTS English test.',
    role: 'I redesigned the site and rebuilt it with scroll-led animation in GSAP, and ensured the story reads as clearly on a phone as it does on a laptop.',
    image: 'assets/images/projects/acetrail.webp',
    href: 'https://acetrailtutors.com/',
    external: true,
    caseStudy: '/work/acetrail',
    previewTone: '#C9CFC6',
    previewInk: '#3E443C',
  },
  {
    title: 'All That Is Kim',
    meta: 'Website · Webflow development',
    description:
      'A personal website for Kim, a digital strategist and community builder. It leads with large images and expressive type, which give the site a voice of its own.',
    role: 'I developed it in Webflow, building each page and making sure its character holds up all the way down to a phone screen, not just on a large monitor.',
    image: 'assets/images/projects/all-that-is-kim.webp',
    href: 'https://allthatiskim.com/',
    external: true,
    previewTone: '#D8CCC6',
    previewInk: '#4A3F3A',
    // Hidden until it has a case study.
    hidden: true,
  },
  {
    title: 'Artifacts',
    meta: 'Archive · Creative development',
    description:
      'A growing archive of interactions and motion studies from my projects. Each one stands on its own, so it can be explored, studied and reused.',
    role: 'I designed the archive and built it, along with every piece in it, in Next.js and GSAP.',
    image: 'assets/images/projects/artifacts.webp',
    href: 'https://artifacts.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/artifacts',
    previewTone: '#C8CCD4',
    previewInk: '#3C4049',
  },
  {
    title: 'Now Playing',
    meta: 'Experiment · Frontend',
    description:
      'A page that shows what I’m listening to on Spotify, live.',
    role: 'I designed it and built it in HTML, CSS and JavaScript on the Spotify Web API.',
    image: 'assets/images/projects/now-playing.webp',
    href: 'https://now-playing.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/now-playing',
    previewTone: '#2A2A27',
    previewInk: '#C9C6BE',
    stemAligned: true,
  },
];

/** The projects the home page shows. Indexes in the list, preview and sheet refer to this array. */
export const shownProjects: readonly Project[] = projects.filter((project) => !project.hidden);

/** Use the same source selection for visible images and their cache warmups. */
export function setProjectImage(image: HTMLImageElement, project: Project, sizes: string): void {
  image.sizes = sizes;
  image.srcset = project.imageSrcset ?? '';
  image.src = project.image;
}

/** The description and the role as two block spans: the preview and sheet slots are `<p>`s. */
export function descriptionParts(project: Project, className: string): HTMLSpanElement[] {
  return [project.description, project.role].map((text) => {
    const part = document.createElement('span');
    part.className = className;
    part.textContent = text;
    return part;
  });
}

export function renderProjects(list: HTMLElement): void {
  // The build supplies this list before first paint. Keep those links (and any
  // existing focus) when wiring the interactions; retain the fallback for raw HTML.
  if (list.hasAttribute('data-work-rendered')) return;
  const fragment = document.createDocumentFragment();

  shownProjects.forEach((project, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const title = document.createElement('span');

    link.className = `work__link${project.stemAligned ? ' work__link--stem' : ''}`;
    // A project with a case study links to it in the same tab; the rest go to their live site.
    const newTab = Boolean(project.external) && !project.caseStudy;
    link.href = project.caseStudy ?? project.href;
    link.dataset.projectIndex = String(index);
    if (newTab) {
      link.target = '_blank';
      link.rel = 'noopener';
    }

    title.dataset.workTitle = '';
    title.textContent = project.title;
    link.append(title);

    if (newTab) {
      const suffix = document.createElement('span');
      suffix.className = 'visually-hidden';
      suffix.textContent = ' (opens in a new tab)';
      link.append(suffix);
    }

    item.append(link);
    fragment.append(item);
  });

  list.replaceChildren(fragment);
}
