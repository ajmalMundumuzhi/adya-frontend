import { useCallback, useMemo, useState } from 'react';
import CurrencyContext from './CurrencyContext';
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  STORAGE_KEY,
  getCountry,
  isSupportedCountry,
} from '../config/currency';
import { convertFromInr, formatCurrency, formatPrice } from '../utils/formatPrice';

const readStoredCode = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedCountry(stored) ? stored : DEFAULT_COUNTRY_CODE;
  } catch (error) {
    return DEFAULT_COUNTRY_CODE;
  }
};

export default function CurrencyProvider({ children }) {
  const [code, setCode] = useState(readStoredCode);
  const country = useMemo(() => getCountry(code), [code]);

  const setCountryCode = useCallback((nextCode) => {
    if (!isSupportedCountry(nextCode)) return;
    setCode(nextCode);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    } catch (error) {
      return;
    }
  }, []);

  const value = useMemo(
    () => ({
      country,
      countries: COUNTRIES,
      setCountryCode,
      convert: (amountInr) => convertFromInr(amountInr, country),
      format: (amount) => formatCurrency(amount, country),
      formatPrice: (amountInr) => formatPrice(amountInr, country),
    }),
    [country, setCountryCode],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}