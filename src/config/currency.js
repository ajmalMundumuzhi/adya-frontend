
export const BASE_CURRENCY = "AUD";

export const STORAGE_KEY = "saree-store.country";

export const DEFAULT_COUNTRY_CODE = "AU";

export const RATES_DISCLAIMER =
  "Exchange rates are updated automatically using live reference rates. Final prices are calculated at checkout.";

export const COUNTRIES = Object.freeze([
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    locale: "en-AU",
    flag: "🇦🇺"
  },
  {
    code: "NZ",
    name: "New Zealand",
    currency: "NZD",
    locale: "en-NZ",
    flag: "🇳🇿"
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    flag: "🇺🇸"
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    flag: "🇨🇦"
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    flag: "🇬🇧"
  },
  {
    code: "MY",
    name: "Malaysia",
    currency: "MYR",
    locale: "ms-MY",
    flag: "🇲🇾"
  },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
    locale: "en-SG",
    flag: "🇸🇬"
  }
]);

export const isSupportedCountry = code =>
  COUNTRIES.some(country => country.code === code);

export const getCountry = code =>
  COUNTRIES.find(country => country.code === code) ??
  COUNTRIES.find(country => country.code === DEFAULT_COUNTRY_CODE);
