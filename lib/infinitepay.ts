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

export function getInfinitePayConfig(): InfinitePayConfig {
  const handle = process.env.INFINITEPAY_HANDLE?.trim().replace(/^\$/, "");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");

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
  config?: InfinitePayConfig;
}): Promise<string> {
  const config = options.config ?? getInfinitePayConfig();

  const response = await fetch(LINKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      handle: config.handle,
      order_nsu: options.orderNsu,
      redirect_url: `${config.siteUrl}/gifts/success`,
      webhook_url: `${config.siteUrl}/api/infinitepay/webhook`,
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
