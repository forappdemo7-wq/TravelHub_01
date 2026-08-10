'use client';

import { useCurrency } from '@/app/context/CurrencyContext';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const currencies = [
  { code: 'USD', symbol: '$', name: 'USD' },
  { code: 'INR', symbol: '₹', name: 'INR' },
  { code: 'JPY', symbol: '¥', name: 'JPY' },
  { code: 'EUR', symbol: '€', name: 'EUR' },
  { code: 'GBP', symbol: '£', name: 'GBP' },
];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <span className="font-medium">{currency.symbol}</span>
        <span>{currency.code}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {currencies.map((cur) => (
            <button
              key={cur.code}
              onClick={() => {
                setCurrency(cur.code as any);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currency.code === cur.code ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
              }`}
            >
              {cur.symbol} {cur.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}