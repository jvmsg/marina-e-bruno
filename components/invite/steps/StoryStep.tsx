import { weddingContent } from "@/lib/content";
import { StorageImage } from "@/components/ui/StorageImage";
import { InviteHeading } from "@/components/wedding/invite-heading";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

export function StoryStep() {
  return (
    <StaggerChildren stepKey="story" className="flex invite-page-height flex-col gap-5">
      <StaggerItem>
        <InviteHeading
          eyebrow="Capítulo especial"
          title={weddingContent.story.title}
        />
      </StaggerItem>

      {weddingContent.story.paragraphs.map((paragraph) => (
        <StaggerItem key={paragraph}>
          <p className="leading-relaxed text-foreground/85">{paragraph}</p>
        </StaggerItem>
      ))}

      <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
        {weddingContent.photos.gallery.map((photo, index) => (
          <StaggerItem key={photo}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <StorageImage path={photo} alt={`Foto ${index + 1}`} fill />
            </div>
          </StaggerItem>
        ))}
      </div>
    </StaggerChildren>
  );
}
