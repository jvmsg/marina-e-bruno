import { weddingContent } from "@/lib/content";
import { Separator } from "@/components/ui/separator";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

export function CoverStep() {
  return (
    <StaggerChildren
      stepKey="cover"
      className="flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto px-5 py-4 text-center"
    >
      <StaggerItem>
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-accent sm:text-sm sm:tracking-[0.35em]">
          Você está convidado
        </p>
      </StaggerItem>
      <StaggerItem>
        <h1 className="font-serif text-[clamp(1.85rem,8vw,3rem)] leading-tight text-foreground">
          {weddingContent.couple.fullNames}
        </h1>
      </StaggerItem>
      <StaggerItem className="w-full">
        <Separator className="mx-auto mt-5 w-16 bg-border" />
      </StaggerItem>
      <StaggerItem>
        <p className="mt-5 text-base text-foreground/85 sm:text-lg">
          {weddingContent.date.weekday}, {weddingContent.date.display}
        </p>
      </StaggerItem>
      <StaggerItem>
        <p className="mt-2 text-sm text-muted-foreground">
          {weddingContent.venue.name}
        </p>
      </StaggerItem>
    </StaggerChildren>
  );
}
