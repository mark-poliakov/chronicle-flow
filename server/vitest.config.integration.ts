import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['test/integration/**/*.int-spec.ts'],
    setupFiles: ['./test/integration/global-setup.ts'],
    pool: 'forks',
    fileParallelism: false,
    testTimeout: 10_000,
  },
});
