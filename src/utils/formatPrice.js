const formatters = new Map();

const normalizeLocale = (locale) => {
  const normalized = String(locale || "en-US")
    .replace(/^([a-z]{2})([A-Z]{2})$/, "$1-$2");

  try {
    Intl.getCanonicalLocales(normalized);
    return normalized;
  } catch {
    return "en-US";
  }
};

const getFormatter = (locale, currency) => {
  const validLocale = normalizeLocale(locale);
  const key = `${validLocale}|${currency}`;

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(validLocale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  return formatters.get(key);
};

export const convertFromAUD = (amountAUD, exchangeRate = 1) => {
  return Number(amountAUD || 0) * Number(exchangeRate || 1);
};

export const formatCurrency = (amount, country) => {
  return getFormatter(country.locale, country.currency).format(
    Number(amount || 0)
  );
};

export const formatPrice = (amountAUD, country, exchangeRate = 1) => {
  return formatCurrency(
    convertFromAUD(amountAUD, exchangeRate),
    country
  );
};