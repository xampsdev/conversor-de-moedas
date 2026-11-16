export type CurrencyCode = "BRL" | "USD";

export interface AwesomeApiQuote {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export interface AwesomeApiResponse {
  USDBRL: AwesomeApiQuote;
  BRLUSD: AwesomeApiQuote;
}

export interface AwesomeApiDailyEntry {
  bid: string;
  timestamp: string;
  high?: string;
  low?: string;
}

export interface ExchangeRates {
  USDBRL: number;
  BRLUSD: number;
  pctChangeUsdBrl: number;
  highUsdBrl: number;
  lowUsdBrl: number;
  updatedAt: number;
  source: "live" | "cache";
}

export interface DailyRatePoint {
  timestamp: number;
  dateLabel: string;
  bid: number;
}

export interface ConversionState {
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  rawInput: string;
  amount: number | null;
  convertedAmount: number | null;
  validationError: string | null;
}
