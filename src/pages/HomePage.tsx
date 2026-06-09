import { Search } from "lucide-react";
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
    <main className="min-h-screen bg-paper pb-16">
      <section className="bg-white border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 md:px-8 lg:py-8">
          <div className="max-w-none">
            <h1 className="text-3xl font-bold leading-tight text-ink md:text-4xl lg:text-5xl tracking-tight">
              {t('mainTitle')}
            </h1>
            <p className="mt-3 text-base text-ink/70">
              {t('mainSubtitle')}
            </p>
          </div>
          <div className="relative max-w-xl mt-2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('filterVillages')}
              className="w-full rounded-xl border border-ink/10 bg-ink/5 py-3 pl-11 pr-4 text-base outline-none transition focus:border-cedar focus:bg-white focus:ring-4 focus:ring-cedar/10"
            />
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-6xl px-5 mt-6 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredVillages.map(village => (
            <VillageCard key={village.id} village={village} />
          ))}
          {filteredVillages.length === 0 && (
            <div className="col-span-full py-12 text-center text-ink/60 bg-white rounded-2xl border border-ink/10">
              {t('noVillagesMatch')}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
