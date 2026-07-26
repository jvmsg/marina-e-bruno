import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  checkPayment,
  mapCaptureMethod,
  type InfinitePayWebhookPayload,
} from "@/lib/infinitepay";

function webhookOk() {
  return NextResponse.json({ success: true, message: null });
}

function webhookError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  let payload: InfinitePayWebhookPayload;

  try {
    payload = (await request.json()) as InfinitePayWebhookPayload;
  } catch {
    return webhookError("Payload inválido.");
  }

  const orderNsu = payload.order_nsu?.trim();
  const transactionNsu = payload.transaction_nsu?.trim();
  const invoiceSlug = payload.invoice_slug?.trim();

  if (!orderNsu) {
    return webhookError("order_nsu ausente.");
  }

  try {
    const supabase = createServiceClient();

    const { data: order, error } = await supabase
      .from("gift_orders")
      .select("id, amount_cents, status")
      .eq("id", orderNsu)
      .single();

    if (error || !order) {
      return webhookError("Pedido não encontrado.");
    }

    if (order.status === "paid") {
      return webhookOk();
    }

    if (
      typeof payload.amount === "number" &&
      payload.amount > 0 &&
      payload.amount !== order.amount_cents
    ) {
      return webhookError("Valor do pagamento não confere.");
    }

    if (transactionNsu && invoiceSlug) {
      const check = await checkPayment({
        orderNsu,
        transactionNsu,
        slug: invoiceSlug,
      });

      if (!check.success || !check.paid) {
        return webhookError("Pagamento não confirmado.");
      }
    }

    const paymentMethod = mapCaptureMethod(payload.capture_method);

    const { error: updateError } = await supabase
      .from("gift_orders")
      .update({
        status: "paid",
        payment_method: paymentMethod,
        provider_reference: invoiceSlug ?? orderNsu,
        transaction_nsu: transactionNsu ?? null,
        receipt_url: payload.receipt_url?.trim() || null,
      })
      .eq("id", orderNsu);

    if (updateError) {
      return webhookError(updateError.message, 500);
    }

    return webhookOk();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar webhook.";
    return webhookError(message, 500);
  }
}
