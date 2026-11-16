import type {
  AwesomeApiDailyEntry,
  AwesomeApiResponse,
  DailyRatePoint,
  ExchangeRates,
} from "../types/currency";

const AWESOME_API_LAST_URL =
  "https://economia.awesomeapi.com.br/last/USD-BRL,BRL-USD";
const AWESOME_API_DAILY_URL =
  "https://economia.awesomeapi.com.br/json/daily/USD-BRL/7";

const DEFAULT_TIMEOUT_MS = 8000;

export class AwesomeApiError extends Error {
  public readonly code: "TIMEOUT" | "HTTP" | "NETWORK" | "INVALID_PAYLOAD";

  constructor(
    message: string,
    code: "TIMEOUT" | "HTTP" | "NETWORK" | "INVALID_PAYLOAD",
  ) {
    super(message);
    this.name = "AwesomeApiError";
    this.code = code;
  }
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AwesomeApiError(
        `AwesomeAPI retornou status ${response.status}.`,
        "HTTP",
      );
    }

    return response;
  } catch (error) {
    if (error instanceof AwesomeApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AwesomeApiError(
        "Tempo limite excedido ao consultar a AwesomeAPI.",
        "TIMEOUT",
      );
    }
    throw new AwesomeApiError(
      "Não foi possível conectar à AwesomeAPI. Verifique sua conexão.",
      "NETWORK",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchExchangeRates(
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ExchangeRates> {
  const response = await fetchWithTimeout(AWESOME_API_LAST_URL, timeoutMs);
  const data = (await response.json()) as Partial<AwesomeApiResponse>;

  const usdBrlBid = Number.parseFloat(data.USDBRL?.bid ?? "");
  const brlUsdBid = Number.parseFloat(data.BRLUSD?.bid ?? "");

  if (
    !Number.isFinite(usdBrlBid) ||
    usdBrlBid <= 0 ||
    !Number.isFinite(brlUsdBid) ||
    brlUsdBid <= 0
  ) {
    throw new AwesomeApiError(
      "Resposta inválida recebida da AwesomeAPI.",
      "INVALID_PAYLOAD",
    );
  }

  const pctChangeUsdBrl = Number.parseFloat(data.USDBRL?.pctChange ?? "0");
  const highUsdBrl = Number.parseFloat(data.USDBRL?.high ?? "");
  const lowUsdBrl = Number.parseFloat(data.USDBRL?.low ?? "");

  return {
    USDBRL: usdBrlBid,
    BRLUSD: brlUsdBid,
    pctChangeUsdBrl: Number.isFinite(pctChangeUsdBrl) ? pctChangeUsdBrl : 0,
    highUsdBrl: Number.isFinite(highUsdBrl) ? highUsdBrl : usdBrlBid,
    lowUsdBrl: Number.isFinite(lowUsdBrl) ? lowUsdBrl : usdBrlBid,
    updatedAt: Date.now(),
    source: "live",
  };
}

export async function fetchDailyUsdBrlHistory(
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<DailyRatePoint[]> {
  const response = await fetchWithTimeout(AWESOME_API_DAILY_URL, timeoutMs);
  const raw = (await response.json()) as unknown;

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new AwesomeApiError(
      "Histórico diário indisponível.",
      "INVALID_PAYLOAD",
    );
  }

  const points: DailyRatePoint[] = [];
  for (const entry of raw as AwesomeApiDailyEntry[]) {
    const bid = Number.parseFloat(entry.bid);
    const tsSeconds = Number.parseFloat(entry.timestamp);
    if (!Number.isFinite(bid) || bid <= 0 || !Number.isFinite(tsSeconds)) {
      continue;
    }
    const date = new Date(tsSeconds * 1000);
    const dateLabel = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    points.push({
      timestamp: tsSeconds * 1000,
      dateLabel,
      bid,
    });
  }

  return points.sort((a, b) => a.timestamp - b.timestamp);
}
