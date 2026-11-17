import type { CurrencyCode } from "../types/currency";
import { CURRENCY_META } from "../utils/formatters";

const PRESET_AMOUNTS = [100, 500, 1000] as const;

interface QuickAmountsProps {
  currency: CurrencyCode;
  hasValue: boolean;
  onAddAmount: (amount: number) => void;
  onClear: () => void;
}

export function QuickAmounts({
  currency,
  hasValue,
  onAddAmount,
  onClear,
}: QuickAmountsProps) {
  const meta = CURRENCY_META[currency];

  const formatChipLabel = (amount: number): string => {
    const formattedInt = new Intl.NumberFormat(meta.locale, {
      maximumFractionDigits: 0,
    }).format(amount);
    return `+${formattedInt}`;
  };

  return (
    <div
      className="grid grid-cols-4 gap-2 pt-1"
      role="group"
      aria-label="Atalhos de valor para soma rápida"
    >
      {PRESET_AMOUNTS.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddAmount(amount);
          }}
          className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border border-white/[0.06] bg-slate-800/80 px-2 py-2 font-mono text-xs font-medium text-slate-200 tabular-nums shadow-sm transition-all duration-150 hover:border-blue-500/40 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:text-sm"
        >
          {formatChipLabel(amount)}
        </button>
      ))}

      <button
        type="button"
        disabled={!hasValue}
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-slate-800/40 px-2 py-2 font-sans text-xs font-medium text-slate-400 transition-all duration-150 hover:border-rose-500/30 hover:bg-rose-950/60 hover:text-rose-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
      >
        Limpar
      </button>
    </div>
  );
}
