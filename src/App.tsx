import { useEffect, useId, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { CurrencyCard } from "./components/CurrencyCard";
import { QuickAmounts } from "./components/QuickAmounts";
import { RateStatus } from "./components/RateStatus";
import { StatusFeedback } from "./components/StatusFeedback";
import { SwapButton } from "./components/SwapButton";
import { useExchangeRate } from "./hooks/useExchangeRate";
import type { CurrencyCode } from "./types/currency";
import {
  formatCurrencyDisplay,
  formatExchangeRate,
  formatTimestamp,
  parseCurrencyInput,
  validateConversionAmount,
} from "./utils/formatters";

export function App() {
  const [sourceCurrency, setSourceCurrency] = useState<CurrencyCode>("BRL");
  const [amount, setAmount] = useState<number | null>(1000);
  const [rotationCount, setRotationCount] = useState<number>(0);

  const validationErrorId = useId();
  const targetCurrency: CurrencyCode = sourceCurrency === "BRL" ? "USD" : "BRL";

  const {
    rates,
    isLoading,
    isRefreshing,
    isOfflineFallback,
    error: apiError,
    lastUpdated,
    refresh,
  } = useExchangeRate();

  useEffect(() => {
    document.title = `Conversão de Moedas — ${sourceCurrency} ⇄ ${targetCurrency}`;
  }, [sourceCurrency, targetCurrency]);

  const validationError = useMemo(
    () => validateConversionAmount(amount),
    [amount],
  );

  const formattedInput = useMemo(() => {
    if (amount === null) return "";
    return formatCurrencyDisplay(amount, sourceCurrency);
  }, [amount, sourceCurrency]);

  const convertedAmount = useMemo(() => {
    if (amount === null || validationError || !rates) return null;
    const rate = sourceCurrency === "BRL" ? rates.BRLUSD : rates.USDBRL;
    return amount * rate;
  }, [amount, validationError, rates, sourceCurrency]);

  const formattedOutput = useMemo(() => {
    if (convertedAmount === null) return "";
    return formatCurrencyDisplay(convertedAmount, targetCurrency);
  }, [convertedAmount, targetCurrency]);

  const effectiveRateBadge = useMemo(() => {
    if (!rates) return null;
    if (sourceCurrency === "BRL") {
      return `1 USD = ${formatExchangeRate(rates.USDBRL, 2)} BRL`;
    }
    return `1 BRL = ${formatExchangeRate(rates.BRLUSD, 4)} USD`;
  }, [rates, sourceCurrency]);

  const handleInputChange = (nextRaw: string) => {
    const nextAmount = parseCurrencyInput(nextRaw);
    if (nextAmount === 0 && nextRaw.length < formattedInput.length) {
      setAmount(null);
      return;
    }
    setAmount(nextAmount);
  };

  const handleAddQuickAmount = (delta: number) => {
    setAmount((prev) => {
      const base = prev ?? 0;
      return Math.round((base + delta) * 100) / 100;
    });
  };

  const handleClear = () => {
    setAmount(null);
  };

  const handleSwap = () => {
    const nextSource = targetCurrency;
    setRotationCount((prev) => prev + 1);
    setSourceCurrency(nextSource);

    if (convertedAmount !== null && convertedAmount > 0) {
      setAmount(Math.round(convertedAmount * 100) / 100);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-[#0b0f19] via-[#0d1322] to-[#111827] text-slate-100">
      {/* Subtle ambient background glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 top-72 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-16 left-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]"
        aria-hidden="true"
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-xl rounded-3xl bg-slate-900/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:p-8">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-[32px] sm:leading-[40px]">
                Conversão de Moedas
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Simples, rápida e sem complicação pro seu dia a dia
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${
                  isOfflineFallback ? "bg-amber-400" : "bg-emerald-400"
                }`}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">
                {isOfflineFallback ? "Modo offline" : "Cotação segura"}
              </span>
            </div>
          </header>

          <StatusFeedback
            validationError={validationError}
            validationErrorId={validationErrorId}
            apiError={apiError}
            isOfflineFallback={isOfflineFallback}
            isRetrying={isRefreshing}
            onRetry={() => void refresh()}
          />

          <section aria-label="Calculadora de conversão" className="flex flex-col">
            <CurrencyCard
              roleLabel="Você envia"
              currency={sourceCurrency}
              value={formattedInput}
              hasError={Boolean(validationError)}
              errorId={validationErrorId}
              onChange={handleInputChange}
              footerSlot={
                <QuickAmounts
                  currency={sourceCurrency}
                  hasValue={amount !== null && amount > 0}
                  onAddAmount={handleAddQuickAmount}
                  onClear={handleClear}
                />
              }
            />

            <SwapButton
              sourceCurrency={sourceCurrency}
              targetCurrency={targetCurrency}
              rotationCount={rotationCount}
              onSwap={handleSwap}
            />

            <CurrencyCard
              roleLabel="Você recebe"
              currency={targetCurrency}
              value={formattedOutput}
              readOnly
              isLoading={isLoading && !rates}
              copyValue={formattedOutput}
              footerSlot={
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />
                    <span>Cálculo oficial sem ágio</span>
                  </span>

                  {effectiveRateBadge && (
                    <span className="rounded border border-white/[0.06] bg-slate-800/80 px-2 py-0.5 font-sans text-xs font-medium text-slate-300 tabular-nums">
                      {effectiveRateBadge}
                    </span>
                  )}
                </div>
              }
            />
          </section>

          <RateStatus
            rates={rates}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            isOfflineFallback={isOfflineFallback}
            lastUpdated={lastUpdated}
            onRefresh={() => void refresh()}
          />
        </div>
      </main>

      <footer className="relative z-10 mt-auto w-full border-t border-white/[0.06] bg-[#080c14]/90 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 sm:justify-start sm:gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck
                className="h-4 w-4 text-emerald-400"
                aria-hidden="true"
              />
              <span>AwesomeAPI</span>
            </div>
            <span className="text-slate-700" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">
              {lastUpdated
                ? `Atualizado às ${formatTimestamp(lastUpdated)}`
                : "Atualizado em tempo real"}
            </span>
          </div>

          <a
            href="https://github.com/xampsdev"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded text-xs text-slate-400 transition-colors hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <svg
              className="h-3.5 w-3.5 fill-current"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82A7.66 7.66 0 018 4.6c.68.01 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span>GitHub Xan</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
