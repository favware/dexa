import esbuild from 'esbuild';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

async function* scan(path, cb) {
  const dir = await opendir(path);

  for await (const item of dir) {
    const file = join(dir.path, item.name);
    if (item.isFile()) {
      if (cb(file)) yield file;
    } else if (item.isDirectory()) {
      yield* scan(file, cb);
    }
  }
}

const rootFolder = new URL('../', import.meta.url);
const distFolder = new URL('bundle/', rootFolder);
const srcFolder = new URL('src/', rootFolder);

const cb = (path) => path.endsWith('.ts');

const tsFiles = [];

for await (const path of scan(srcFolder, cb)) {
  tsFiles.push(path);
}

await esbuild.build({
  logLevel: 'info',
  entryPoints: tsFiles,
  format: 'cjs',
  resolveExtensions: ['.ts', '.js'],
  write: true,
  bundle: true,
  outdir: fileURLToPath(distFolder),
  platform: 'node',
  tsconfig: join(fileURLToPath(srcFolder), 'tsconfig.json'),
  sourcemap: false,
  external: [],
  minify: true
});
