import { useState, useEffect } from "react";
import { X, Edit2, Check } from "lucide-react";
import type { Person } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { updatePerson } from "../lib/queries";

import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

export default function PersonDetailsPanel({ person, father, childrenCount, onClose, allPeople, onUpdated }: { person: Person | null, father: Person | null, childrenCount: number, onClose: () => void, allPeople?: Person[], onUpdated?: () => void }) {
  const { t, language } = useTranslation();
  const { canEditVillage } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUrduName, setEditUrduName] = useState("");
  const [editHindiName, setEditHindiName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (person) {
      setEditName(person.name);
      setEditUrduName(person.urdu_name || "");
      setEditHindiName(person.hindi_name || "");
      setIsEditing(false);
    }
  }, [person]);

  if (!person) return null;
  const canEdit = canEditVillage(person.village_id);

  const handleSave = async () => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await updatePerson(person.id, {
        name: editName.trim(),
        urdu_name: editUrduName.trim() || null,
        hindi_name: editHindiName.trim() || null
      });
      setIsEditing(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getLineageString = () => {
    if (!allPeople) return null;
    const parts = [getLocalizedName(person, language)];
    let current = person;
    let depth = 0;
    while (current.father_id && depth < 10) {
      const parent = allPeople.find(p => p.id === current.father_id);
      if (!parent) break;
      parts.push(getLocalizedName(parent, language));
      current = parent;
      depth++;
    }
    return parts.join(" s/o ");
  };

  return (
    <aside className="w-full lg:w-80 bg-white border border-ink/10 rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
      <div className="p-4 border-b border-ink/10 flex justify-between items-start bg-ink/5 relative group">
        {!isEditing ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-ink pr-6">{getLocalizedName(person, language)}</h2>
              {language !== "ur" && person.urdu_name && <p className="text-cedar font-medium mt-1" dir="rtl" lang="ur">{person.urdu_name}</p>}
              {language !== "hi" && person.hindi_name && <p className="text-cedar font-medium mt-1">{person.hindi_name}</p>}
            </div>
            <div className="flex items-center gap-1">
              {canEdit && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-1.5 text-ink/50 hover:text-cedar hover:bg-white rounded-md transition"
                  title={t('edit')}
                >
                  <Edit2 size={16} />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-ink/10 rounded-full transition"><X size={18}/></button>
            </div>
          </>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-ink/50 uppercase tracking-wider">{t('edit')}</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs font-medium text-ink/60 hover:bg-ink/10 rounded">{t('cancel')}</button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving || !editName.trim()}
                  className="px-2 py-1 text-xs font-medium text-white bg-cedar hover:bg-cedar/90 rounded disabled:opacity-50 flex items-center gap-1"
                >
                  {isSaving ? "..." : <><Check size={14} /> {t('save')}</>}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">{t('englishName')}</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full text-sm border border-ink/20 rounded px-2 py-1.5 outline-none focus:border-cedar" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">{t('urduName')}</label>
              <input type="text" value={editUrduName} onChange={e => setEditUrduName(e.target.value)} className="w-full text-sm border border-ink/20 rounded px-2 py-1.5 outline-none focus:border-cedar" dir="rtl" lang="ur" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink/60 mb-1">{t('hindiName')}</label>
              <input type="text" value={editHindiName} onChange={e => setEditHindiName(e.target.value)} className="w-full text-sm border border-ink/20 rounded px-2 py-1.5 outline-none focus:border-cedar" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-sm">

        {person.generation != null && (
          <div>
            <h3 className="text-ink/50 font-semibold uppercase text-xs tracking-wider">{t('generation')}</h3>
            <p className="mt-1 font-medium">{person.generation}</p>
          </div>
        )}
        {allPeople && (
          <div>
            <h3 className="text-ink/50 font-semibold uppercase text-xs tracking-wider">{t('genealogy')}</h3>
            <p className="mt-1 font-medium">{getLineageString()}</p>
          </div>
        )}
        <div>
          <h3 className="text-ink/50 font-semibold uppercase text-xs tracking-wider">{t('father')}</h3>
          <p className="mt-1 font-medium">{father ? `${getLocalizedName(father, language)} ${language !== 'ur' && father.urdu_name ? `(${father.urdu_name})` : ''}` : t('unknownRoot')}</p>
        </div>
        <div>
          <h3 className="text-ink/50 font-semibold uppercase text-xs tracking-wider">{t('childrenCount')}</h3>
          <p className="mt-1 font-medium">{childrenCount}</p>
        </div>

      </div>
    </aside>
  );
}
