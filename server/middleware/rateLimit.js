/**
 * Rate Limiting Middleware
 * In-memory token bucket per IP
 */

const buckets = new Map();

export function rateLimit({ windowMs = 60000, max = 60, message = 'Too many requests' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count++;
    buckets.set(key, bucket);

    res.set({
      'X-RateLimit-Limit':     max,
      'X-RateLimit-Remaining': Math.max(0, max - bucket.count),
      'X-RateLimit-Reset':     Math.ceil(bucket.resetAt / 1000)
    });

    if (bucket.count > max) {
      return res.status(429).json({ error: message, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) });
    }

    next();
  };
}

// Cleanup old buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref();
