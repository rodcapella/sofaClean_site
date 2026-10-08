export interface Cache {
  get(key: string): Promise<any>;
  set(key: string, value: unknown, ttl: number): Promise<void>;
  acquire(key: string, owner: string, ttl: number): Promise<boolean>;
  release(key: string, owner: string): Promise<void>;
  remove(key: string): Promise<void>;
}
export function createRedisCache(options: { url: string; token: string; fetchImpl?: typeof fetch }): Cache;
export function createMemoryCache(now?: () => number): Cache;
