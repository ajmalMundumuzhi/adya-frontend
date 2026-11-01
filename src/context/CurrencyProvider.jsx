import { useCallback, useEffect, useMemo, useState } from 'react';
import CurrencyContext from './CurrencyContext';
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  STORAGE_KEY,
  getCountry,
  isSupportedCountry,
} from '../config/currency';
import {
  convertFromAUD,
  formatCurrency,
  formatPrice,
} from '../utils/formatPrice';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || '/api'
).replace(/\/$/, '');

const readStoredCode = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    return isSupportedCountry(stored)
      ? stored
      : DEFAULT_COUNTRY_CODE;
  } catch {
    return DEFAULT_COUNTRY_CODE;
  }
};

export default function CurrencyProvider({ children }) {
  const [code, setCode] = useState(readStoredCode);
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [ratesError, setRatesError] = useState(null);

  const country = useMemo(() => getCountry(code), [code]);

  const exchangeRate = useMemo(() => {
    return Number(rates[country.currency] || 1);
  }, [rates, country]);

  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setRatesError(null);

      const response = await fetch(`${API_BASE_URL}/currency/rates`);

      if (!response.ok) {
        throw new Error('Unable to fetch currency rates');
      }

      const result = await response.json();

      if (!result.success || !result.data?.rates) {
        throw new Error('Invalid currency rates response');
      }

      setRates(result.data.rates);
    } catch (error) {
      setRatesError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const setCountryCode = useCallback((nextCode) => {
    if (!isSupportedCountry(nextCode)) return;

    setCode(nextCode);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextCode);
    } catch {
      return;
    }
  }, []);

  const value = useMemo(() => {
    const convert = (amountAUD) =>
      convertFromAUD(amountAUD, exchangeRate);

    const format = (amountAUD) =>
      formatPrice(amountAUD, country, exchangeRate);

    return {
      country,
      countries: COUNTRIES,
      exchangeRate,
      rates,
      isLoading,
      ratesError,
      refreshRates: fetchRates,
      setCountryCode,
      convert,
      format,
      formatPrice: format,
      formatCurrency: (amount) => formatCurrency(amount, country),
    };
  }, [
    country,
    exchangeRate,
    rates,
    isLoading,
    ratesError,
    fetchRates,
    setCountryCode,
  ]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}