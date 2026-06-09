import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 bg-paper relative overflow-hidden">
      {/* Decorative large text behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif font-bold text-ink/5 select-none pointer-events-none">
        404
      </div>

      <section className="w-full max-w-xl rounded-2xl border border-ink/8 bg-white/80 backdrop-blur-sm p-10 text-center shadow-archival relative z-10 animate-scale-in card-ornament">
        <div className="inline-block px-3 py-1 rounded-full bg-madder/10 text-madder text-xs font-bold tracking-widest uppercase mb-4 border border-madder/20">
          Page Not Found
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">Archive Unavailable</h1>
        <p className="mt-4 text-base leading-relaxed text-ink/60 max-w-sm mx-auto">
          The requested village branch or record could not be found in the family tree data.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-onyx transition-all hover:shadow-glow-gold hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cedar focus:ring-offset-2 focus:ring-offset-paper"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          <span>Return to Directory</span>
        </Link>
      </section>
    </main>
  );
}
