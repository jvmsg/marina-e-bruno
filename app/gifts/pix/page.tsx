import { Suspense } from "react";
import { GiftPixClient } from "@/components/gifts/gift-pix-client";

export default function GiftPixPage() {
  return (
    <Suspense fallback={null}>
      <GiftPixClient />
    </Suspense>
  );
}
