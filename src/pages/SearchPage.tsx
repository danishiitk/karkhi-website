import { ChevronRight, MapPin, Search } from "lucide-react";
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
  }, []);

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
      <div className="bg-white border-b border-ink/10 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-ink">Search Family Tree</h1>
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, urdu name, or hindi name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-ink/20 shadow-sm focus:ring-2 focus:ring-cedar/20 focus:border-cedar outline-none"
              />
            </div>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-cedar text-white font-medium rounded-xl hover:bg-cedar/90 transition shadow-sm">
              Search
            </button>
          </form>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            <button onClick={() => setVillageFilter("")} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${villageFilter === "" ? "bg-ink text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"}`}>All Villages</button>
            {villages.map(v => (
              <button key={v.id} onClick={() => setVillageFilter(v.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${villageFilter === v.id ? "bg-ink text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"}`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6">
        {loading ? (
          <div className="py-12 text-center text-ink/60">Searching...</div>
        ) : searched && filteredResults.length === 0 ? (
          <div className="py-12 text-center text-ink/60">No matching people found.</div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map(person => {
              const v = villages.find(vi => vi.id === person.village_id);
              return (
                v ? (
                  <Link 
                    to={`/village/${v.slug}?view=lineage&select=${person.id}`}
                    key={person.id} 
                    className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm flex items-center justify-between hover:border-cedar/50 hover:shadow-md transition group block w-full text-left"
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-ink flex items-center gap-2 group-hover:text-cedar transition">
                        {person.name}
                        {person.urdu_name && <span className="text-cedar font-medium" lang="ur" dir="rtl">{person.urdu_name}</span>}
                      </h3>
                      <div className="mt-1 text-sm text-ink/60 flex items-center gap-3">
                        {person.father_name && <span>s/o {person.father_name}</span>}
                        <span className="flex items-center gap-1"><MapPin size={14}/> {person.village_name}</span>
                      </div>
                    </div>
                    <div className="p-2 text-ink/40 group-hover:text-cedar transition rounded-lg group-hover:bg-cedar/5">
                      <ChevronRight size={20} />
                    </div>
                  </Link>
                ) : (
                  <div key={person.id} className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-ink flex items-center gap-2">
                        {person.name}
                        {person.urdu_name && <span className="text-cedar font-medium" lang="ur" dir="rtl">{person.urdu_name}</span>}
                      </h3>
                      <div className="mt-1 text-sm text-ink/60 flex items-center gap-3">
                        {person.father_name && <span>s/o {person.father_name}</span>}
                        <span className="flex items-center gap-1"><MapPin size={14}/> {person.village_name}</span>
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
