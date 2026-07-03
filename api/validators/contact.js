/**
 * Contact Form Validator
 * Returns array of error messages (empty = valid)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_EMAIL_DOMAINS = new Set(['mailinator.com', 'tempmail.com', '10minutemail.com']);

export function validateContact({ name, email, subject, message }) {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }
  if (name && name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  if (!email || !EMAIL_RE.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  if (email) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      errors.push({ field: 'email', message: 'Please use a non-disposable email' });
    }
  }

  if (subject && subject.length > 200) {
    errors.push({ field: 'subject', message: 'Subject must be less than 200 characters' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  }
  if (message && message.length > 5000) {
    errors.push({ field: 'message', message: 'Message must be less than 5000 characters' });
  }

  // Spam heuristics
  if (message && containsSpam(message)) {
    errors.push({ field: 'message', message: 'Message contains blocked content' });
  }

  return errors;
}

function containsSpam(text) {
  const spamPatterns = [
    /\b(viagra|cialis|crypto giveaway|free bitcoin)\b/i,
    /https?:\/\/[^\s]+\s+https?:\/\//i,  // multiple URLs
    /(.)\1{10,}/                            // repeated chars
  ];
  return spamPatterns.some(p => p.test(text));
}

export function validateProject({ title, slug, description, year }) {
  const errors = [];

  if (!title || title.trim().length < 2) errors.push({ field: 'title', message: 'Title required' });
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) errors.push({ field: 'slug', message: 'Slug must be lowercase letters, numbers, hyphens' });
  if (year && (year < 1990 || year > 2100)) errors.push({ field: 'year', message: 'Invalid year' });
  if (description && description.length > 10000) errors.push({ field: 'description', message: 'Description too long' });

  return errors;
}
