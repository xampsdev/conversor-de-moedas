import { useId } from "react";
import type { CurrencyCode } from "../types/currency";

interface CurrencyFlagProps {
  currency: CurrencyCode;
  className?: string;
}

export function CurrencyFlag({
  currency,
  className = "w-6 h-6 sm:w-7 sm:h-7",
}: CurrencyFlagProps) {
  const clipId = useId();

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 object-cover ${className}`}
    >
      {currency === "BRL" ? (
        <svg
          viewBox="0 0 32 32"
          className="h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <defs>
            <clipPath id={clipId}>
              <circle cx="16" cy="16" r="6.3" />
            </clipPath>
          </defs>
          <rect width="32" height="32" fill="#009B3A" />
          <polygon points="16,4.2 28.8,16 16,27.8 3.2,16" fill="#FFDF00" />
          <circle cx="16" cy="16" r="6.3" fill="#002776" />
          <path
            d="M9.2 14.4 Q16 12.1 22.9 17.7"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.65"
            clipPath={`url(#${clipId})`}
          />
          <g fill="#FFFFFF" clipPath={`url(#${clipId})`}>
            <circle cx="13.4" cy="17.8" r="0.55" />
            <circle cx="15.8" cy="19.1" r="0.6" />
            <circle cx="18.1" cy="18.2" r="0.55" />
            <circle cx="16.2" cy="16.9" r="0.45" />
          </g>
        </svg>
      ) : (
        <svg
          viewBox="0 0 32 32"
          className="h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <rect width="32" height="32" fill="#FFFFFF" />
          <g fill="#B22234">
            <rect y="0" width="32" height="2.46" />
            <rect y="4.92" width="32" height="2.46" />
            <rect y="9.85" width="32" height="2.46" />
            <rect y="14.77" width="32" height="2.46" />
            <rect y="19.69" width="32" height="2.46" />
            <rect y="24.62" width="32" height="2.46" />
            <rect y="29.54" width="32" height="2.46" />
          </g>
          <rect width="17" height="17.23" fill="#3C3B6E" />
          <g fill="#FFFFFF">
            <circle cx="6.8" cy="5.0" r="0.8" />
            <circle cx="10.2" cy="5.0" r="0.8" />
            <circle cx="13.6" cy="5.0" r="0.8" />
            <circle cx="5.1" cy="8.0" r="0.8" />
            <circle cx="8.5" cy="8.0" r="0.8" />
            <circle cx="11.9" cy="8.0" r="0.8" />
            <circle cx="15.1" cy="8.0" r="0.8" />
            <circle cx="3.4" cy="11.0" r="0.8" />
            <circle cx="6.8" cy="11.0" r="0.8" />
            <circle cx="10.2" cy="11.0" r="0.8" />
            <circle cx="13.6" cy="11.0" r="0.8" />
            <circle cx="5.1" cy="14.0" r="0.8" />
            <circle cx="8.5" cy="14.0" r="0.8" />
            <circle cx="11.9" cy="14.0" r="0.8" />
            <circle cx="15.1" cy="14.0" r="0.8" />
          </g>
        </svg>
      )}
    </span>
  );
}
