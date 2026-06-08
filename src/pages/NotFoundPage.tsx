import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-xl rounded-lg border border-ink/10 bg-white/82 p-8 text-center shadow-archival">
        <p className="text-sm font-semibold uppercase text-madder">Page not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Village branch unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          The village slug does not match a branch in the static family-tree data.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-cedar px-4 py-3 text-sm font-semibold text-white transition hover:bg-cedar/90 focus:outline-none focus:ring-2 focus:ring-cedar focus:ring-offset-2 focus:ring-offset-paper"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span>Back to villages</span>
        </Link>
      </section>
    </main>
  );
}
