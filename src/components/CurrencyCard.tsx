import { useId, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import type { CurrencyCode } from "../types/currency";
import { CURRENCY_META } from "../utils/formatters";

interface CurrencyCardProps {
  roleLabel: string;
  currency: CurrencyCode;
  value: string;
  readOnly?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  errorId?: string;
  onChange?: (value: string) => void;
  copyValue?: string;
  footerSlot?: ReactNode;
}

function CurrencyBadge({ currency }: { currency: CurrencyCode }) {
  const shortCountry = currency === "BRL" ? "BR" : "US";

  return (
    <div className="flex shrink-0 select-none items-center gap-2 rounded-full border border-white/10 bg-slate-800/90 px-3 py-1.5 shadow-sm">
      <span className="font-sans text-xs font-medium tracking-wide text-slate-300">
        {shortCountry}
      </span>
      <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">
        {currency}
      </span>
    </div>
  );
}

export function CurrencyCard({
  roleLabel,
  currency,
  value,
  readOnly = false,
  isLoading = false,
  hasError = false,
  errorId,
  onChange,
  copyValue,
  footerSlot,
}: CurrencyCardProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const meta = CURRENCY_META[currency];
  const displaySymbol = currency === "BRL" ? "R$" : "$";

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(`${displaySymbol} ${copyValue}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <div
      onClick={() => {
        if (!readOnly) {
          inputRef.current?.focus();
        }
      }}
      className={`relative flex flex-col gap-3 rounded-2xl border bg-slate-950/60 p-4 transition-all duration-200 sm:p-6 ${
        hasError
          ? "border-rose-500/60 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-500/15"
          : readOnly
            ? "border-white/[0.06]"
            : "cursor-text border-white/[0.06] focus-within:border-blue-500/50 focus-within:bg-slate-950/80 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {roleLabel}
        </label>

        <CurrencyBadge currency={currency} />
      </div>

      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <span
          className="shrink-0 select-none font-mono text-lg font-medium text-slate-400 sm:text-xl"
          aria-hidden="true"
        >
          {displaySymbol}
        </span>

        <div className="min-w-0 flex-1 text-right">
          {isLoading && readOnly ? (
            <div
              className="ml-auto h-9 w-36 animate-pulse rounded-xl bg-slate-800/80 sm:h-10 sm:w-44"
              aria-label="Carregando cotação"
            />
          ) : readOnly ? (
            <output
              id={inputId}
              aria-label={`${roleLabel} em ${meta.name}`}
              className="block w-full truncate font-mono text-2xl font-bold tracking-tight text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.3)] tabular-nums sm:text-3xl md:text-4xl"
            >
              {value || meta.placeholder}
            </output>
          ) : (
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              value={value}
              placeholder={meta.placeholder}
              onChange={(e) => onChange?.(e.target.value)}
              aria-label={`${roleLabel} em ${meta.name}`}
              aria-invalid={hasError ? "true" : undefined}
              aria-describedby={hasError && errorId ? errorId : undefined}
              className="w-full min-w-0 border-0 bg-transparent p-0 text-right font-mono text-2xl font-bold tracking-tight text-white tabular-nums placeholder:text-slate-600 focus:outline-none focus:ring-0 sm:text-3xl md:text-4xl"
            />
          )}
        </div>

        {readOnly && copyValue && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copiar valor convertido em ${meta.name}`}
            title="Copiar valor convertido"
            className={`relative flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:min-h-[36px] sm:px-3 sm:py-1.5 ${
              copied
                ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-400"
                : "border-white/10 bg-slate-800/80 text-slate-300 hover:border-white/20 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>
        )}
      </div>

      {footerSlot && <div>{footerSlot}</div>}
    </div>
  );
}
