"use client";

import { motion } from "motion/react";
import type { GiftItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StorageImage } from "@/components/ui/StorageImage";
import { WeddingButton } from "@/components/wedding/wedding-button";

interface GiftCardProps {
  item: GiftItem;
  loading: boolean;
  onCheckout: (item: GiftItem) => void;
}

export function GiftCard({ item, loading, onCheckout }: GiftCardProps) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <Card className="overflow-hidden rounded-[24px] py-0 shadow-sm">
        {item.image_path && (
          <div className="relative h-44 w-full">
            <StorageImage path={item.image_path} alt={item.name} fill />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="font-serif text-xl leading-tight text-foreground sm:text-2xl">
              {item.name}
            </CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap text-accent">
              {formatCurrency(item.price_cents)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </CardContent>

        <CardFooter className="pb-5">
          <WeddingButton
            type="button"
            onClick={() => onCheckout(item)}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Redirecionando..." : "Presentear"}
          </WeddingButton>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
