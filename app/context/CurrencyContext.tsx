'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CurrencyCode = 'USD' | 'INR' | 'JPY' | 'EUR' | 'GBP';

interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // conversion rate from USD
  name: string;
}

const currencies: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  INR: { code: 'INR', symbol: '₹', rate: 95.33, name: 'Indian Rupee' },
  JPY: { code: 'JPY', symbol: '¥', rate: 158.8, name: 'Japanese Yen' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.74, name: 'British Pound' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('preferredCurrency') as CurrencyCode;
    if (saved && currencies[saved]) setCurrencyCode(saved);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    localStorage.setItem('preferredCurrency', code);
  };

  const currency = currencies[currencyCode];

  const convertPrice = (priceUSD: number) => {
    return priceUSD * currency.rate;
  };

  const formatPrice = (priceUSD: number) => {
    const converted = convertPrice(priceUSD);
    // For JPY, no decimals; for others, 2 decimals
    const decimals = currencyCode === 'JPY' ? 0 : 2;
    return `${currency.symbol}${converted.toFixed(decimals)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}