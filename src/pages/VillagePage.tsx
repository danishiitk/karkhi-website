import { ArrowLeft, UserPlus, Info } from "lucide-react";
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

  if (loading) return <div className="p-12 text-center text-ink/50 font-medium">{t('loadingVillage')}</div>;
  if (!village) return <div className="p-12 text-center text-madder font-medium">{t('villageNotFound')}</div>;

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Village header */}
      <section className="shrink-0 border-b border-cedar/15 bg-hero-gradient px-4 py-5 md:px-6 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.5'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 rounded-md py-1 text-sm font-semibold text-cedar hover:text-brass transition">
            <ArrowLeft size={16} /> {t('backToVillages')}
          </Link>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mt-1 pb-1 text-2xl sm:text-3xl font-serif font-bold flex flex-wrap gap-2 sm:gap-3 items-baseline text-gold-gradient">
                {getLocalizedName(village, language)} 
                {language !== 'ur' && village.urdu_name && <span className="text-xl sm:text-2xl text-jade font-medium" lang="ur" dir="rtl">{village.urdu_name}</span>}
                {language !== 'hi' && village.hindi_name && <span className="text-xl sm:text-2xl text-jade font-medium">{village.hindi_name}</span>}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ViewSwitcher current={view} onChange={handleViewChange} />
              {canEditVillage(village.id) && (
                <button onClick={() => { setPreselectedFatherId(undefined); setShowAddForm(true); }} className="flex items-center gap-2 rounded-lg bg-cedar/90 px-3 py-2.5 text-sm font-semibold text-onyx hover:bg-cedar transition shadow-sm">
                  <UserPlus size={16} /> {t('addPeople')}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-cedar/10 border-y sm:border sm:rounded-xl border-cedar/20 px-4 py-3 sm:mx-6 sm:mt-4 flex items-start gap-3">
        <Info size={18} className="text-cedar shrink-0 mt-0.5" />
        <p className="text-sm text-cedar-dark leading-relaxed font-medium">
          {t('addGuidance')}
        </p>
      </div>

      <section className="flex-1 p-4 lg:p-6 overflow-hidden bg-paper">
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
