export const BASE_CURRENCY = 'INR';

export const STORAGE_KEY = 'saree-store.country';

export const DEFAULT_COUNTRY_CODE = 'AU';

export const RATES_DISCLAIMER =
  'Prices are illustrative conversions from INR using fixed demo rates, not live exchange rates.';

export const COUNTRIES = Object.freeze([
  { code: 'AU', name: 'Australia', currency: 'AUD', locale: 'en-AU', rate: 0.018 },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', locale: 'en-NZ', rate: 0.0198 },
  { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US', rate: 0.0119 },
  { code: 'CA', name: 'Canada', currency: 'CAD', locale: 'en-CA', rate: 0.0166 },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB', rate: 0.0092 },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', locale: 'ms-MY', rate: 0.05 },
  { code: 'SG', name: 'Singapore', currency: 'SGD', locale: 'en-SG', rate: 0.0154 },
]);

export const isSupportedCountry = (code) => COUNTRIES.some((country) => country.code === code);

export const getCountry = (code) =>
  COUNTRIES.find((country) => country.code === code) ??
  COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY_CODE);