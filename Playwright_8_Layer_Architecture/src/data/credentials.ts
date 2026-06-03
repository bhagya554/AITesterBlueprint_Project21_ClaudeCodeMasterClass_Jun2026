/**
 * Layer 6 - Data
 * Static, environment-seeded credentials. Pulls secrets from Layer 1 config.
 */
import { env } from '../config/env.config.js';
import type { Credentials } from './types.js';

export const adminCredentials: Credentials = {
  email: env.adminEmail,
  password: env.adminPassword,
};

export const invalidCredentials: Credentials = {
  email: 'user@example.com',
  password: 'wrongpassword',
};
