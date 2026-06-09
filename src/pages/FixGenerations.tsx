import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Person } from "../lib/database.types";

export default function FixGenerations() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setLog(["Starting generation backfill..."]);
    
    const { data: people, error } = await supabase.from("people").select("*");
    if (error) {
      setLog(l => [...l, `Error fetching: ${error.message}`]);
      setRunning(false);
      return;
    }
    
    setLog(l => [...l, `Fetched ${people.length} people.`]);
    
    const originalGenerations = new Map(people.map(p => [p.id, p.generation]));
    const byId = new Map(people.map(p => [p.id, p]));
    const childrenByFather = new Map<string, string[]>();
    
    for (const p of people) {
      if (p.father_id) {
        if (!childrenByFather.has(p.father_id)) childrenByFather.set(p.father_id, []);
        childrenByFather.get(p.father_id)!.push(p.id);
      }
    }
    
    let iteration = 0;
    while (true) {
      iteration++;
      let currentChanges = 0;
      
      for (const p of people) {
        if (p.generation == null && p.father_id) {
          const father = byId.get(p.father_id);
          if (father && father.generation != null) {
            p.generation = father.generation + 1;
            currentChanges++;
          }
        }
        
        if (p.generation == null) {
          const childrenIds = childrenByFather.get(p.id) || [];
          const childrenGens = childrenIds.map(cid => byId.get(cid)!.generation).filter(g => g != null) as number[];
          if (childrenGens.length > 0) {
            const minGen = Math.min(...childrenGens);
            p.generation = minGen - 1;
            currentChanges++;
          }
        }
      }
      
      setLog(l => [...l, `Iteration ${iteration}: calculated ${currentChanges} new generations.`]);
      if (currentChanges === 0) break;
      if (iteration > 50) {
         setLog(l => [...l, `Max iterations reached.`]);
         break;
      }
    }
    
    const toUpdate = people.filter(p => p.generation !== originalGenerations.get(p.id));
    
    if (toUpdate.length > 0) {
      setLog(l => [...l, `Updating ${toUpdate.length} records in Supabase...`]);
      let successes = 0;
      for (const p of toUpdate) {
        const { error: updateErr } = await supabase.from("people").update({ generation: p.generation }).eq("id", p.id);
        if (updateErr) {
          setLog(l => [...l, `Error updating ${p.name}: ${updateErr.message}`]);
        } else {
          successes++;
        }
      }
      setLog(l => [...l, `Successfully updated ${successes}/${toUpdate.length} records!`]);
    } else {
      setLog(l => [...l, `No records needed updating.`]);
    }
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-20 bg-white rounded-xl shadow-lg border border-ink/10">
      <h1 className="text-2xl font-bold font-serif mb-4 text-emerald">Fix Generations</h1>
      <p className="text-ink/60 mb-6">This script will automatically calculate and backfill missing generations based on parent-child relationships.</p>
      
      <button 
        onClick={run} 
        disabled={running}
        className="px-4 py-2 bg-emerald text-white rounded-lg font-bold disabled:opacity-50 hover:bg-emerald/80"
      >
        {running ? "Running..." : "Run Backfill Script"}
      </button>
      
      <div className="mt-8 bg-onyx text-emerald/80 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {log.length === 0 ? "Logs will appear here..." : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
