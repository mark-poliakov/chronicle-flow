import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import path from 'path';

const TEST_DB_PATH = path.resolve(process.cwd(), 'prisma/test.db');
process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` },
});
