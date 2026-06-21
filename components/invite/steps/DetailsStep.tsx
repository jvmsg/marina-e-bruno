import { weddingContent } from "@/lib/content";
import { InviteHeading } from "@/components/wedding/invite-heading";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

export function DetailsStep() {
  return (
    <StaggerChildren stepKey="details" className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto px-5 py-4">
      <StaggerItem>
        <InviteHeading eyebrow="Detalhes do evento" title="O grande dia" />
      </StaggerItem>

      <StaggerItem>
        <div className="space-y-4 rounded-2xl bg-muted p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Data e horário
            </p>
            <p className="mt-1 text-lg text-foreground">
              {weddingContent.date.weekday}, {weddingContent.date.display}
            </p>
            <p className="text-foreground/80">
              Cerimônia às {weddingContent.date.time}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Local
            </p>
            <p className="mt-1 text-lg text-foreground">
              {weddingContent.venue.name}
            </p>
            <p className="text-foreground/80">{weddingContent.venue.address}</p>
            <a
              href={weddingContent.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Ver no mapa
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Dress code
            </p>
            <p className="mt-1 text-foreground">{weddingContent.dressCode}</p>
          </div>
        </div>
      </StaggerItem>
    </StaggerChildren>
  );
}
