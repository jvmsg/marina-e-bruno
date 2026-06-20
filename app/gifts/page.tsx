import Link from "next/link";
import { weddingContent } from "@/lib/content";
import { createServiceClient } from "@/lib/supabase/server";
import type { GiftItem } from "@/lib/types";
import { GiftCatalog } from "@/components/gifts/GiftCatalog";

async function getGiftItems(): Promise<GiftItem[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("gift_items")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    return (data ?? []) as GiftItem[];
  } catch {
    return [];
  }
}

export default async function GiftsPage() {
  const items = await getGiftItems();

  return (
    <main className="min-h-screen bg-[color:var(--bg-sand)] px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-[color:var(--accent-men)] underline-offset-4 hover:underline"
        >
          Voltar ao convite
        </Link>

        <div className="mt-6 rounded-[28px] border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] p-6 shadow-[0_18px_50px_rgba(0,56,23,0.08)]">
          <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
            Com carinho
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[color:var(--accent-men)]">
            {weddingContent.messages.giftsTitle}
          </h1>
          <p className="mt-3 leading-relaxed text-[color:var(--accent-men)]/80">
            {weddingContent.messages.giftsSubtitle}
          </p>
        </div>

        <div className="mt-8">
          <GiftCatalog items={items} />
        </div>
      </div>
    </main>
  );
}
