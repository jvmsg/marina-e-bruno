import { weddingContent } from "@/lib/content";

export function ScheduleStep() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Programação
        </p>
        <h2 className="font-serif text-3xl text-[color:var(--accent-men)]">
          Como será o dia
        </h2>
      </div>

      <ol className="space-y-4">
        {weddingContent.schedule.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-[color:var(--bg-taupe)] bg-[color:var(--bg-sand)] p-4"
          >
            <div className="flex items-start gap-4">
              <span className="min-w-14 font-serif text-xl text-[color:var(--accent-women)]">
                {item.time}
              </span>
              <div>
                <h3 className="font-medium text-[color:var(--accent-men)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--accent-men)]/75">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
