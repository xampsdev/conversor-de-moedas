import type { CurrencyCode } from "../types/currency";

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: "pt-BR" | "en-US";
  decimalSeparator: "," | ".";
  placeholder: string;
}

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  BRL: {
    code: "BRL",
    name: "Real Brasileiro",
    symbol: "R$",
    locale: "pt-BR",
    decimalSeparator: ",",
    placeholder: "0,00",
  },
  USD: {
    code: "USD",
    name: "Dólar Americano",
    symbol: "US$",
    locale: "en-US",
    decimalSeparator: ".",
    placeholder: "0.00",
  },
};

export const MAX_CONVERSION_AMOUNT = 1_000_000_000_000;

export function formatCurrency(value: number, currency: CurrencyCode): string {
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyDisplay(
  value: number,
  currency: CurrencyCode,
): string {
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumberForDisplay(
  value: number,
  currency: CurrencyCode,
  fractionDigits = 2,
): string {
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatExchangeRate(rate: number, decimals = 4): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rate);
}

export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export function parseCurrencyInput(rawValue: string): number | null {
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  // Limit to 15 digits to stay well within IEEE-754 safe integer precision
  const boundedDigits = digits.slice(0, 15);
  const cents = Number.parseInt(boundedDigits, 10);

  if (!Number.isFinite(cents)) {
    return null;
  }

  return cents / 100;
}

export function validateConversionAmount(amount: number | null): string | null {
  if (amount === null) {
    return null;
  }

  if (!Number.isFinite(amount) || amount < 0) {
    return "Informe um valor numérico válido.";
  }

  if (amount > MAX_CONVERSION_AMOUNT) {
    return "Valor excede o limite máximo suportado para conversão.";
  }

  return null;
}
