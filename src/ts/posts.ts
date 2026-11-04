export interface Post {
  slug: string;
  title: string;
  description: string;
  published: string;
  readingMinutes: number;
  hidden?: boolean;
}

export const posts: readonly Post[] = [
  {
    slug: 'space-between-design-and-engineering',
    title: 'The Space Between Design and Engineering',
    description: 'Some thoughts on how learning to build software changed the way I think about design.',
    published: '2026-11-04',
    readingMinutes: 6, // 1,173 words of body copy, at about 200 words a minute.
  },
];

export const shownPosts = posts
  .filter((post) => !post.hidden)
  .sort((a, b) => b.published.localeCompare(a.published));

export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(iso));
}
