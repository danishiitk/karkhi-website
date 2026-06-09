import { Search, Sparkles, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import VillageCard from "../components/VillageCard";
import { fetchVillages } from "../lib/queries";
import { useTranslation } from "../contexts/LanguageContext";
import type { Village } from "../types";

export default function HomePage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [villages, setVillages] = useState<Village[]>([]);

  useEffect(() => {
    fetchVillages().then(setVillages).catch(console.error);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredVillages = villages.filter(v => {
    if (!normalizedQuery) return true;
    return `${v.name} ${v.urdu_name} ${v.alternate_spellings.join(" ")}`.toLowerCase().includes(normalizedQuery);
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-hero-gradient relative flex flex-col">
      {/* Geometric background pattern for the whole page */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3Cpath d='M40 10L70 40L40 70L10 40z'/%3E%3Cpath d='M40 20L60 40L40 60L20 40z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        
        {/* Floating decorative elements */}
        <div className="absolute top-12 right-[15%] w-20 h-20 rounded-full bg-cedar/5 animate-float" />
        <div className="absolute bottom-8 left-[10%] w-14 h-14 rounded-full bg-cedar/5 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-[8%] w-8 h-8 rounded-full bg-cedar/10 animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 md:px-8 lg:py-10">
          <div className="max-w-4xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-cedar/10 px-4 py-1.5 text-xs font-semibold text-cedar tracking-wider uppercase mb-4 border border-cedar/20">
              <Sparkles size={14} />
              Digital Heritage Archive
            </div>
            <h1 className="text-4xl font-serif font-bold leading-snug md:text-5xl lg:text-6xl tracking-tight text-gold-gradient whitespace-pre-line pb-2">
              {t('mainTitle')}
            </h1>
            <p className="mt-2 text-base text-white/60 leading-relaxed max-w-4xl animate-fade-in-up-delay-1">
              {t('mainSubtitle')}
            </p>
            <div className="mt-4 animate-fade-in-up-delay-2">
              <a 
                href="https://cqtcehuvtncmkkcxbdqk.supabase.co/storage/v1/object/public/documents/Qureshi%20Shajrah%20(Shaikh%20Qureshi,%20Karkhi).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-cedar/40 hover:bg-cedar/10 text-white hover:text-cedar rounded-xl font-bold transition-all group backdrop-blur-sm shadow-sm"
              >
                <BookOpen size={20} className="text-cedar group-hover:scale-110 transition-transform" />
                {t('originalShajrah')}
              </a>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mt-2 animate-fade-in-up-delay-2">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('filterVillages')}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-base text-white/90 placeholder-white/30 outline-none transition focus:border-cedar/40 focus:bg-white/10 focus:ring-4 focus:ring-cedar/10 backdrop-blur-sm"
            />
          </div>

          {/* Stats */}
          {villages.length > 0 && (
            <div className="flex items-center gap-6 mt-2 animate-fade-in-up-delay-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-bold text-cedar">{villages.length}</span>
                <span className="text-sm text-white/40">{t('totalVillages')}</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/40">Descendants of Hazrat Sheikh Hasan Baba</span>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Village Grid */}
      <section className="mx-auto max-w-6xl px-5 mt-0 md:px-8 relative z-10 flex-1 w-full pb-16">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 stagger-children">
          {filteredVillages.map(village => (
            <VillageCard key={village.id} village={village} />
          ))}
          {filteredVillages.length === 0 && (
            <div className="col-span-full py-12 text-center text-ink/50 bg-white rounded-2xl border border-ink/10 shadow-sm">
              {t('noVillagesMatch')}
            </div>
          )}
        </div>
      </section>

      {/* Footer / Credits */}
      <footer className="relative z-10 border-t border-white/10 py-6 mt-auto bg-onyx/40 backdrop-blur-sm w-full">
        <div className="mx-auto max-w-6xl px-5 md:px-8 text-center text-sm text-white/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Hazrat Sheikh Hasan Baba Family Tree</p>
          <p>
            Developed with <span className="text-madder inline-block px-1 animate-pulse">❤️</span> by <span className="font-semibold text-cedar hover:text-brass transition-colors tracking-wide">Danish Ahmad</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
