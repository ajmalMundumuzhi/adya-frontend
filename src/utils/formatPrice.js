const formatters = new Map();

const getFormatter = (locale, currency) => {
  const key = `${locale}|${currency}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    );
  }
  return formatters.get(key);
};

export const convertFromInr = (amountInr, country) => Math.round(amountInr * country.rate);

export const formatCurrency = (amount, country) =>
  getFormatter(country.locale, country.currency).format(amount);

export const formatPrice = (amountInr, country) =>
  formatCurrency(convertFromInr(amountInr, country), country);