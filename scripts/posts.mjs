// Render the static index from the typed registry, following projects.mjs.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function postListMarkup(file) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {};
  runInNewContext(outputText, { exports }, { filename: file });
  return exports.shownPosts.map((post) =>
    `<li class="post"><a class="post__link" href="/writing/${escape(post.slug)}">${escape(post.title)}</a>` +
    `<p class="post__description">${escape(post.description)}</p>` +
    `<p class="post__meta"><time datetime="${escape(post.published)}">${escape(exports.formatPostDate(post.published))}</time> · ${post.readingMinutes} min read</p></li>`,
  ).join('');
}
