import { GiftStatusPage } from "@/components/gifts/gift-status-page";

export default function GiftCancelPage() {
  return (
    <GiftStatusPage
      eyebrow="Pagamento cancelado"
      title="Tudo bem"
      description="O pagamento foi cancelado. Você pode voltar e escolher um presente quando quiser."
      actions={[
        {
          href: "/gifts",
          label: "Ver presentes",
        },
        {
          href: "/",
          label: "Voltar ao convite",
          variant: "outline",
        },
      ]}
    />
  );
}
