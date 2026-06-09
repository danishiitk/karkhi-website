import type { Person } from "../types";


export default function TableView({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return <div className="p-8 text-center text-ink/60">No people in this village yet.</div>;
  }

  const sorted = [...people].sort((a, b) => {
    const ga = a.generation ?? 0;
    const gb = b.generation ?? 0;
    if (ga !== gb) return ga - gb;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-ink/10 h-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink/5 font-semibold text-ink/70">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Urdu Name</th>
            <th className="p-4">Generation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {sorted.map(p => (
            <tr key={p.id} className="hover:bg-ink/5 transition">
              <td className="p-4 font-medium text-ink">{p.name} {p.is_placeholder && <span className="ml-2 text-xs bg-ink/10 px-2 py-0.5 rounded-full text-ink/60">Branch</span>}</td>
              <td className="p-4 text-cedar font-medium" dir="rtl" lang="ur">{p.urdu_name}</td>
              <td className="p-4">{p.generation ?? "-"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
