import { ChevronRight, MapPin, Search, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchPeople, enrichSearchResults, fetchVillages, type SearchResult } from "../lib/queries";
import type { Village } from "../lib/database.types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [villageFilter, setVillageFilter] = useState("");

  useEffect(() => {
    fetchVillages().then(setVillages).catch(console.error);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const raw = await searchPeople(q);
      const enriched = await enrichSearchResults(raw);
      setResults(enriched);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
    doSearch(query);
  };

  const filteredResults = useMemo(() => {
    if (!villageFilter) return results;
    return results.filter((r) => r.village_id === villageFilter);
  }, [results, villageFilter]);

  return (
    <main className="min-h-screen bg-paper pb-12">
      <div className="bg-hero-gradient py-12 px-6 border-b border-cedar/15 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.5'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="max-w-3xl mx-auto relative animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-cedar/10 px-3 py-1 text-[10px] font-semibold text-cedar tracking-widest uppercase mb-4 border border-cedar/20">
            <Sparkles size={12} />
            Archive Search
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gold-gradient">Search Family Tree</h1>
          
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, urdu name, or hindi name..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 glass-dark text-white/90 placeholder-white/40 shadow-sm focus:ring-2 focus:ring-cedar/30 focus:border-cedar outline-none transition-all"
              />
            </div>
            <button type="submit" disabled={loading} className="px-8 py-3.5 bg-gold-gradient text-onyx font-bold rounded-xl hover:shadow-glow-gold transition-all shadow-sm disabled:opacity-50">
              Search
            </button>
          </form>
          
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setVillageFilter("")} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${villageFilter === "" ? "bg-cedar/90 text-onyx shadow-sm shadow-cedar/20" : "glass-dark border border-white/10 text-white/60 hover:bg-white/10"}`}>All Villages</button>
            {villages.map(v => (
              <button key={v.id} onClick={() => setVillageFilter(v.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${villageFilter === v.id ? "bg-cedar/90 text-onyx shadow-sm shadow-cedar/20" : "glass-dark border border-white/10 text-white/60 hover:bg-white/10"}`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6 animate-fade-in-up-delay-1">
        {loading ? (
          <div className="py-12 text-center text-ink/50 font-medium">Searching the archives...</div>
        ) : searched && filteredResults.length === 0 ? (
          <div className="py-12 text-center text-ink/50 font-medium">No records found matching your search.</div>
        ) : (
          <div className="space-y-4 stagger-children">
            {filteredResults.map(person => {
              const v = villages.find(vi => vi.id === person.village_id);
              return (
                v ? (
                  <Link 
                    to={`/village/${v.slug}?view=lineage&select=${person.id}`}
                    key={person.id} 
                    className="bg-white p-5 rounded-xl border border-ink/8 shadow-sm flex items-center justify-between hover:border-cedar/40 hover:shadow-card-hover transition-all duration-300 group block w-full text-left hover-lift"
                  >
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2 group-hover:text-cedar transition">
                        {person.name}
                        {person.urdu_name && <span className="text-emerald font-medium" lang="ur" dir="rtl">{person.urdu_name}</span>}
                      </h3>
                      <div className="mt-1 text-sm text-ink/50 flex items-center gap-3">
                        {person.father_name && <span>s/o <span className="font-medium text-ink/70">{person.father_name}</span></span>}
                        <span className="flex items-center gap-1 text-cedar/70"><MapPin size={14}/> {person.village_name}</span>
                      </div>
                    </div>
                    <div className="p-2 text-cedar/30 group-hover:text-cedar transition-all rounded-full group-hover:bg-cedar/10 group-hover:translate-x-1">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                ) : (
                  <div key={person.id} className="bg-white p-5 rounded-xl border border-ink/8 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
                        {person.name}
                        {person.urdu_name && <span className="text-emerald font-medium" lang="ur" dir="rtl">{person.urdu_name}</span>}
                      </h3>
                      <div className="mt-1 text-sm text-ink/50 flex items-center gap-3">
                        {person.father_name && <span>s/o {person.father_name}</span>}
                        <span className="flex items-center gap-1 text-cedar/70"><MapPin size={14}/> {person.village_name}</span>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
