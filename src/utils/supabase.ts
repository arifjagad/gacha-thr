import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ShareData {
  id: string;
  share_id: string;
  rates: string; // JSON string of THRRate[]
  recipients: string; // JSON string of Recipient[]
  created_at: string;
  updated_at: string;
}

// Save data to Supabase
export const saveToSupabase = async (shareId: string, rates: any[], recipients: any[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('thr_shares')
      .upsert({
        share_id: shareId,
        rates: JSON.stringify(rates),
        recipients: JSON.stringify(recipients),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'share_id'
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return false;
  }
};

// Load data from Supabase by share ID
export const loadFromSupabase = async (shareId: string): Promise<{ rates: any[], recipients: any[] } | null> => {
  try {
    const { data, error } = await supabase
      .from('thr_shares')
      .select('rates, recipients')
      .eq('share_id', shareId)
      .single();

    if (error || !data) {
      console.error('Error loading from Supabase:', error);
      return null;
    }

    return {
      rates: JSON.parse(data.rates),
      recipients: JSON.parse(data.recipients)
    };
  } catch (error) {
    console.error('Error loading from Supabase:', error);
    return null;
  }
};

// Check if a share ID exists
export const checkShareIdExists = async (shareId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('thr_shares')
      .select('share_id')
      .eq('share_id', shareId)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking share ID:', error);
    return false;
  }
};