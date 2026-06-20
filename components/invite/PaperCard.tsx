import { cn } from "@/lib/utils";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PaperCard({ children, className }: PaperCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] p-6 shadow-[0_18px_50px_rgba(0,56,23,0.08)] sm:p-8",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_55%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
