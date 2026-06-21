import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-2.5 rounded-full transition-all duration-300",
            index === currentStep
              ? "w-8 bg-primary"
              : index < currentStep
                ? "w-2.5 bg-accent"
                : "w-2.5 bg-border",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
