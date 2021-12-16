import { rm } from 'node:fs/promises';

const distFolder = new URL('../dist/', import.meta.url);
const bundleFolder = new URL('../bundle/', import.meta.url);

await rm(distFolder, { recursive: true, force: true });
await rm(bundleFolder, { recursive: true, force: true });
