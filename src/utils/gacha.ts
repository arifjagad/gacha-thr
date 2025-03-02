import { THRRate } from '../types';

export const performGachaRoll = (rates: THRRate[]): THRRate => {
  const random = Math.random() * 100;
  let cumulativeRate = 0;
  
  for (const rate of rates) {
    cumulativeRate += rate.rate;
    if (random <= cumulativeRate) {
      return rate;
    }
  }
  
  return rates[rates.length - 1]; // Fallback
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const validateRates = (rates: THRRate[]): boolean => {
  const totalRate = rates.reduce((sum, rate) => sum + rate.rate, 0);
  return Math.abs(totalRate - 100) < 0.01; // Allow for floating point imprecision
};