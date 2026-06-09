import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { addPerson, addPeople, fetchPeopleByVillage } from "../lib/queries";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/LanguageContext";
import type { Person, PersonInsert } from "../lib/database.types";

export default function AddPersonForm({ villageId, villageName, initialFatherId, onClose, onAdded }: { villageId: string, villageName: string, initialFatherId?: string, onClose: () => void, onAdded: () => void }) {
  const { canEditVillage } = useAuth();
  const { t, language } = useTranslation();
  const [entries, setEntries] = useState([{ name: "", urduName: "", hindiName: "" }]);
  const [fatherId, setFatherId] = useState("");
  const [fatherSearch, setFatherSearch] = useState("");
  const [isFatherDropdownOpen, setIsFatherDropdownOpen] = useState(false);
  const [existingPeople, setExistingPeople] = useState<Person[]>([]);

  useEffect(() => {
    fetchPeopleByVillage(villageId).then(p => setExistingPeople(p.filter(pp => !pp.is_placeholder)));
  }, [villageId]);

  const filteredFathers = existingPeople.filter(p => 
    p.name.toLowerCase().includes(fatherSearch.toLowerCase()) || 
    (p.urdu_name && p.urdu_name.includes(fatherSearch))
  );

  const selectFather = (id: string, name: string) => {
    setFatherId(id);
    setFatherSearch(name);
    setIsFatherDropdownOpen(false);
  };

  const getLineageString = (person: Person) => {
    const parts = [person.name];
    let current = person;
    let depth = 0;
    while (current.father_id && depth < 3) {
      const father = existingPeople.find(p => p.id === current.father_id);
      if (!father) break;
      parts.push(father.name);
      current = father;
      depth++;
    }
    return parts.join(" s/o ");
  };

  useEffect(() => {
    if (initialFatherId && existingPeople.length > 0) {
      const parent = existingPeople.find(p => p.id === initialFatherId);
      if (parent) {
        setFatherId(parent.id);
        setFatherSearch(getLineageString(parent));
      }
    }
  }, [initialFatherId, existingPeople]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditVillage(villageId)) return;
    
    // Filter out completely empty rows, but require at least one valid row
    const validEntries = entries.filter(ent => ent.name.trim() !== "");
    if (validEntries.length === 0) return;

    try {
      const timestamp = Date.now();
      
      let nextGeneration: number | null = null;
      if (fatherId) {
        const father = existingPeople.find(p => p.id === fatherId);
        if (father && father.generation != null) {
          nextGeneration = father.generation + 1;
        }
      }

      const peopleToInsert: PersonInsert[] = validEntries.map((ent, i) => ({
        id: `${villageId}-${timestamp}-${i}`,
        name: ent.name,
        urdu_name: ent.urduName || null,
        hindi_name: ent.hindiName || null,
        father_id: fatherId || null,
        village_id: villageId,
        generation: nextGeneration
      }));

      await addPeople(peopleToInsert);
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const updateEntry = (index: number, field: "name" | "urduName" | "hindiName", value: string) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const inputClass = "w-full mt-1.5 p-2.5 border border-ink/10 rounded-lg text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-cedar/20 focus:border-cedar outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-card-hover overflow-hidden animate-scale-in border border-ink/10">
        <div className="flex justify-between items-center p-6 border-b border-cedar/10 bg-gradient-to-r from-paper to-white">
          <h2 className="text-xl font-serif font-bold text-ink">
            {language === 'en' ? `${t('addTo')} ` : ''}
            <span className="text-cedar">{villageName}</span>
            {language !== 'en' ? ` ${t('addTo')}` : ''}
          </h2>
          <button onClick={onClose} className="p-2 text-ink/40 hover:text-ink hover:bg-ink/5 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative border-b border-ink/8 pb-6">
            <label className="text-sm font-semibold text-ink/80">{t('sharedFather')}</label>
            <input 
              type="text"
              placeholder={t('searchFather')}
              value={fatherSearch}
              onChange={e => {
                setFatherSearch(e.target.value);
                setFatherId("");
                setIsFatherDropdownOpen(true);
              }}
              onFocus={() => setIsFatherDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsFatherDropdownOpen(false), 200)}
              className={inputClass}
            />
            {isFatherDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-ink/10 rounded-xl shadow-glass max-h-48 overflow-y-auto">
                <button 
                  type="button"
                  onMouseDown={() => selectFather("", "")}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-cedar/5 border-b border-ink/5 text-ink/70 font-medium transition-colors"
                >
                  {t('noneNewBranch')}
                </button>
                {filteredFathers.map(p => {
                  const lineage = getLineageString(p);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => selectFather(p.id, lineage)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-cedar/5 border-b border-ink/5 last:border-0 transition-colors"
                    >
                      <span className="font-medium text-ink">{lineage}</span> {p.urdu_name ? <span className="text-cedar ml-1" dir="rtl" lang="ur">({p.urdu_name})</span> : ""}
                    </button>
                  );
                })}
                {filteredFathers.length === 0 && (
                  <div className="px-4 py-3 text-sm text-ink/50 italic">{t('noMatchingPeople')}</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
            {entries.map((entry, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 sm:items-start bg-ink/[0.03] p-4 pt-8 sm:pt-4 rounded-xl relative group border border-ink/5 hover:border-cedar/20 transition-colors">
                <div className="w-full sm:flex-1">
                  <label className="text-xs font-semibold text-cedar/80 uppercase tracking-wider">{t('englishName')}</label>
                  <input required type="text" value={entry.name} onChange={e => updateEntry(index, "name", e.target.value)} className={inputClass} placeholder={t('englishName')} />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="text-xs font-semibold text-cedar/80 uppercase tracking-wider">{t('urduName')}</label>
                  <input type="text" value={entry.urduName} onChange={e => updateEntry(index, "urduName", e.target.value)} className={inputClass} dir="rtl" placeholder={t('urduName')} />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="text-xs font-semibold text-cedar/80 uppercase tracking-wider">{t('hindiName')}</label>
                  <input type="text" value={entry.hindiName} onChange={e => updateEntry(index, "hindiName", e.target.value)} className={inputClass} placeholder={t('hindiName')} />
                </div>
                {entries.length > 1 && (
                  <button type="button" onClick={() => removeEntry(index)} className="absolute top-2 right-2 sm:static sm:mt-7 p-1.5 sm:p-2 text-madder/60 hover:text-madder hover:bg-madder/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <button 
              type="button" 
              onClick={() => setEntries([...entries, { name: "", urduName: "", hindiName: "" }])}
              className="flex items-center gap-2 text-sm font-bold text-cedar hover:bg-cedar/10 hover:border-cedar px-3 py-3 rounded-xl transition-colors w-full justify-center border border-dashed border-cedar/40 bg-cedar/5"
            >
              <Plus size={16} /> {t('addSiblingChild')}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-ink/8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-semibold text-ink/60 hover:text-ink hover:bg-ink/5 rounded-xl transition-colors">{t('cancel')}</button>
            <button type="submit" className="px-6 py-2.5 bg-gold-gradient text-onyx font-bold rounded-xl hover:shadow-glow-gold transition-all shadow-sm">{t('addPeople')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
