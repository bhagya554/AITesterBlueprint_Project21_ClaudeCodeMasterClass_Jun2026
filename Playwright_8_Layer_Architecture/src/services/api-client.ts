/**
 * Layer 5 - Services/API
 * Thin wrapper over Playwright's APIRequestContext. Used for fast backend
 * setup/teardown so UI tests don't pay for data creation through the browser.
 */
import { APIRequestContext, request } from '@playwright/test';
import { env } from '../config/env.config.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('ApiClient');

export class ApiClient {
  private constructor(private readonly ctx: APIRequestContext) {}

  static async create(token?: string): Promise<ApiClient> {
    const ctx = await request.newContext({
      baseURL: env.apiURL,
      extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return new ApiClient(ctx);
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    log.info(`POST ${path}`);
    const res = await this.ctx.post(path, { data });
    if (!res.ok()) throw new Error(`POST ${path} failed: ${res.status()}`);
    return res.json() as Promise<T>;
  }

  async get<T>(path: string): Promise<T> {
    log.info(`GET ${path}`);
    const res = await this.ctx.get(path);
    if (!res.ok()) throw new Error(`GET ${path} failed: ${res.status()}`);
    return res.json() as Promise<T>;
  }

  async delete(path: string): Promise<void> {
    log.info(`DELETE ${path}`);
    const res = await this.ctx.delete(path);
    if (!res.ok()) throw new Error(`DELETE ${path} failed: ${res.status()}`);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }
}
