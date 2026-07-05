import { Suspense } from "react";
import { GiftSuccessClient } from "@/components/gifts/gift-success-client";

export default function GiftSuccessPage() {
  return (
    <Suspense fallback={null}>
      <GiftSuccessClient />
    </Suspense>
  );
}
