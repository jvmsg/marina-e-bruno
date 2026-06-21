import { weddingContent } from "@/lib/content";
import { InviteHeading } from "@/components/wedding/invite-heading";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/motion/stagger-children";

export function ScheduleStep() {
  return (
    <StaggerChildren stepKey="schedule" className="flex invite-page-height flex-col gap-6">
      <StaggerItem>
        <InviteHeading eyebrow="Programação" title="Como será o dia" />
      </StaggerItem>

      <ol className="space-y-4">
        {weddingContent.schedule.map((item) => (
          <StaggerItem key={item.title}>
            <li className="rounded-2xl border border-border bg-muted p-4">
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
          </StaggerItem>
        ))}
      </ol>
    </StaggerChildren>
  );
}
