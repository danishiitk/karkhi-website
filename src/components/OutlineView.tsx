import type { DisplayTreeNode } from "../types";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

function OutlineNode({ node, depth = 0 }: { node: DisplayTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const { language } = useTranslation();
  const hasChildren = node.children.length > 0;

  return (
    <div className="font-sans text-sm animate-fade-in">
      <div 
        className="flex items-center flex-wrap sm:flex-nowrap gap-1 sm:gap-2 py-1.5 sm:py-2 hover:bg-emerald/5 rounded-lg px-2 cursor-pointer transition-colors"
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-4 sm:w-5 flex justify-center text-emerald/60 shrink-0">
          {hasChildren ? (expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <span className="w-1.5 h-1.5 rounded-full bg-emerald/30"/>}
        </div>
        <User size={14} className={`shrink-0 ${node.is_placeholder ? "text-ink/30" : "text-emerald"}`} />
        <span className="font-serif font-bold text-ink/90 text-sm sm:text-base ml-1">{getLocalizedName(node, language)}</span>
        {language !== 'ur' && node.urdu_name && <span className="text-emerald ml-1 sm:ml-2 font-medium text-xs sm:text-sm" dir="rtl" lang="ur">{node.urdu_name}</span>}
        {language !== 'hi' && node.hindi_name && <span className="text-emerald ml-1 sm:ml-2 font-medium text-xs sm:text-sm">{node.hindi_name}</span>}
        {node.generation && <span className="shrink-0 text-[9px] sm:text-[10px] uppercase font-bold bg-emerald/10 text-emerald px-1.5 sm:px-2 py-0.5 rounded-full ml-auto sm:ml-2">Gen {node.generation}</span>}
      </div>
      {expanded && hasChildren && (
        <div className="relative before:absolute before:left-[1.1rem] before:top-0 before:bottom-0 before:w-px before:bg-ink/5">
          {node.children.map(child => <OutlineNode key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function OutlineView({ rootNode }: { rootNode: DisplayTreeNode | null }) {
  if (!rootNode) return <div className="p-12 text-center text-ink/40 font-medium italic">No structured tree available.</div>;

  return (
    <div className="p-2 h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-ink/8 p-6 lg:p-8 h-full overflow-y-auto card-ornament scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <OutlineNode node={rootNode} />
        </div>
      </div>
    </div>
  );
}
