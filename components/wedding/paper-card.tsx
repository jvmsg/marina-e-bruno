import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  sheen?: boolean;
}

export function PaperCard({
  children,
  className,
  sheen = true,
}: PaperCardProps) {
  return (
    <Card
      className={cn(
        "relative min-h-[clamp(28rem,72dvh,35rem)] overflow-hidden rounded-[28px] border-border bg-card py-0 shadow-[0_18px_50px_rgba(0,56,23,0.08)] sm:min-h-[560px]",
        sheen &&
          "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_55%)]",
        className,
      )}
    >
      <CardContent className="relative z-[2] p-5 sm:p-8">{children}</CardContent>
    </Card>
  );
}
