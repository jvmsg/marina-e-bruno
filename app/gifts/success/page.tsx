import { weddingContent } from "@/lib/content";
import { GiftStatusPage } from "@/components/gifts/gift-status-page";

export default function GiftSuccessPage() {
  return (
    <GiftStatusPage
      eyebrow="Obrigado"
      title="Presente confirmado"
      description={`Recebemos seu presente com muito carinho. Mal podemos esperar para celebrar com você, ${weddingContent.couple.fullNames}.`}
      actions={[
        {
          href: "/",
          label: "Voltar ao convite",
        },
      ]}
    />
  );
}
