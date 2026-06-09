import type { DisplayTreeNode } from "../types";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";

function OutlineNode({ node, depth = 0 }: { node: DisplayTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="font-mono text-sm">
      <div 
        className="flex items-center gap-2 py-1.5 hover:bg-ink/5 rounded px-2 cursor-pointer transition"
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-4 flex justify-center text-ink/40">
          {hasChildren ? (expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <span className="w-1 h-1 rounded-full bg-ink/20"/>}
        </div>
        <User size={14} className={node.is_placeholder ? "text-ink/40" : "text-cedar"} />
        <span className="font-semibold text-ink">{node.name}</span>
        {node.urdu_name && <span className="text-ink/50 ml-1" dir="rtl" lang="ur">{node.urdu_name}</span>}
        {node.generation && <span className="text-[10px] bg-cedar/10 text-cedar px-1.5 rounded">G{node.generation}</span>}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map(child => <OutlineNode key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function OutlineView({ rootNode }: { rootNode: DisplayTreeNode | null }) {
  if (!rootNode) return <div className="p-8 text-center text-ink/60">No structured tree available.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-ink/10 p-6 h-full overflow-y-auto">
      <div className="max-w-3xl">
        <OutlineNode node={rootNode} />
      </div>
    </div>
  );
}
