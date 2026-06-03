/**
 * Layer 1 - Config
 * Single source of truth for environment-driven settings.
 * Every other layer imports `env` instead of reading process.env directly.
 */
import dotenv from 'dotenv';

dotenv.config();

export type TestEnv = 'local' | 'staging' | 'prod';

interface EnvConfig {
  baseURL: string;
  apiURL: string;
  testEnv: TestEnv;
  adminEmail: string;
  adminPassword: string;
  authStatePath: string;
}

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env: EnvConfig = {
  baseURL: required('BASE_URL', 'http://localhost:3000'),
  apiURL: required('API_URL', 'http://localhost:3000/api'),
  testEnv: (process.env.TEST_ENV as TestEnv) || 'local',
  adminEmail: required('ADMIN_EMAIL', 'admin@example.com'),
  adminPassword: required('ADMIN_PASSWORD', 'AdminPass123!'),
  authStatePath: 'playwright/.auth/user.json',
};
