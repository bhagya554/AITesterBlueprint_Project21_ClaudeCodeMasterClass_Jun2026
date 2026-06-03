/**
 * Layer 6 - Data
 * Shared domain types. Imported by services (L5), factories (L6), tests (L8).
 */
export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface Credentials {
  email: string;
  password: string;
}
