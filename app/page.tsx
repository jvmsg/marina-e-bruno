import { InviteStepper } from "@/components/invite/InviteStepper";

export default function HomePage() {
  return (
    <main className="h-dvh max-h-dvh overflow-hidden bg-background sm:min-h-screen sm:h-auto sm:max-h-none sm:overflow-visible">
      <InviteStepper />
    </main>
  );
}
