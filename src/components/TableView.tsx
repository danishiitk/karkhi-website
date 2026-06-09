import type { Person } from "../types";


export default function TableView({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return <div className="p-12 text-center text-ink/40 font-medium italic">No people in this village yet.</div>;
  }

  const sorted = [...people].sort((a, b) => {
    const ga = a.generation ?? 0;
    const gb = b.generation ?? 0;
    if (ga !== gb) return ga - gb;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-2 h-full">
      <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-ink/8 h-full flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-onyx sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-5 font-serif font-bold text-white tracking-wide">Name</th>
                <th className="p-5 font-serif font-bold text-white tracking-wide">Urdu Name</th>
                <th className="p-5 font-serif font-bold text-white tracking-wide">Hindi Name</th>
                <th className="p-5 font-serif font-bold text-white tracking-wide">Generation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {sorted.map((p, i) => (
                <tr key={p.id} className="hover:bg-cedar/5 transition-colors animate-fade-in" style={{ animationDelay: `${Math.min(i * 10, 500)}ms` }}>
                  <td className="p-5 font-bold font-serif text-ink text-base">
                    {p.name} 
                    {p.is_placeholder && <span className="ml-3 text-[10px] uppercase tracking-wider font-sans bg-ink/5 px-2 py-1 rounded-md text-ink/50 border border-ink/10">Branch Placeholder</span>}
                  </td>
                  <td className="p-5 text-emerald font-medium text-base" dir="rtl" lang="ur">{p.urdu_name || "-"}</td>
                  <td className="p-5 text-emerald font-medium text-base">{p.hindi_name || "-"}</td>
                  <td className="p-5">
                    {p.generation ? (
                      <span className="bg-cedar/10 text-cedar px-3 py-1 rounded-full text-xs font-bold">Gen {p.generation}</span>
                    ) : (
                      <span className="text-ink/30">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
