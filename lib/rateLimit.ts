const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (now > record.expiresAt) {
    rateLimitStore.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

// Memory cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, record]) => {
    if (now > record.expiresAt) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);
