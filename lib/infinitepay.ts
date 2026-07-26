export interface InfinitePayConfig {
  handle: string;
  siteUrl: string;
}

export interface InfinitePayCheckoutItem {
  quantity: number;
  price: number;
  description: string;
}

export interface InfinitePayWebhookPayload {
  invoice_slug?: string;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: string;
  transaction_nsu?: string;
  order_nsu?: string;
  receipt_url?: string;
  items?: InfinitePayCheckoutItem[];
}

export interface InfinitePayPaymentCheckResult {
  success: boolean;
  paid: boolean;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: string;
}

const LINKS_URL = "https://api.checkout.infinitepay.io/links";
const PAYMENT_CHECK_URL = "https://api.checkout.infinitepay.io/payment_check";

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/$/, "");
}

export function resolveSiteUrl(request?: Request): string {
  const origin = request?.headers.get("origin")?.trim();
  if (origin) {
    return normalizeSiteUrl(origin);
  }

  const forwardedHost = request?.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request?.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const host = forwardedHost || request?.headers.get("host")?.trim();

  if (host) {
    const proto =
      forwardedProto ||
      (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
    return normalizeSiteUrl(`${proto}://${host}`);
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return normalizeSiteUrl(envUrl);
  }

  return "http://localhost:3000";
}

export function getInfinitePayConfig(request?: Request): InfinitePayConfig {
  const handle = process.env.INFINITEPAY_HANDLE?.trim().replace(/^\$/, "");
  const siteUrl = resolveSiteUrl(request);

  if (!handle) {
    throw new Error(
      "InfinitePay não configurado. Defina INFINITEPAY_HANDLE.",
    );
  }

  return { handle, siteUrl };
}

export function mapCaptureMethod(
  captureMethod: string | undefined | null,
): "card" | "pix" | null {
  if (captureMethod === "credit_card") {
    return "card";
  }

  if (captureMethod === "pix") {
    return "pix";
  }

  return null;
}

export async function createCheckoutLink(options: {
  orderNsu: string;
  items: InfinitePayCheckoutItem[];
  request?: Request;
  config?: InfinitePayConfig;
}): Promise<string> {
  const config = options.config ?? getInfinitePayConfig(options.request);

  // Webhook must be publicly reachable. Prefer NEXT_PUBLIC_SITE_URL when set to a
  // non-localhost URL; otherwise fall back to the same origin used for redirect.
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const webhookBase =
    envSiteUrl && !/localhost|127\.0\.0\.1/i.test(envSiteUrl)
      ? normalizeSiteUrl(envSiteUrl)
      : config.siteUrl;

  const response = await fetch(LINKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: config.handle,
      order_nsu: options.orderNsu,
      redirect_url: `${config.siteUrl}/gifts/success`,
      webhook_url: `${webhookBase}/api/infinitepay/webhook`,
      items: options.items,
    }),
  });

  const data = (await response.json()) as { url?: string; message?: string };

  if (!response.ok || !data.url) {
    throw new Error(
      data.message ?? "Não foi possível criar o link de pagamento.",
    );
  }

  return data.url;
}

export async function checkPayment(options: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
  config?: InfinitePayConfig;
}): Promise<InfinitePayPaymentCheckResult> {
  const config = options.config ?? getInfinitePayConfig();

  const response = await fetch(PAYMENT_CHECK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: config.handle,
      order_nsu: options.orderNsu,
      transaction_nsu: options.transactionNsu,
      slug: options.slug,
    }),
  });

  const data = (await response.json()) as InfinitePayPaymentCheckResult;

  if (!response.ok) {
    throw new Error("Não foi possível verificar o pagamento.");
  }

  return data;
}
