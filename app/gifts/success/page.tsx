import Link from "next/link";
import { weddingContent } from "@/lib/content";

export default function GiftSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--bg-sand)] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-[color:var(--bg-taupe)] bg-[color:var(--bg-cream)] p-8 text-center shadow-[0_18px_50px_rgba(0,56,23,0.08)]">
        <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--accent-women)]">
          Obrigado
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[color:var(--accent-men)]">
          Presente confirmado
        </h1>
        <p className="mt-4 leading-relaxed text-[color:var(--accent-men)]/80">
          Recebemos seu presente com muito carinho. Mal podemos esperar para
          celebrar com você, {weddingContent.couple.fullNames}.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[color:var(--accent-men)] px-6 py-3 text-sm font-medium text-[color:var(--bg-cream)]"
        >
          Voltar ao convite
        </Link>
      </div>
    </main>
  );
}
