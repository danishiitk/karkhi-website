import type { DisplayTreeNode } from "../types";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";

function OutlineNode({ node, depth = 0 }: { node: DisplayTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="font-sans text-sm animate-fade-in">
      <div 
        className="flex items-center gap-2 py-2 hover:bg-emerald/5 rounded-lg px-2 cursor-pointer transition-colors"
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-5 flex justify-center text-emerald/60">
          {hasChildren ? (expanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>) : <span className="w-1.5 h-1.5 rounded-full bg-emerald/30"/>}
        </div>
        <User size={15} className={node.is_placeholder ? "text-ink/30" : "text-emerald"} />
        <span className="font-serif font-bold text-ink/90 text-base">{node.name}</span>
        {node.urdu_name && <span className="text-emerald ml-2 font-medium" dir="rtl" lang="ur">{node.urdu_name}</span>}
        {node.generation && <span className="text-[10px] uppercase font-bold bg-emerald/10 text-emerald px-2 py-0.5 rounded-full ml-2">Gen {node.generation}</span>}
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
