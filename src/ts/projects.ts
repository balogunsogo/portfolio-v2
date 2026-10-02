export interface Project {
  title: string;
  /** Short "type · role" line shown above the description. */
  meta: string;
  description: string;
  image: string;
  href: string;
  external?: boolean;
  /** Root-absolute path of the project's case study. When set, the list and the sheet link to it instead of `href`. */
  caseStudy?: string;
  previewTone: string;
  previewInk: string;
  stemAligned?: boolean;
}

export const projects: readonly Project[] = [
  {
    title: 'Jobtrackr',
    meta: 'Product · Design and engineering',
    description:
      'A job-search workspace for applications, interviews, documents and offers. Designed and built end to end, from the interface to a NestJS API on Supabase with per-user data security.',
    image: 'assets/images/projects/jobtrackr.webp',
    href: 'https://jobtrackr.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/jobtrackr',
    previewTone: '#DCD8CF',
    previewInk: '#4A4843',
  },
  {
    title: 'Acetrail',
    meta: 'Website · Design and development',
    description:
      'The website for Ace Trail Tutors, an online IELTS tutoring platform. An editorial layout with scroll-led storytelling, built to read as clearly on a phone as on desktop.',
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
      'A personal site for Kim, a digital strategist and community builder. Image-led with expressive type, built in Webflow to keep its character down to mobile.',
    image: 'assets/images/projects/all-that-is-kim.webp',
    href: 'https://allthatiskim.com/',
    external: true,
    previewTone: '#D8CCC6',
    previewInk: '#4A3F3A',
  },
  {
    title: 'Artifacts',
    meta: 'Archive · Creative development',
    description:
      'A growing archive of interface interactions and motion studies from my projects, each rebuilt as a standalone piece in Next.js and GSAP.',
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
      'A music interface driven by real Spotify track data, with album artwork and animated transitions between tracks.',
    image: 'assets/images/projects/now-playing.webp',
    href: 'https://now-playing.balogunoluwasogo.com/',
    external: true,
    caseStudy: '/work/now-playing',
    previewTone: '#2A2A27',
    previewInk: '#C9C6BE',
    stemAligned: true,
  },
];

export function renderProjects(list: HTMLElement): void {
  const fragment = document.createDocumentFragment();

  projects.forEach((project, index) => {
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
