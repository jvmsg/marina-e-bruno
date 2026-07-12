import { StorageImage } from "@/components/ui/StorageImage";
import { WeddingButton } from "@/components/wedding/wedding-button";
import type { weddingContent } from "@/lib/content";

type LocationData =
  (typeof weddingContent.locations)[keyof typeof weddingContent.locations];

type LocationCardProps = {
  location: LocationData;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-muted p-4 sm:p-5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <StorageImage
          path={location.image}
          alt={location.name}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {location.title}
        </p>
        <p className="mt-1 text-lg text-foreground">{location.name}</p>
        <p className="text-foreground/80">{location.address}</p>
      </div>

      <WeddingButton
        variant="outline"
        size="default"
        className="w-full sm:w-auto"
        render={
          <a href={location.mapUrl} target="_blank" rel="noopener noreferrer" />
        }
      >
        Ver no mapa
      </WeddingButton>

      {location.schedule.length > 0 && (
        <ol className="space-y-3 pt-1">
          {location.schedule.map((item) => (
            <li
              key={`${item.time}-${item.title}`}
              className="rounded-xl border border-border bg-background/60 p-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
                <span className="font-serif text-lg text-accent sm:min-w-14 sm:text-xl">
                  {item.time}
                </span>
                <div>
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
