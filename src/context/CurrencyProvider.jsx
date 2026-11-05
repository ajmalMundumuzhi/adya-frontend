
import { useCallback, useEffect, useMemo, useState } from "react";
import CurrencyContext from "./CurrencyContext";
import {
  convertFromAUD,
  formatCurrency,
  formatPrice
} from "../utils/formatPrice";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/$/, "");

const STORAGE_KEY = "saree-store.country";

function normalizeCountry(country) {
  const code = String(country.countryCode || country.code || "")
    .trim()
    .toUpperCase();

  const name = String(country.country || country.name || "").trim();
  const currency = String(country.currency || "").trim().toUpperCase();
  const locale = String(country.locale || "").trim();

  if (!code || !name || !currency || !locale) {
    return null;
  }

  return {
    code,
    name,
    currency,
    locale,
    flag: country.flag || ""
  };
}

export default function CurrencyProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [code, setCode] = useState("");
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(null);

  const fetchCountries = useCallback(async () => {
    try {
      setCountriesLoading(true);

      const response = await fetch(`${API_BASE_URL}/shipping/countries`);

      if (!response.ok) {
        throw new Error("Unable to load shipping countries");
      }

      const result = await response.json();

      const countryData = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.countries)
          ? result.data.countries
          : [];

      if (!result.success || !countryData.length) {
        setCountries([]);
        setCode("");
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const normalizedCountries = countryData
        .map(normalizeCountry)
        .filter(Boolean);

      const uniqueCountries = normalizedCountries.filter(
        (country, index, array) =>
          array.findIndex(item => item.code === country.code) === index
      );

      setCountries(uniqueCountries);

      const storedCode = localStorage.getItem(STORAGE_KEY);

      const selected =
        uniqueCountries.find(country => country.code === storedCode) ||
        uniqueCountries[0];

      if (selected) {
        setCode(selected.code);
        localStorage.setItem(STORAGE_KEY, selected.code);
      } else {
        setCode("");
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Shipping countries error:", error);
      setCountries([]);
      setCode("");
      setRatesError(error.message);
    } finally {
      setCountriesLoading(false);
    }
  }, []);

  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/currency/rates`);

      if (!response.ok) {
        throw new Error("Unable to fetch currency rates");
      }

      const result = await response.json();

      if (!result.success || !result.data?.rates) {
        throw new Error("Invalid currency rates response");
      }

      setRates(result.data.rates);
      setRatesError(null);
    } catch (error) {
      console.error("Currency rates error:", error);
      setRatesError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
    fetchRates();
  }, [fetchCountries, fetchRates]);

  const country = useMemo(
    () => countries.find(item => item.code === code) || null,
    [countries, code]
  );

  const exchangeRate = useMemo(() => {
    if (!country) return null;

    if (country.currency === "AUD") return 1;

    const rate = Number(rates[country.currency]);

    return Number.isFinite(rate) && rate > 0 ? rate : null;
  }, [country, rates]);

  const setCountryCode = useCallback(
    nextCode => {
      const selected = countries.find(
        item => item.code === String(nextCode).toUpperCase()
      );

      if (!selected) return;

      setCode(selected.code);
      localStorage.setItem(STORAGE_KEY, selected.code);
    },
    [countries]
  );

  const convert = useCallback(
    amountAUD => {
      if (exchangeRate === null) return null;

      return convertFromAUD(amountAUD, exchangeRate);
    },
    [exchangeRate]
  );

  const format = useCallback(
    amountAUD => {
      if (!country || exchangeRate === null) {
        return "Price unavailable";
      }

      return formatPrice(amountAUD, country, exchangeRate);
    },
    [country, exchangeRate]
  );

  const value = useMemo(
    () => ({
      country,
      countries,
      rates,
      exchangeRate,
      isLoading,
      countriesLoading,
      ratesError,
      refreshRates: fetchRates,
      refreshCountries: fetchCountries,
      setCountryCode,
      convert,
      format,
      formatPrice: format,
      formatCurrency: amount =>
        country
          ? formatCurrency(amount, country)
          : "Price unavailable"
    }),
    [
      country,
      countries,
      rates,
      exchangeRate,
      isLoading,
      countriesLoading,
      ratesError,
      fetchRates,
      fetchCountries,
      setCountryCode,
      convert,
      format
    ]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
