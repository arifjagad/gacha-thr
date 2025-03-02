import { AppState } from '../types';

// Save to localStorage
export const saveState = (state: AppState): void => {
  localStorage.setItem('thr_gacha_state', JSON.stringify(state));
};

// Load from localStorage
export const loadState = (): AppState | null => {
  const saved = localStorage.getItem('thr_gacha_state');
  return saved ? JSON.parse(saved) : null;
};

// Reset all data
export const resetAllData = (): void => {
  localStorage.removeItem('thr_gacha_state');
};