import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  sheen?: boolean;
  fullScreen?: boolean;
}

export function PaperCard({
  children,
  className,
  sheen = true,
  fullScreen = false,
}: PaperCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-card py-0",
        fullScreen
          ? "flex h-dvh min-h-0 flex-1 flex-col rounded-none border-0 shadow-none sm:h-auto sm:min-h-[560px] sm:rounded-[28px] sm:border sm:border-border sm:shadow-[0_18px_50px_rgba(0,56,23,0.08)]"
          : "min-h-[clamp(28rem,72dvh,35rem)] rounded-[28px] border-border shadow-[0_18px_50px_rgba(0,56,23,0.08)] sm:min-h-[560px]",
        sheen &&
          "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_55%)]",
        className,
      )}
    >
      <CardContent
        className={cn(
          "relative z-[2] flex min-h-0 flex-1 flex-col",
          fullScreen ? "p-0 sm:p-8" : "p-5 sm:p-8",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
