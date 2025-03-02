import { THRRate } from '../types';

/**
 * Performs a gacha roll based on the provided rates
 */
export const performGachaRoll = (rates: THRRate[]) => {
  // Validate total rate is 100%
  const totalRate = rates.reduce((sum, rate) => sum + rate.rate, 0);
  if (totalRate !== 100) {
    // console.error('Rates do not add up to 100%');
    // Return the first rate as a fallback
    return rates[0];
  }

  // Generate a random number between 0 and 100
  const rand = Math.random() * 100;
  
  // Find which rate we landed on
  let currentTotal = 0;
  for (const rate of rates) {
    currentTotal += rate.rate;
    if (rand <= currentTotal) {
      // console.log(`Rolled: ${rand}, landed on: ${rate.amount} (${rate.rate}%)`);
      return rate;
    }
  }
  
  // This should never happen if rates total 100%, but just in case
  // console.error('No rate selected in gacha roll, returning first rate');
  return rates[0];
};

/**
 * Formats a number as Indonesian Rupiah currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Validates that the rates add up to 100%
 */
export const validateRates = (rates: THRRate[]): boolean => {
  if (rates.length === 0) return false;
  
  const totalRate = rates.reduce((sum, rate) => sum + rate.rate, 0);
  return totalRate === 100;
};