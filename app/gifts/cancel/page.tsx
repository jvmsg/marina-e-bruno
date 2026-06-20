import Link from "next/link";

export default function GiftCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--bg-sand)] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] p-8 text-center shadow-[0_18px_50px_rgba(0,56,23,0.08)]">
        <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Pagamento cancelado
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[color:var(--accent-men)]">
          Tudo bem
        </h1>
        <p className="mt-4 leading-relaxed text-[color:var(--accent-men)]/80">
          O pagamento foi cancelado. Você pode voltar e escolher um presente
          quando quiser.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/gifts"
            className="inline-flex justify-center rounded-full bg-[color:var(--accent-men)] px-6 py-3 text-sm font-medium text-[color:var(--bg-cream)]"
          >
            Ver presentes
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-full border border-[color:var(--bg-taupe)] px-6 py-3 text-sm font-medium text-[color:var(--accent-men)]"
          >
            Voltar ao convite
          </Link>
        </div>
      </div>
    </main>
  );
}
