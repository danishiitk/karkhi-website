import { ArrowLeft, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchPeopleByVillage, fetchVillageBySlug, buildTree } from "../lib/queries";
import type { Village, Person, DisplayTreeNode } from "../types";

import TreeView from "../components/TreeView";
import TableView from "../components/TableView";
import LineageView from "../components/LineageView";
import OutlineView from "../components/OutlineView";
import ViewSwitcher, { type ViewMode } from "../components/ViewSwitcher";
import AddPersonForm from "../components/AddPersonForm";
import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

export default function VillagePage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<ViewMode>((searchParams.get("view") as ViewMode) || "canvas");
  const [village, setVillage] = useState<Village | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [treeRoot, setTreeRoot] = useState<DisplayTreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [preselectedFatherId, setPreselectedFatherId] = useState<string | undefined>();
  const { canEditVillage } = useAuth();
  const { t, language } = useTranslation();

  const loadData = async () => {
    if (!slug) return;
    try {
      const v = await fetchVillageBySlug(slug);
      if (!v) {
        setLoading(false);
        return;
      }
      setVillage(v);
      const p = await fetchPeopleByVillage(v.id);
      setPeople(p);
      
      // We look for a root node. If none found, we might build multiple trees. For simplicity, find common ancestor.
      // In this setup, people without father_id are roots. Let's just create a dummy root that holds all roots.
      const roots = p.filter(person => !person.father_id);
      const dummyRoot: DisplayTreeNode = {
        id: "virtual-root",
        name: v.name,
        urdu_name: v.urdu_name,
        hindi_name: v.hindi_name,
        father_id: null,
        village_id: v.id,
        generation: 0,
        is_placeholder: true,

        added_by: null,
        created_at: "",
        updated_at: "",
        children: roots.map(root => {
          const t = buildTree(p, root.id);
          return t!;
        }).filter(Boolean)
      };
      setTreeRoot(dummyRoot);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleViewChange = (v: ViewMode) => {
    setView(v);
    setSearchParams(prev => { prev.set("view", v); return prev; });
  };

  if (loading) return <div className="p-12 text-center text-ink/60">{t('loadingVillage')}</div>;
  if (!village) return <div className="p-12 text-center text-madder">{t('villageNotFound')}</div>;

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col bg-paper">
      <section className="shrink-0 border-b border-ink/10 bg-white/55 px-4 py-4 md:px-6">
        <Link to="/" className="inline-flex items-center gap-2 rounded-md py-1 text-sm font-semibold text-cedar hover:text-madder transition">
          <ArrowLeft size={16} /> {t('backToVillages')}
        </Link>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>

            <h1 className="mt-2 text-3xl font-bold text-ink flex gap-3 items-baseline">
              {getLocalizedName(village, language)} 
              {language !== 'ur' && village.urdu_name && <span className="text-2xl text-cedar font-medium" lang="ur" dir="rtl">{village.urdu_name}</span>}
              {language !== 'hi' && village.hindi_name && <span className="text-2xl text-cedar font-medium">{village.hindi_name}</span>}
            </h1>

          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher current={view} onChange={handleViewChange} />
            {canEditVillage(village.id) && (
              <button onClick={() => { setPreselectedFatherId(undefined); setShowAddForm(true); }} className="flex items-center gap-2 rounded-lg bg-cedar px-3 py-2.5 text-sm font-semibold text-white hover:bg-cedar/90 transition shadow-sm">
                <UserPlus size={16} /> {t('addPeople')}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="flex-1 p-4 lg:p-6 overflow-hidden">
        {view === "canvas" && <TreeView 
          rootNode={treeRoot} 
          allPeople={people} 
          canEdit={canEditVillage(village.id)}
          onAddNode={(id) => { setPreselectedFatherId(id); setShowAddForm(true); }}
        />}
        {view === "table" && <TableView people={people} />}
        {view === "lineage" && <LineageView people={people} />}
        {view === "outline" && <OutlineView rootNode={treeRoot} />}
      </section>

      {showAddForm && (
        <AddPersonForm 
          villageId={village.id} 
          villageName={village.name}
          initialFatherId={preselectedFatherId}
          onClose={() => setShowAddForm(false)} 
          onAdded={loadData} 
        />
      )}
    </main>
  );
}
