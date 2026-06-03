/**
 * Layer 5 - Services/API
 * Domain service: create/delete users via API for test setup + teardown.
 */
import { ApiClient } from './api-client.js';
import type { User } from '../data/types.js';

export class UserService {
  constructor(private readonly api: ApiClient) {}

  async createUser(user: User): Promise<{ id: string } & User> {
    return this.api.post('/users', user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }
}
