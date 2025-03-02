export interface THRRate {
  amount: number;
  rate: number;
  id: string;
}

export interface Recipient {
  name: string;
  amount: number;
  timestamp: string;
  freeRollsRemaining: number;
}

export interface AppState {
  rates: THRRate[];
  recipients: Recipient[];
  totalRolls: number;
  isConfigured: boolean;
  initialFreeRolls: number;
  shareId?: string;
}