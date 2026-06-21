import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WeddingButton({
  className,
  variant = "default",
  size = "lg",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "touch-target min-h-11 rounded-full px-5 text-base sm:min-h-9 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}
