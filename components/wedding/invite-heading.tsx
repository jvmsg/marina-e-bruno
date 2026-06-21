import { cn } from "@/lib/utils";

interface InviteHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function InviteHeading({
  eyebrow,
  title,
  description,
  className,
}: InviteHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.18em] text-accent sm:text-sm sm:tracking-[0.25em]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl leading-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
