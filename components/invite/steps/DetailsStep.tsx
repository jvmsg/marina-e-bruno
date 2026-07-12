import { weddingContent } from "@/lib/content";
import { LocationCard } from "@/components/invite/location-card";
import { InviteHeading } from "@/components/wedding/invite-heading";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

export function DetailsStep() {
  return (
    <StaggerChildren
      stepKey="details"
      className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto px-5 py-4"
    >
      <StaggerItem>
        <InviteHeading eyebrow="Detalhes do evento" title="O grande dia" />
      </StaggerItem>

      <StaggerItem>
        <p className="text-center text-lg text-foreground">
          {weddingContent.date.weekday}, {weddingContent.date.display}
        </p>
      </StaggerItem>

      <StaggerItem>
        <LocationCard location={weddingContent.locations.ceremony} />
      </StaggerItem>

      <StaggerItem>
        <LocationCard location={weddingContent.locations.party} />
      </StaggerItem>

      <StaggerItem>
        <div className="rounded-2xl bg-muted p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Dress code
          </p>
          <p className="mt-1 text-foreground">{weddingContent.dressCode}</p>
        </div>
      </StaggerItem>
    </StaggerChildren>
  );
}
