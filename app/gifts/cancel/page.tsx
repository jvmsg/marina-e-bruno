import { GiftStatusPage } from "@/components/gifts/gift-status-page";

export default function GiftCancelPage() {
  return (
    <GiftStatusPage
      eyebrow="Pagamento cancelado"
      title="Tudo bem"
      description="O pagamento foi cancelado. Seus itens continuam no carrinho para você tentar novamente."
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
