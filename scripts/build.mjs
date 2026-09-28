// Production build: clean dist/, copy static files, compile SCSS (compressed) and TypeScript.
import { clean, copyStatic, run, sassArgs } from './shared.mjs';

try {
  clean();
  copyStatic();
  await run('sass', [...sassArgs, '--style=compressed', '--no-source-map']);
  await run('tsc', ['--project', 'tsconfig.json']);
  console.log('\nBuild complete → dist/');
} catch (error) {
  console.error(`\nBuild failed: ${error.message}`);
  process.exit(1);
}
