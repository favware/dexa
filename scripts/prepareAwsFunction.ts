import { copyFileAtomic, remove } from 'fs-nextra';
import { join } from 'path';

const ASSETS_PACKAGE_JSON = join(__dirname, '..', 'assets', 'package.lambda.json');
const AWS_DIR = join(__dirname, '..', 'functions', 'dexa');
const AWS_PACKAGE_JSON = join(AWS_DIR, 'package.json');
const AWS_TSBUILDINFO = join(AWS_DIR, 'tsconfig.tsbuildinfo');

Promise.all([
  copyFileAtomic(ASSETS_PACKAGE_JSON, AWS_PACKAGE_JSON),
  remove(AWS_TSBUILDINFO)
]);