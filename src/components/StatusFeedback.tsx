import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";

interface StatusFeedbackProps {
  validationError: string | null;
  validationErrorId: string;
  apiError: string | null;
  isOfflineFallback: boolean;
  isRetrying: boolean;
  onRetry: () => void;
}

export function StatusFeedback({
  validationError,
  validationErrorId,
  apiError,
  isOfflineFallback,
  isRetrying,
  onRetry,
}: StatusFeedbackProps) {
  if (!validationError && !apiError) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5" aria-live="polite">
      {validationError && (
        <div
          id={validationErrorId}
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/35 px-3.5 py-2.5 text-xs font-medium text-rose-200 shadow-sm"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {apiError && (
        <div
          role="alert"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs shadow-sm ${
            isOfflineFallback
              ? "border-amber-500/35 bg-slate-800/80 text-amber-200"
              : "border-rose-500/40 bg-rose-950/35 text-rose-200"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {isOfflineFallback ? (
              <WifiOff
                className="h-4 w-4 shrink-0 text-amber-400"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="h-4 w-4 shrink-0 text-rose-400"
                aria-hidden="true"
              />
            )}
            <span className="leading-snug">{apiError}</span>
          </div>

          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>Tentar novamente</span>
          </button>
        </div>
      )}
    </div>
  );
}
