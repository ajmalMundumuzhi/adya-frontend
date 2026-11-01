const formatters = new Map();

const getFormatter = (locale, currency) => {
  const key = `${locale}|${currency}`;

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
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
  const convertedAmount = convertFromAUD(amountAUD, exchangeRate);

  return formatCurrency(convertedAmount, country);
};