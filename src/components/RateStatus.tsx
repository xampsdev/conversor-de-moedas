import { useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import type { CurrencyCode, ExchangeRates } from "../types/currency";
import { formatExchangeRate, formatTimestamp } from "../utils/formatters";
import { CurrencyFlag } from "./CurrencyFlag";

interface RateStatusProps {
  rates: ExchangeRates | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isOfflineFallback: boolean;
  lastUpdated: number | null;
  onRefresh: () => void;
}

export function RateStatus({
  rates,
  isLoading,
  isRefreshing,
  isOfflineFallback,
  lastUpdated,
  onRefresh,
}: RateStatusProps) {
  const [invertedRate, setInvertedRate] = useState(false);

  const baseCurrency: CurrencyCode = invertedRate ? "BRL" : "USD";
  const quoteCurrency: CurrencyCode = invertedRate ? "USD" : "BRL";

  const rateText = (() => {
    if (!rates) return null;
    if (invertedRate) {
      return `1 BRL = ${formatExchangeRate(rates.BRLUSD, 4)} USD`;
    }
    return `1 USD = ${formatExchangeRate(rates.USDBRL, 2)} BRL`;
  })();

  return (
    <section
      aria-label="Status e ações da cotação"
      className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-3 text-center sm:flex-row sm:gap-3 sm:pt-4 sm:text-left"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            isOfflineFallback ? "bg-amber-400" : "bg-emerald-400"
          }`}
          aria-hidden="true"
        />

        {rates && !isLoading && (
          <div className="flex shrink-0 items-center" aria-hidden="true">
            <CurrencyFlag currency={baseCurrency} className="h-4 w-4" />
            <CurrencyFlag
              currency={quoteCurrency}
              className="-ml-1.5 h-4 w-4 ring-slate-900"
            />
          </div>
        )}

        {isLoading && !rates ? (
          <div className="h-4 w-44 animate-pulse rounded bg-slate-800" />
        ) : (
          <span
            className="text-xs text-slate-300 tabular-nums sm:text-sm"
            title={
              lastUpdated
                ? `Atualizado em ${formatTimestamp(lastUpdated)}`
                : undefined
            }
          >
            {isRefreshing
              ? "Sincronizando cotação..."
              : rateText
                ? `${rateText} · ${isOfflineFallback ? "Cache local" : "Comercial ao vivo"}`
                : "Cotação indisponível"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs font-medium sm:gap-3">
        <button
          type="button"
          onClick={() => setInvertedRate((prev) => !prev)}
          disabled={!rates}
          className="inline-flex min-h-[36px] items-center gap-1 rounded px-2 py-1 text-blue-400 transition-colors hover:text-blue-300 hover:underline active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">
            {invertedRate ? "Ver taxa padrão" : "Inverter taxa"}
          </span>
        </button>

        <span className="text-slate-600" aria-hidden="true">
          ·
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          aria-label="Atualizar cotação manualmente"
          className="group inline-flex min-h-[36px] items-center gap-1 rounded px-2 py-1 text-slate-400 transition-colors hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
              isRefreshing ? "animate-spin text-blue-400" : "group-hover:rotate-180"
            }`}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">
            {isRefreshing ? "Atualizando" : "Atualizar"}
          </span>
        </button>
      </div>
    </section>
  );
}
