import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import type { GiftItem } from "@/lib/types";
import { GiftCatalog } from "@/components/gifts/GiftCatalog";
import { GiftsIntro } from "@/components/gifts/gifts-intro";

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
    <main className="min-h-dvh bg-background px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-10">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Voltar ao convite
        </Link>

        <div className="mt-6">
          <GiftsIntro />
        </div>

        <div className="mt-8">
          <GiftCatalog items={items} />
        </div>
      </div>
    </main>
  );
}
