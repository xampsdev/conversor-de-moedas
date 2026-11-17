import { ArrowUpDown } from "lucide-react";
import type { CurrencyCode } from "../types/currency";

interface SwapButtonProps {
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  rotationCount: number;
  onSwap: () => void;
}

export function SwapButton({
  sourceCurrency,
  targetCurrency,
  rotationCount,
  onSwap,
}: SwapButtonProps) {
  return (
    <div className="relative z-10 -my-3 flex w-full items-center justify-center sm:-my-4">
      <button
        type="button"
        onClick={onSwap}
        aria-label={`Inverter conversão de ${sourceCurrency} para ${targetCurrency}`}
        title="Inverter moedas (BRL ⇄ USD)"
        className="group relative inline-flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-400/40 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 hover:from-blue-400 hover:to-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 sm:h-12 sm:w-12"
      >
        <ArrowUpDown
          strokeWidth={2}
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none sm:h-5 sm:w-5"
          style={{ transform: `rotate(${rotationCount * 180}deg)` }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
