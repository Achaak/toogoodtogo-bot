import { env } from '../env/server.js';

export const formatCurrency = (value: number, currency: string) => {
  const currencyFormatter = new Intl.NumberFormat(env.LOCALE, {
    style: 'currency',
    currency: currency,
  });

  return currencyFormatter.format(value);
};
