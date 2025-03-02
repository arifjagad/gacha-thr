import { AppState } from '../types';
import { saveToSupabase } from './supabase';

// Save to localStorage
export const saveState = (state: AppState): void => {
  localStorage.setItem('thr_gacha_state', JSON.stringify(state));
  
  // If there's a shareId, also save to Supabase
  if (state.shareId) {
    saveToSupabase(state.shareId, state.rates, state.recipients)
      .catch(err => console.error('Error saving to Supabase:', err));
  }
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