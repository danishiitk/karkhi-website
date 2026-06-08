import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import VillageCard from "../components/VillageCard";
import { villages } from "../data/familyTrees";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredVillages = useMemo(() => {
    if (!normalizedQuery) {
      return villages;
    }

    return villages.filter((village) => {
      const searchText = [
        village.name,
        village.urduName,
        village.slug,
        ...(village.alternateSpellings ?? [])
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <main className="min-h-screen">
      <section className="border-b border-ink/10 bg-white/55">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-madder">Static lineage archive</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Sheikh Hasan Family Tree
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/70">
              Sheikh Hasan is shown as the known common ancestor, with village settlement trees
              displayed below for reference. English names appear first and Urdu source names are
              retained for verification.
            </p>
          </div>
          <label className="relative max-w-xl">
            <span className="sr-only">Search villages</span>
            <Search
              aria-hidden="true"
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/45"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search villages"
              className="h-12 w-full rounded-md border border-ink/10 bg-white pl-12 pr-4 text-base text-ink shadow-sm outline-none transition placeholder:text-ink/45 focus:border-cedar focus:ring-2 focus:ring-cedar/20"
            />
          </label>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        {filteredVillages.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVillages.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-ink/10 bg-white/82 p-6 text-ink/70 shadow-archival">
            No villages match your search.
          </div>
        )}
      </section>
    </main>
  );
}
