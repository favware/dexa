import { defineConfig } from 'tsup';

const {
  default: { dependencies }
} = await import('./package.json', {
  with: { type: 'json' }
});

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts'],
  format: 'cjs',
  outDir: 'bundle',
  target: 'es2022',
  tsconfig: 'src/tsconfig.json',
  noExternal: [...Object.keys(dependencies)],
  shims: false,
  sourcemap: false,
  bundle: true,
  minify: true,
  keepNames: false,
  outExtension: () => ({ js: '.cjs' })
});
