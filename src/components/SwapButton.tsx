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
    <div className="relative z-20 -my-3 flex h-6 w-full items-center justify-center">
      <button
        type="button"
        onClick={onSwap}
        aria-label={`Inverter conversão de ${sourceCurrency} para ${targetCurrency}`}
        title="Inverter moedas (BRL ⇄ USD)"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/40 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 hover:from-blue-400 hover:to-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40"
      >
        <ArrowUpDown
          className="h-5 w-5 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `rotate(${rotationCount * 180}deg)` }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
