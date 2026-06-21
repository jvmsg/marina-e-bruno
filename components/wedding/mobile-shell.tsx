import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}

export function MobileShell({
  children,
  className,
  fullScreen = false,
}: MobileShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col",
        fullScreen
          ? "h-dvh max-h-dvh overflow-hidden px-0 pt-0 pb-0 sm:min-h-dvh sm:h-auto sm:max-h-none sm:overflow-visible sm:px-5 sm:pb-12 sm:pt-12"
          : "min-h-dvh px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-5 sm:pb-12 sm:pt-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
