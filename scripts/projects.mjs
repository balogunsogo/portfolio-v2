// Render the homepage list from the same typed data the browser uses.
// TypeScript is already a build dependency; no browser runtime is added.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function projectListMarkup(file) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {};
  // Evaluating our own data module creates its exports; its DOM helpers aren't called.
  runInNewContext(outputText, { exports }, { filename: file });
  return exports.shownProjects.map((project, index) => {
    const newTab = Boolean(project.external) && !project.caseStudy;
    const className = `work__link${project.stemAligned ? ' work__link--stem' : ''}`;
    const target = newTab ? ' target="_blank" rel="noopener"' : '';
    const suffix = newTab ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';
    return `<li><a class="${className}" href="${escape(project.caseStudy ?? project.href)}" data-project-index="${index}"${target}><span data-work-title>${escape(project.title)}</span>${suffix}</a></li>`;
  }).join('');
}
