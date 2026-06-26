import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

export const EXAMVIEW_REPORTS_ROOT = resolve(
  SCRIPT_DIR,
  '../../../sources/examview-test-banks/outputs/reports',
);

export function reportPath(...segments) {
  return join(EXAMVIEW_REPORTS_ROOT, ...segments);
}
