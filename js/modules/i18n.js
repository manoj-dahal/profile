/**
 * i18n Module
 * Loads translation files and swaps text on the page
 *
 * Usage:
 *   import { initI18n, t } from './i18n.js';
 *   initI18n();
 *   document.querySelector('[data-i18n]').textContent = t('hero.greeting');
 */

const STORAGE_KEY = 'preferred_locale';
const DEFAULT_LOCALE = 'en';

const translations = {};
let currentLocale = DEFAULT_LOCALE;

/**
 * Load a locale file
 */
export async function loadLocale(locale) {
  if (translations[locale]) return translations[locale];

  try {
    const res = await fetch(`/locales/${locale}.json`);
    if (!res.ok) throw new Error(`Locale ${locale} not found`);
    const data = await res.json();
    translations[locale] = data.translations;
    return data.translations;
  } catch (e) {
    console.warn(`Failed to load locale ${locale}:`, e);
    return translations[DEFAULT_LOCALE] || {};
  }
}

/**
 * Initialize i18n
 */
export async function initI18n() {
  // Detect user preference: URL > localStorage > browser > default
  const urlLocale = new URLSearchParams(location.search).get('lang');
  const storedLocale = localStorage.getItem(STORAGE_KEY);
  const browserLocale = navigator.language.split('-')[0];

  const supportedLocales = ['en', 'ne']; // hardcoded for now
  const locale = [urlLocale, storedLocale, browserLocale, DEFAULT_LOCALE]
    .find(l => l && supportedLocales.includes(l)) || DEFAULT_LOCALE;

  await setLocale(locale);
}

/**
 * Set the current locale
 */
export async function setLocale(locale) {
  const translations = await loadLocale(locale);
  currentLocale = locale;
  document.documentElement.lang = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  applyTranslations();
  return translations;
}

/**
 * Get a translation by key with optional interpolations
 *   t('hero.greeting')                          → "Hello, I'm"
 *   t('footer.copyright', { year: 2026 })       → "© 2026 ..."
 */
export function t(key, vars = {}) {
  const parts = key.split('.');
  let value = translations[currentLocale];

  for (const part of parts) {
    if (value == null) return key;
    value = value[part];
  }

  if (typeof value !== 'string') return key;

  return value.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? `{{${name}}}`);
}

/**
 * Apply translations to all elements with data-i18n attributes
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });
}

/**
 * Get the current locale
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Get all available locales
 */
export function getAvailableLocales() {
  return [
    { code: 'en', name: 'English' },
    { code: 'ne', name: 'नेपाली' }
  ];
}
