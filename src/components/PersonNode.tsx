import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch, UserRound, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Person } from "../types";

import { useLanguage } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

export type PersonNodeData = {
  person: Person;
  childrenCount: number;
  isCollapsed: boolean;
  isDimmed: boolean;
  isMatch: boolean;
  canEdit?: boolean;
  onToggle: () => void;
  onAddNode?: () => void;
};

import type { Node } from "@xyflow/react";

export type PersonFlowNode = Node<PersonNodeData, "person">;
export default function PersonNode({ data, selected }: NodeProps<PersonFlowNode>) {
  const { language } = useLanguage();
  const p = data.person;
  const displayName = getLocalizedName(p, language);

  return (
    <div className={`relative w-64 bg-white rounded-xl shadow-archival border-2 transition-all duration-200 ${selected ? "border-emerald ring-2 ring-emerald/20 shadow-[0_0_30px_rgba(45,106,79,0.2)]" : "border-ink/8"} ${data.isDimmed ? "opacity-50" : "opacity-100"} ${data.isMatch ? "outline outline-4 outline-emerald/50" : ""}`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-emerald !border-2 !border-white" />
      
      <div className="p-4 flex gap-3 items-start">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-emerald/20 to-emerald/10 text-emerald flex items-center justify-center">
          {p.is_placeholder ? <GitBranch size={20}/> : <UserRound size={20}/>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink truncate font-serif">{displayName}</div>
          {language !== "ur" && p.urdu_name && <div className="text-sm text-emerald font-medium truncate text-left" dir="rtl" lang="ur">{p.urdu_name}</div>}
          {language !== "hi" && p.hindi_name && <div className="text-sm text-emerald font-medium truncate text-left">{p.hindi_name}</div>}
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {p.generation != null && <span className="text-[10px] bg-emerald/10 text-emerald px-2 py-0.5 rounded-full font-semibold">Gen {p.generation}</span>}
        </div>

        {data.canEdit && data.onAddNode && !p.is_placeholder && (
          <button
            onClick={(e) => { e.stopPropagation(); data.onAddNode!(); }}
            className="w-6 h-6 bg-white border border-emerald/30 text-emerald hover:text-white hover:bg-emerald rounded-full shadow-sm flex items-center justify-center transition-colors"
            title="Add Son"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {data.childrenCount > 0 && (
        <button 
          onClick={(e) => { e.stopPropagation(); data.onToggle(); }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-emerald/20 text-ink/50 hover:text-emerald rounded-full p-1 shadow-sm transition"
        >
          {data.isCollapsed ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
          <span className="absolute -right-2 -top-2 bg-emerald text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {data.childrenCount}
          </span>
        </button>
      )}

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-emerald !border-2 !border-white" />
    </div>
  );
}
