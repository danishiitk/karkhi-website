import { Shield, Users, Search, Map, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchAllProfiles, fetchStats, fetchVillages, updateProfileRole, fetchVillagePeopleCounts, createVillage, updateVillage, deleteVillage, type VillageInsert } from "../lib/queries";
import type { Profile, UserRole, Village } from "../lib/database.types";
import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const { t, language } = useTranslation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [stats, setStats] = useState({ totalPeople: 0, totalVillages: 0, totalUsers: 0 });
  const [peopleCounts, setPeopleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [villageSearch, setVillageSearch] = useState("");

  // User management state
  const [pendingRoleUpdates, setPendingRoleUpdates] = useState<Record<string, { role: UserRole, assigned_village_id: string | null }>>({});
  const [updatingUserIds, setUpdatingUserIds] = useState<Set<string>>(new Set());

  // Village management state
  const [showAddVillage, setShowAddVillage] = useState(false);
  const [editingVillageId, setEditingVillageId] = useState<string | null>(null);
  const [villageForm, setVillageForm] = useState({ name: "", urduName: "", hindiName: "", slug: "", alternateSpellings: "" });
  const [savingVillage, setSavingVillage] = useState(false);

  const filteredProfiles = profiles.filter(p => 
    (p.full_name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredVillages = villages.filter(v =>
    (v.name || "").toLowerCase().includes(villageSearch.toLowerCase())
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, v, s, pc] = await Promise.all([
        fetchAllProfiles(), 
        fetchVillages(), 
        fetchStats(),
        fetchVillagePeopleCounts()
      ]);
      setProfiles(p);
      setVillages(v);
      setStats(s);
      setPeopleCounts(pc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, loadData]);

  const executeRoleUpdate = async (userId: string, role: UserRole, villageId: string | null) => {
    setUpdatingUserIds(prev => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
    try {
      await updateProfileRole(userId, role, villageId);
      await loadData();
      setPendingRoleUpdates(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    } finally {
      setUpdatingUserIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const resetVillageForm = () => {
    setVillageForm({ name: "", urduName: "", hindiName: "", slug: "", alternateSpellings: "" });
    setShowAddVillage(false);
    setEditingVillageId(null);
  };

  const startEditVillage = (v: Village) => {
    setEditingVillageId(v.id);
    setShowAddVillage(false);
    setVillageForm({
      name: v.name,
      urduName: v.urdu_name || "",
      hindiName: v.hindi_name || "",
      slug: v.slug,
      alternateSpellings: v.alternate_spellings.join(", ")
    });
  };

  const handleSaveVillage = async () => {
    if (!villageForm.name.trim() || !villageForm.slug.trim()) return;
    setSavingVillage(true);
    try {
      const spellings = villageForm.alternateSpellings.split(",").map(s => s.trim()).filter(Boolean);
      if (editingVillageId) {
        await updateVillage(editingVillageId, {
          name: villageForm.name.trim(),
          urdu_name: villageForm.urduName.trim(),
          hindi_name: villageForm.hindiName.trim() || null,
          slug: villageForm.slug.trim(),
          alternate_spellings: spellings
        });
      } else {
        const id = villageForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
        await createVillage({
          id,
          name: villageForm.name.trim(),
          urdu_name: villageForm.urduName.trim(),
          hindi_name: villageForm.hindiName.trim() || null,
          slug: villageForm.slug.trim(),
          alternate_spellings: spellings
        });
      }
      resetVillageForm();
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving village: " + (err as Error).message);
    } finally {
      setSavingVillage(false);
    }
  };

  const handleDeleteVillage = async (v: Village) => {
    if (!confirm(t('confirmDeleteVillage'))) return;
    try {
      await deleteVillage(v.id);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error deleting village: " + (err as Error).message);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-paper p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-madder" /> {t('adminDashboard')}
        </h1>

        {/* ─── Stats Cards ─── */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-ink/10">
            <h3 className="text-ink/60 font-medium">{t('totalPeople')}</h3>
            <p className="mt-2 text-4xl font-bold">{stats.totalPeople}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-ink/10">
            <h3 className="text-ink/60 font-medium">{t('villages')}</h3>
            <p className="mt-2 text-4xl font-bold">{stats.totalVillages}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-ink/10">
            <h3 className="text-ink/60 font-medium">{t('registeredUsers')}</h3>
            <p className="mt-2 text-4xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        {/* ─── Village Management ─── */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-ink/10 overflow-hidden">
          <div className="p-6 border-b border-ink/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Map /> {t('villageManagement')}</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
                <input 
                  type="text" 
                  placeholder={t('searchVillages')} 
                  value={villageSearch}
                  onChange={e => setVillageSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-ink/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-cedar w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => { resetVillageForm(); setShowAddVillage(true); }}
                className="flex items-center gap-2 bg-cedar text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cedar/90 transition whitespace-nowrap"
              >
                <Plus size={16} /> {t('addVillage')}
              </button>
            </div>
          </div>

          {/* Add Village Form */}
          {showAddVillage && (
            <div className="p-6 border-b border-ink/10 bg-ink/[0.02]">
              <h3 className="text-sm font-bold text-ink/60 uppercase tracking-wider mb-4">{t('addVillage')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">{t('villageName')} (English) *</label>
                  <input type="text" value={villageForm.name} onChange={e => setVillageForm(f => ({...f, name: e.target.value}))} className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:border-cedar outline-none" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">{t('urduName')} *</label>
                  <input type="text" value={villageForm.urduName} onChange={e => setVillageForm(f => ({...f, urduName: e.target.value}))} className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:border-cedar outline-none" dir="rtl" lang="ur" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">{t('hindiName')}</label>
                  <input type="text" value={villageForm.hindiName} onChange={e => setVillageForm(f => ({...f, hindiName: e.target.value}))} className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:border-cedar outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1">{t('villageSlug')} *</label>
                  <input type="text" value={villageForm.slug} onChange={e => setVillageForm(f => ({...f, slug: e.target.value}))} placeholder="e.g. my-village" className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:border-cedar outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-ink/60 mb-1">{t('alternateSpellings')}</label>
                  <input type="text" value={villageForm.alternateSpellings} onChange={e => setVillageForm(f => ({...f, alternateSpellings: e.target.value}))} placeholder="e.g. Bigra Awwal, Bigra Awal" className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm focus:border-cedar outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={resetVillageForm} className="px-4 py-2 text-sm font-medium text-ink/60 hover:bg-ink/10 rounded-lg transition">{t('cancel')}</button>
                <button 
                  onClick={handleSaveVillage} 
                  disabled={savingVillage || !villageForm.name.trim() || !villageForm.slug.trim() || !villageForm.urduName.trim()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-cedar hover:bg-cedar/90 rounded-lg disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Check size={16} /> {t('save')}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-ink/60 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">{t('villages')}</th>
                  <th className="px-6 py-4">{t('villageSlug')}</th>
                  <th className="px-6 py-4">{t('totalPeople')}</th>
                  <th className="px-6 py-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredVillages.map(v => (
                  <tr key={v.id} className="group">
                    {editingVillageId === v.id ? (
                      <>
                        <td className="px-6 py-3">
                          <div className="space-y-2">
                            <input type="text" value={villageForm.name} onChange={e => setVillageForm(f => ({...f, name: e.target.value}))} className="w-full border border-ink/20 rounded px-2 py-1 text-sm focus:border-cedar outline-none" placeholder={t('englishName')} />
                            <input type="text" value={villageForm.urduName} onChange={e => setVillageForm(f => ({...f, urduName: e.target.value}))} className="w-full border border-ink/20 rounded px-2 py-1 text-sm focus:border-cedar outline-none" dir="rtl" lang="ur" placeholder={t('urduName')} />
                            <input type="text" value={villageForm.hindiName} onChange={e => setVillageForm(f => ({...f, hindiName: e.target.value}))} className="w-full border border-ink/20 rounded px-2 py-1 text-sm focus:border-cedar outline-none" placeholder={t('hindiName')} />
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <input type="text" value={villageForm.slug} onChange={e => setVillageForm(f => ({...f, slug: e.target.value}))} className="w-full border border-ink/20 rounded px-2 py-1 text-sm focus:border-cedar outline-none" />
                          <input type="text" value={villageForm.alternateSpellings} onChange={e => setVillageForm(f => ({...f, alternateSpellings: e.target.value}))} className="w-full border border-ink/20 rounded px-2 py-1 text-sm focus:border-cedar outline-none mt-2" placeholder={t('alternateSpellings')} />
                        </td>
                        <td className="px-6 py-3">{peopleCounts[v.id] || 0}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={handleSaveVillage} disabled={savingVillage} className="p-1.5 text-white bg-cedar hover:bg-cedar/90 rounded-md transition disabled:opacity-50" title={t('save')}>
                              <Check size={16} />
                            </button>
                            <button onClick={resetVillageForm} className="p-1.5 text-ink/50 hover:bg-ink/10 rounded-md transition" title={t('cancel')}>
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="font-medium">{getLocalizedName(v, language)}</div>
                          {language !== "ur" && v.urdu_name && <div className="text-xs text-cedar" dir="rtl" lang="ur">{v.urdu_name}</div>}
                          {language !== "hi" && v.hindi_name && <div className="text-xs text-cedar">{v.hindi_name}</div>}
                          {v.alternate_spellings.length > 0 && (
                            <div className="text-[11px] text-ink/40 mt-0.5">{v.alternate_spellings.join(", ")}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-ink/60">{v.slug}</td>
                        <td className="px-6 py-4">{peopleCounts[v.id] || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditVillage(v)} className="p-1.5 text-ink/40 hover:text-cedar hover:bg-ink/5 rounded-md transition" title={t('editVillage')}>
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteVillage(v)} className="p-1.5 text-ink/40 hover:text-madder hover:bg-madder/5 rounded-md transition" title={t('deleteVillage')}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredVillages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-ink/50">{t('noVillagesFound')} "{villageSearch}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── User Management ─── */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-ink/10 overflow-hidden">
          <div className="p-6 border-b border-ink/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users /> {t('userManagement')}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
              <input 
                type="text" 
                placeholder={t('searchUsers')} 
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-ink/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-cedar w-full sm:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink/5 text-ink/60 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">{t('nameEmail')}</th>
                  <th className="px-6 py-4">{t('role')}</th>
                  <th className="px-6 py-4">{t('assignedVillage')}</th>
                  <th className="px-6 py-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredProfiles.map(p => {
                  const pending = pendingRoleUpdates[p.id] || { role: p.role, assigned_village_id: p.assigned_village_id };
                  const isUpdating = updatingUserIds.has(p.id);
                  const hasChanges = pending.role !== p.role || pending.assigned_village_id !== p.assigned_village_id;

                  return (
                  <tr key={p.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium">{p.full_name || t('noName')}</div>
                      <div className="text-ink/60 text-xs">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={pending.role}
                        onChange={(e) => setPendingRoleUpdates(prev => ({ ...prev, [p.id]: { ...pending, role: e.target.value as UserRole } }))}
                        className="rounded border p-1"
                        disabled={isUpdating}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="village_admin">Village Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="bg-ink/5 border-none rounded-lg text-sm focus:ring-2 focus:ring-cedar disabled:opacity-50"
                        value={pending.assigned_village_id || ""}
                        onChange={(e) => setPendingRoleUpdates(prev => ({ ...prev, [p.id]: { ...pending, assigned_village_id: e.target.value || null } }))}
                        disabled={isUpdating || pending.role === 'super_admin'}
                      >
                        <option value="">{t('none')}</option>
                        {villages.map(v => (
                          <option key={v.id} value={v.id}>{getLocalizedName(v, language)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => executeRoleUpdate(p.id, pending.role, pending.assigned_village_id)}
                        disabled={!hasChanges || isUpdating}
                        className="text-cedar font-medium hover:underline text-xs disabled:opacity-50 disabled:hover:no-underline"
                      >
                        {isUpdating ? 'Updating...' : t('updateRole')}
                      </button>
                    </td>
                  </tr>
                )})}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-ink/50">{t('noUsersFound')} "{userSearch}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
