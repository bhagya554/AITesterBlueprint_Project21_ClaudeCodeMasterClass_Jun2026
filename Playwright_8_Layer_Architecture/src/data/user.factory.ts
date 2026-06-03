/**
 * Layer 6 - Data
 * Factory builds valid User objects with overridable fields. Keeps tests free
 * of literal test data and guarantees uniqueness for isolation.
 */
import type { Role, User } from './types.js';
import { uniqueEmail, randomString } from '../utils/helpers.js';

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    email: uniqueEmail('qa'),
    password: `Pw_${randomString(10)}1!`,
    fullName: `QA User ${randomString(4)}`,
    role: 'viewer' as Role,
    ...overrides,
  };
}
