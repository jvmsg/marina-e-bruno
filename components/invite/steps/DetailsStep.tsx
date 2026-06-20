import { weddingContent } from "@/lib/content";

export function DetailsStep() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Detalhes do evento
        </p>
        <h2 className="font-serif text-3xl text-[color:var(--accent-men)]">
          O grande dia
        </h2>
      </div>

      <div className="space-y-4 rounded-2xl bg-[color:var(--bg-sand)] p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-men)]/60">
            Data e horário
          </p>
          <p className="mt-1 text-lg text-[color:var(--accent-men)]">
            {weddingContent.date.weekday}, {weddingContent.date.display}
          </p>
          <p className="text-[color:var(--accent-men)]/80">
            Cerimônia às {weddingContent.date.time}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-men)]/60">
            Local
          </p>
          <p className="mt-1 text-lg text-[color:var(--accent-men)]">
            {weddingContent.venue.name}
          </p>
          <p className="text-[color:var(--accent-men)]/80">
            {weddingContent.venue.address}
          </p>
          <a
            href={weddingContent.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-[color:var(--accent-women)] underline-offset-4 hover:underline"
          >
            Ver no mapa
          </a>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--accent-men)]/60">
            Dress code
          </p>
          <p className="mt-1 text-[color:var(--accent-men)]">
            {weddingContent.dressCode}
          </p>
        </div>
      </div>
    </div>
  );
}
