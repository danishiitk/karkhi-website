import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Person } from "../types";
import { getLineage } from "../lib/queries";
import { GitBranch, Search, X } from "lucide-react";
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
    } else if (!selectId) {
      setSelectedPerson(null);
      setLineage([]);
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

  const handleSelect = (personId: string | null) => {
    setSearchParams(prev => { 
      if (personId) {
        prev.set("select", personId); 
      } else {
        prev.delete("select");
      }
      return prev; 
    }, { replace: true });
  };

  return (
    <div className="flex h-full gap-5 flex-col lg:flex-row p-2">
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-ink/8 p-5 min-h-[500px] hover-lift">
        <h3 className="font-serif font-bold text-lg mb-4 text-ink">{t('selectPersonToViewAncestry')}</h3>
        <div className="relative mb-5 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
          <input 
            type="text"
            placeholder={t('searchPeople')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-ink/5 border border-ink/5 rounded-xl text-sm focus:bg-white focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto content-start pr-2 scrollbar-thin">
          {people.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            (p.urdu_name && p.urdu_name.includes(search)) ||
            (p.hindi_name && p.hindi_name.includes(search))
          ).map(p => (
            <button 
              key={p.id} 
              onClick={() => handleSelect(p.id)}
              className={`text-left p-4 rounded-xl border text-sm transition-all duration-200 ${selectedPerson === p.id ? "bg-emerald/10 border-emerald text-emerald font-bold shadow-sm" : "bg-white border-ink/8 hover:border-emerald/40 hover:bg-ink/[0.02]"}`}
            >
              <div className="font-serif text-base">{getLocalizedName(p, language)}</div>
              {(language !== 'ur' && p.urdu_name) || (language !== 'hi' && p.hindi_name) ? (
                <div className="mt-1 opacity-70 font-medium">
                  {language !== 'ur' && p.urdu_name && <span dir="rtl" lang="ur" className="text-emerald">{p.urdu_name}</span>}
                  {language !== 'ur' && p.urdu_name && language !== 'hi' && p.hindi_name && <span className="mx-1">•</span>}
                  {language !== 'hi' && p.hindi_name && <span className="text-emerald">{p.hindi_name}</span>}
                </div>
              ) : null}
            </button>
          ))}
          {people.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) || 
            (p.urdu_name && p.urdu_name.includes(search)) ||
            (p.hindi_name && p.hindi_name.includes(search))
          ).length === 0 && (
            <div className="col-span-full py-12 text-center text-ink/40 font-medium italic">{t('noPeopleFound')}</div>
          )}
        </div>
      </div>
      
      {selectedPerson && (
        <>
          <div className="fixed inset-0 bg-onyx/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => handleSelect(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-y-auto max-h-[85vh] p-6 lg:relative lg:inset-auto lg:z-auto lg:rounded-2xl lg:shadow-sm lg:max-h-none lg:w-[400px] lg:p-8 lg:border lg:border-ink/8 animate-fade-in-up">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="w-12 h-1.5 bg-ink/10 rounded-full" />
            </div>
            
            <div className="flex justify-between items-center mb-8 border-b border-ink/5 pb-4">
              <h3 className="font-serif font-bold text-xl flex items-center gap-2 text-ink">
                <div className="p-2 rounded-lg bg-emerald/10 text-emerald">
                  <GitBranch size={18}/>
                </div>
                {t('ancestryPath')}
              </h3>
              <button onClick={() => handleSelect(null)} className="lg:hidden p-2 text-ink/40 hover:text-ink/70 hover:bg-ink/5 rounded-full transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            {loading ? (
              <div className="text-ink/40 text-center py-8 font-medium animate-pulse">{t('loadingLineage')}</div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald/40 before:via-emerald/20 before:to-transparent">
                {lineage.map((p, i) => (
                  <div key={p.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white bg-emerald text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {i === lineage.length - 1 ? <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_30px_rgba(45,106,79,0.5)]"/> : <div className="w-1.5 h-1.5 rounded-full bg-white/60"/>}
                    </div>
                    <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white border ${i === lineage.length - 1 ? 'border-emerald/30 shadow-md bg-emerald/5' : 'border-ink/8 shadow-sm'} p-3 rounded-xl transition-all hover:border-emerald/50`}>
                      <div className={`font-serif font-bold ${i === lineage.length - 1 ? 'text-emerald text-base' : 'text-ink text-sm'}`}>{getLocalizedName(p, language)}</div>
                      {language !== 'ur' && p.urdu_name && <div className="text-xs text-emerald/80 mt-0.5 font-medium" dir="rtl" lang="ur">{p.urdu_name}</div>}
                      {language !== 'hi' && p.hindi_name && <div className="text-xs text-emerald/80 mt-0.5 font-medium">{p.hindi_name}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
