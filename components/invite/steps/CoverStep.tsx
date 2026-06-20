import { weddingContent } from "@/lib/content";
import { StorageImage } from "@/components/ui/StorageImage";

export function CoverStep() {
  return (
    <div className="flex h-full flex-col items-center text-center">
      <div className="relative mb-6 h-52 w-full overflow-hidden rounded-2xl sm:h-64">
        <StorageImage
          path={weddingContent.photos.hero}
          alt="Foto do casal"
          fill
          priority
        />
      </div>
      <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[color:var(--accent-women)]">
        Você está convidado
      </p>
      <h1 className="font-serif text-4xl text-[color:var(--accent-men)] sm:text-5xl">
        {weddingContent.couple.fullNames}
      </h1>
      <p className="mt-4 text-lg text-[color:var(--accent-men)]/80">
        {weddingContent.date.weekday}, {weddingContent.date.display}
      </p>
      <p className="mt-2 text-sm text-[color:var(--accent-men)]/70">
        {weddingContent.venue.name}
      </p>
    </div>
  );
}
