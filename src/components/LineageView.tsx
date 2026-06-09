import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Person } from "../types";
import { getLineage } from "../lib/queries";
import { GitBranch, Search } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

export default function LineageView({ people }: { people: Person[] }) {
  const { t, language } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectId = searchParams.get("select");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [lineage, setLineage] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectId && selectId !== selectedPerson) {
      loadLineage(selectId);
    }
  }, [selectId]);

  const loadLineage = async (personId: string) => {
    setSelectedPerson(personId);
    setLoading(true);
    try {
      const rows = await getLineage(personId);
      // Reverse so it goes root -> leaf
      setLineage(rows.reverse() as any); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (personId: string) => {
    setSearchParams(prev => { 
      prev.set("select", personId); 
      return prev; 
    }, { replace: true });
  };

  return (
    <div className="flex h-full gap-4 flex-col lg:flex-row">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-ink/10 p-4 min-h-[500px]">
        <h3 className="font-semibold mb-4">{t('selectPersonToViewAncestry')}</h3>
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input 
            type="text"
            placeholder={t('searchPeople')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ink/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-cedar"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto content-start">
          {people.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            (p.urdu_name && p.urdu_name.includes(search)) ||
            (p.hindi_name && p.hindi_name.includes(search))
          ).map(p => (
            <button 
              key={p.id} 
              onClick={() => handleSelect(p.id)}
              className={`text-left p-3 rounded-lg border text-sm transition ${selectedPerson === p.id ? "bg-cedar/10 border-cedar text-cedar font-medium" : "bg-white border-ink/10 hover:border-cedar/50"}`}
            >
              {getLocalizedName(p, language)} 
              {language !== 'ur' && p.urdu_name && <span className="ml-1 opacity-70" dir="rtl" lang="ur">({p.urdu_name})</span>}
              {language !== 'hi' && p.hindi_name && <span className="ml-1 opacity-70">({p.hindi_name})</span>}
            </button>
          ))}
          {people.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            (p.urdu_name && p.urdu_name.includes(search)) ||
            (p.hindi_name && p.hindi_name.includes(search))
          ).length === 0 && (
            <div className="col-span-full py-8 text-center text-ink/50 text-sm">{t('noPeopleFound')}</div>
          )}
        </div>
      </div>
      
      {selectedPerson && (
        <div className="w-full lg:w-96 bg-white rounded-xl shadow-sm border border-ink/10 p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><GitBranch/> {t('ancestryPath')}</h3>
          {loading ? (
            <div className="text-ink/50">{t('loadingLineage')}</div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-ink/10 before:to-transparent">
              {lineage.map((p, i) => (
                <div key={p.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-cedar text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    {i === lineage.length - 1 ? <div className="w-2 h-2 rounded-full bg-white"/> : <div className="w-1 h-1 rounded-full bg-white/50"/>}
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-ink/5 p-3 rounded-lg shadow-sm">
                    <div className="font-bold text-cedar">{getLocalizedName(p, language)}</div>
                    {language !== 'ur' && p.urdu_name && <div className="text-sm opacity-80" dir="rtl" lang="ur">{p.urdu_name}</div>}
                    {language !== 'hi' && p.hindi_name && <div className="text-sm opacity-80">{p.hindi_name}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
