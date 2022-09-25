import { readFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

const packageJson = await readFile(new URL('./package.json', import.meta.url), 'utf-8');
const { dependencies } = JSON.parse(packageJson);

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts'],
  format: ['cjs'],
  outDir: 'bundle',
  target: 'es2021',
  tsconfig: 'src/tsconfig.json',
  noExternal: [...Object.keys(dependencies)],
  shims: false,
  sourcemap: false,
  bundle: true,
  minify: true,
  keepNames: false
});
