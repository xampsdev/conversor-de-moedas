import { useCallback, useEffect, useState } from "react";
import {
  AwesomeApiError,
  fetchDailyUsdBrlHistory,
  fetchExchangeRates,
} from "../services/awesomeApi";
import type { DailyRatePoint, ExchangeRates } from "../types/currency";

const RATES_CACHE_KEY = "conversor_fx_rates_v1";
const HISTORY_CACHE_KEY = "conversor_fx_history_v1";

function readCachedRates(): ExchangeRates | null {
  try {
    const raw = window.localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ExchangeRates>;
    if (
      typeof parsed.USDBRL === "number" &&
      parsed.USDBRL > 0 &&
      typeof parsed.BRLUSD === "number" &&
      parsed.BRLUSD > 0 &&
      typeof parsed.updatedAt === "number"
    ) {
      return {
        USDBRL: parsed.USDBRL,
        BRLUSD: parsed.BRLUSD,
        pctChangeUsdBrl:
          typeof parsed.pctChangeUsdBrl === "number"
            ? parsed.pctChangeUsdBrl
            : 0,
        highUsdBrl:
          typeof parsed.highUsdBrl === "number"
            ? parsed.highUsdBrl
            : parsed.USDBRL,
        lowUsdBrl:
          typeof parsed.lowUsdBrl === "number"
            ? parsed.lowUsdBrl
            : parsed.USDBRL,
        updatedAt: parsed.updatedAt,
        source: "cache",
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writeCachedRates(rates: ExchangeRates): void {
  try {
    window.localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(rates));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

function readCachedHistory(): DailyRatePoint[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as DailyRatePoint[]) : [];
  } catch {
    return [];
  }
}

function writeCachedHistory(history: DailyRatePoint[]): void {
  try {
    window.localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(history));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

export interface UseExchangeRateResult {
  rates: ExchangeRates | null;
  history: DailyRatePoint[];
  isLoading: boolean;
  isRefreshing: boolean;
  isOfflineFallback: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

export function useExchangeRate(): UseExchangeRateResult {
  const [rates, setRates] = useState<ExchangeRates | null>(() =>
    readCachedRates(),
  );
  const [history, setHistory] = useState<DailyRatePoint[]>(() =>
    readCachedHistory(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCachedRates());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRates = useCallback(async (manual = false) => {
    if (manual) {
      setIsRefreshing(true);
    } else {
      setIsLoading((prev) => prev || !readCachedRates());
    }
    setError(null);

    try {
      const [liveRates, dailyHistory] = await Promise.all([
        fetchExchangeRates(),
        fetchDailyUsdBrlHistory().catch(() => null),
      ]);

      setRates(liveRates);
      setIsOfflineFallback(false);
      writeCachedRates(liveRates);

      if (dailyHistory && dailyHistory.length > 0) {
        setHistory(dailyHistory);
        writeCachedHistory(dailyHistory);
      }
    } catch (err) {
      const message =
        err instanceof AwesomeApiError
          ? err.message
          : "Falha inesperada ao obter cotação atualizada.";

      const cached = readCachedRates();
      if (cached) {
        setRates({ ...cached, source: "cache" });
        setIsOfflineFallback(true);
        setError(
          `Modo offline: exibindo última cotação salva. (${message})`,
        );
      } else {
        setIsOfflineFallback(false);
        setError(message);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRates(false);
  }, [loadRates]);

  const refresh = useCallback(async () => {
    await loadRates(true);
  }, [loadRates]);

  return {
    rates,
    history,
    isLoading,
    isRefreshing,
    isOfflineFallback,
    error,
    lastUpdated: rates?.updatedAt ?? null,
    refresh,
  };
}
