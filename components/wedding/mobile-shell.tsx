import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-5 sm:pb-12 sm:pt-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
