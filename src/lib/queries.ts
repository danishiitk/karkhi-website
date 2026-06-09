import { supabase } from "./supabaseClient";
import type { Person, PersonInsert, Village, Profile, UserRole, LineageRow, DisplayTreeNode } from "./database.types";

export type SearchResult = Person & {
  village_name: string;
  father_name: string | null;
};

// Preferred display order – villages matching these substrings (case-insensitive)
// are shown first, in this exact order.  Everything else follows alphabetically.
const VILLAGE_ORDER = ["bigra", "semariya", "tilja", "baig", "tema", "chapiya"];

export async function fetchVillages(): Promise<Village[]> {
  const { data, error } = await supabase.from("villages").select("*").order("name");
  if (error) throw error;
  const villages = data ?? [];

  // Sort by priority order, then alphabetically
  return villages.sort((a, b) => {
    const aKey = a.name.toLowerCase();
    const bKey = b.name.toLowerCase();
    const aIdx = VILLAGE_ORDER.findIndex(v => aKey.includes(v));
    const bIdx = VILLAGE_ORDER.findIndex(v => bKey.includes(v));
    // Both in priority list → sort by list position
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    // Only one in priority list → it comes first
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    // Neither → alphabetical
    return aKey.localeCompare(bKey);
  });
}

export async function fetchVillagePeopleCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("people").select("village_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data || []) {
    counts[row.village_id] = (counts[row.village_id] || 0) + 1;
  }
  return counts;
}

export async function fetchVillageBySlug(slug: string): Promise<Village | null> {
  const { data, error } = await supabase.from("villages").select("*").eq("slug", slug).single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export type VillageInsert = {
  id: string;
  slug: string;
  name: string;
  urdu_name: string;
  hindi_name?: string | null;
  alternate_spellings?: string[];
};

export async function createVillage(village: VillageInsert): Promise<Village> {
  const { data, error } = await supabase.from("villages").insert(village).select().single();
  if (error) throw error;
  return data;
}

export async function updateVillage(id: string, updates: Partial<VillageInsert>): Promise<Village> {
  const { data, error } = await supabase.from("villages").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteVillage(id: string): Promise<void> {
  const { error } = await supabase.from("villages").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchPeopleByVillage(villageId: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("village_id", villageId)
    .order("generation", { ascending: true, nullsFirst: true })
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPersonById(id: string): Promise<Person | null> {
  const { data, error } = await supabase.from("people").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function fetchChildren(personId: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("father_id", personId)
    .order("generation", { ascending: true })
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function addPerson(person: PersonInsert): Promise<Person> {
  const { data, error } = await supabase.from("people").insert(person).select().single();
  if (error) throw error;
  return data;
}

export async function addPeople(people: PersonInsert[]): Promise<Person[]> {
  const { data, error } = await supabase.from("people").insert(people).select();
  if (error) throw error;
  return data ?? [];
}

export async function updatePerson(id: string, updates: Partial<PersonInsert>): Promise<Person> {
  const { data, error } = await supabase.from("people").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) throw error;
}

export async function getLineage(personId: string): Promise<LineageRow[]> {
  const { data, error } = await supabase.rpc("get_lineage", { person_id: personId } as any);
  if (error) throw error;
  return data ?? [];
}

export async function searchPeople(query: string): Promise<Person[]> {
  if (!query) return [];
  const tsQuery = query.trim().split(/\s+/).join(" & ");
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .textSearch("search_vector", tsQuery)
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function enrichSearchResults(people: Person[]): Promise<SearchResult[]> {
  if (people.length === 0) return [];
  const fatherIds = people.map((p) => p.father_id).filter(Boolean) as string[];
  const villageIds = [...new Set(people.map((p) => p.village_id))];

  const [fathersResponse, villagesResponse] = await Promise.all([
    fatherIds.length > 0 ? supabase.from("people").select("id, name").in("id", fatherIds) : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    villageIds.length > 0 ? supabase.from("villages").select("id, name").in("id", villageIds) : Promise.resolve({ data: [] as { id: string; name: string }[] })
  ]);

  const fathersMap = new Map(fathersResponse.data?.map((f) => [f.id, f.name]) || []);
  const villagesMap = new Map(villagesResponse.data?.map((v) => [v.id, v.name]) || []);

  return people.map((p) => ({
    ...p,
    father_name: p.father_id ? fathersMap.get(p.father_id) || null : null,
    village_name: villagesMap.get(p.village_id) || "Unknown"
  }));
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateProfileRole(id: string, role: UserRole, assignedVillageId: string | null = null): Promise<void> {
  const { error } = await supabase.from("profiles").update({ role, assigned_village_id: assignedVillageId }).eq("id", id);
  if (error) throw error;
}

export async function fetchStats() {
  const [pCount, vCount, uCount] = await Promise.all([
    supabase.from("people").select("*", { count: "exact", head: true }),
    supabase.from("villages").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true })
  ]);
  return {
    totalPeople: pCount.count ?? 0,
    totalVillages: vCount.count ?? 0,
    totalUsers: uCount.count ?? 0
  };
}

export function buildTree(people: Person[], rootId: string): DisplayTreeNode | null {
  const root = people.find((p) => p.id === rootId);
  if (!root) return null;

  const childrenMap = new Map<string, Person[]>();
  for (const person of people) {
    if (person.father_id) {
      const children = childrenMap.get(person.father_id) || [];
      children.push(person);
      childrenMap.set(person.father_id, children);
    }
  }

  function assembleNode(person: Person): DisplayTreeNode {
    const children = childrenMap.get(person.id) || [];
    return {
      ...person,
      children: children
        .sort((a, b) => {
          const genDelta = (a.generation ?? 0) - (b.generation ?? 0);
          return genDelta || a.name.localeCompare(b.name);
        })
        .map(assembleNode)
    };
  }

  return assembleNode(root);
}
