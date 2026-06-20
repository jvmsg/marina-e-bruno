import { weddingContent } from "@/lib/content";
import { StorageImage } from "@/components/ui/StorageImage";

export function StoryStep() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Capítulo especial
        </p>
        <h2 className="font-serif text-3xl text-[color:var(--accent-men)]">
          {weddingContent.story.title}
        </h2>
      </div>

      {weddingContent.story.paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-[color:var(--accent-men)]/85">
          {paragraph}
        </p>
      ))}

      <div className="mt-auto grid grid-cols-2 gap-3">
        {weddingContent.photos.gallery.map((photo, index) => (
          <div key={photo} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <StorageImage path={photo} alt={`Foto ${index + 1}`} fill />
          </div>
        ))}
      </div>
    </div>
  );
}
