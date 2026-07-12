import { dress, tuxedo } from "@lucide/lab";
import { Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function DressIcon({ className }: IconProps) {
  return (
    <Icon
      iconNode={dress}
      aria-hidden
      className={cn("size-7", className)}
      strokeWidth={1.75}
    />
  );
}

export function SuitIcon({ className }: IconProps) {
  return (
    <Icon
      iconNode={tuxedo}
      aria-hidden
      className={cn("size-7", className)}
      strokeWidth={1.75}
    />
  );
}
