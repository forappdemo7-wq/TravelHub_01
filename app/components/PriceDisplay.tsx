'use client';

import { useCurrency } from '@/app/context/CurrencyContext';

export default function PriceDisplay({ price }: { price: number }) {
  const { formatPrice } = useCurrency();
  return <span>{formatPrice(price)}</span>;
}