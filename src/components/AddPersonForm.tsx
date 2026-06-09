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
      const peopleToInsert: PersonInsert[] = validEntries.map((ent, i) => ({
        id: `${villageId}-${timestamp}-${i}`,
        name: ent.name,
        urdu_name: ent.urduName || null,
        hindi_name: ent.hindiName || null,
        father_id: fatherId || null,
        village_id: villageId
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-ink/10">
          <h2 className="text-xl font-bold">
            {language === 'en' ? `${t('addTo')} ${villageName}` : `${villageName} ${t('addTo')}`}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-full"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative border-b border-ink/10 pb-6">
            <label className="text-sm font-medium">{t('sharedFather')}</label>
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
              className="w-full mt-1 p-2 border rounded-md"
            />
            {isFatherDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-ink/10 rounded-md shadow-lg max-h-48 overflow-y-auto">
                <button 
                  type="button"
                  onMouseDown={() => selectFather("", "")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-ink/5"
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
                      className="w-full text-left px-3 py-2 text-sm hover:bg-ink/5"
                    >
                      {lineage} {p.urdu_name ? `(${p.urdu_name})` : ""}
                    </button>
                  );
                })}
                {filteredFathers.length === 0 && (
                  <div className="px-3 py-2 text-sm text-ink/50">{t('noMatchingPeople')}</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {entries.map((entry, index) => (
              <div key={index} className="flex gap-3 items-start bg-ink/5 p-3 rounded-xl relative group">
                <div className="flex-1">
                  <label className="text-xs font-medium text-ink/60">{t('englishName')}</label>
                  <input required type="text" value={entry.name} onChange={e => updateEntry(index, "name", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm" placeholder={t('englishName')} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-ink/60">{t('urduName')}</label>
                  <input type="text" value={entry.urduName} onChange={e => updateEntry(index, "urduName", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm" dir="rtl" placeholder={t('urduName')} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-ink/60">{t('hindiName')}</label>
                  <input type="text" value={entry.hindiName} onChange={e => updateEntry(index, "hindiName", e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm" placeholder={t('hindiName')} />
                </div>
                {entries.length > 1 && (
                  <button type="button" onClick={() => removeEntry(index)} className="mt-6 p-2 text-madder hover:bg-madder/10 rounded-lg transition-colors">
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
              className="flex items-center gap-2 text-sm font-medium text-cedar hover:bg-cedar/10 px-3 py-2 rounded-lg transition-colors w-full justify-center border border-dashed border-cedar/50"
            >
              <Plus size={16} /> {t('addSiblingChild')}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-ink/10">
            <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-ink/70 hover:bg-ink/5 rounded-lg transition-colors">{t('cancel')}</button>
            <button type="submit" className="px-4 py-2 bg-cedar text-white font-bold rounded-lg hover:bg-cedar/90 transition-colors shadow-sm">{t('addPeople')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
