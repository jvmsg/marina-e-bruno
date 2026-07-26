import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkPayment, mapCaptureMethod } from "@/lib/infinitepay";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderNsu?: string;
      transactionNsu?: string;
      slug?: string;
      captureMethod?: string;
      receiptUrl?: string;
    };

    const orderNsu = body.orderNsu?.trim();
    const transactionNsu = body.transactionNsu?.trim();
    const slug = body.slug?.trim();

    if (!orderNsu || !transactionNsu || !slug) {
      return NextResponse.json(
        { error: "Dados de pagamento incompletos." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    const { data: order, error } = await supabase
      .from("gift_orders")
      .select("id, amount_cents, status, receipt_url")
      .eq("id", orderNsu)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado." },
        { status: 404 },
      );
    }

    if (order.status === "paid") {
      return NextResponse.json({
        paid: true,
        receiptUrl: order.receipt_url,
      });
    }

    const check = await checkPayment({
      orderNsu,
      transactionNsu,
      slug,
    });

    if (!check.success || !check.paid) {
      return NextResponse.json({
        paid: false,
        receiptUrl: null,
      });
    }

    const paymentMethod =
      mapCaptureMethod(body.captureMethod) ??
      mapCaptureMethod(check.capture_method);

    const receiptUrl = body.receiptUrl?.trim() || null;

    const { error: updateError } = await supabase
      .from("gift_orders")
      .update({
        status: "paid",
        payment_method: paymentMethod,
        provider_reference: slug,
        transaction_nsu: transactionNsu,
        receipt_url: receiptUrl,
      })
      .eq("id", orderNsu);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      paid: true,
      receiptUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
