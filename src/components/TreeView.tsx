import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, MarkerType, type NodeTypes, type EdgeTypes, type Node, type Edge, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PersonNode, { type PersonFlowNode } from "./PersonNode";
import PersonDetailsPanel from "./PersonDetailsPanel";
import type { DisplayTreeNode, Person } from "../types";
import { Maximize2, ZoomIn, ZoomOut, ChevronsUpDown, ChevronsDownUp, Search } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { getLocalizedName } from "../lib/i18n";

import TreeEdge from "./TreeEdge";

const nodeTypes: NodeTypes = { person: PersonNode };
const edgeTypes: EdgeTypes = { tree: TreeEdge };

function getAllIds(node: DisplayTreeNode): string[] {
  return [node.id, ...node.children.flatMap(getAllIds)];
}

function TreeViewInner({ rootNode, allPeople, canEdit, onAddNode, onPersonUpdated }: { rootNode: DisplayTreeNode | null, allPeople: Person[], canEdit?: boolean, onAddNode?: (id: string) => void, onPersonUpdated?: () => void }) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [nodeToFocus, setNodeToFocus] = useState<string | null>(null);
  const { fitView, zoomIn, zoomOut, setCenter } = useReactFlow();
  const { t, language } = useTranslation();

  const getAncestors = useCallback((personId: string): string[] => {
    const ancestors: string[] = [];
    let current = allPeople.find(p => p.id === personId);
    while (current && current.father_id) {
      const fatherId = current.father_id;
      ancestors.push(fatherId);
      current = allPeople.find(p => p.id === fatherId);
    }
    return ancestors;
  }, [allPeople]);

  const handleSearchSelect = (personId: string) => {
    const ancestors = getAncestors(personId);
    setCollapsedIds(prev => {
      const next = new Set(prev);
      ancestors.forEach(id => next.delete(id));
      return next;
    });
    setSelectedId(personId);
    setNodeToFocus(personId);
    setSearch("");
  };

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allPeople.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.urdu_name && p.urdu_name.includes(q)) ||
      (p.hindi_name && p.hindi_name.includes(q))
    ).slice(0, 5);
  }, [search, allPeople]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = () => setCollapsedIds(new Set());
  const collapseAll = () => {
    if (!rootNode) return;
    const all = new Set(getAllIds(rootNode).filter(id => id !== rootNode.id));
    setCollapsedIds(all);
  };

  const { nodes, edges } = useMemo(() => {
    if (!rootNode) return { nodes: [], edges: [] };
    const ns: Node[] = [];
    const es: Edge[] = [];
    const horizontalSpacing = 280;
    const verticalSpacing = 180;
    const nodeWidth = 256;

    // Returns { width, center }
    function traverse(node: DisplayTreeNode, x: number, y: number, isHidden: boolean): { width: number, center: number } {
      if (isHidden) return { width: 0, center: 0 };
      const isCollapsed = collapsedIds.has(node.id);
      
      let width = 0;
      const childCenters: number[] = [];
      
      if (!isCollapsed && node.children.length > 0) {
        let currentX = x;
        for (const child of node.children) {
          const res = traverse(child, currentX, y + verticalSpacing, false);
          childCenters.push(res.center);
          currentX += res.width + 20; // gap
          width += res.width + 20;
        }
        width -= 20; // remove last gap
      } else {
        // traverse them as hidden to count them if needed
        for (const child of node.children) traverse(child, 0, 0, true);
        width = horizontalSpacing;
      }

      width = Math.max(horizontalSpacing, width);
      
      let center: number;
      if (childCenters.length > 0) {
        center = (childCenters[0] + childCenters[childCenters.length - 1]) / 2;
      } else {
        center = x + width / 2;
      }
      
      const finalX = center - nodeWidth / 2;
      
      ns.push({
        id: node.id,
        type: "person",
        position: { x: finalX, y },
        data: {
          person: node,
          childrenCount: node.children.length,
          isCollapsed,
          isDimmed: false,
          isMatch: false,
          canEdit,
          onToggle: () => toggleCollapse(node.id),
          onAddNode: onAddNode ? () => onAddNode(node.id) : undefined
        }
      });

      if (!isCollapsed) {
        for (const child of node.children) {
          es.push({
            id: `e-${node.id}-${child.id}`,
            source: node.id,
            target: child.id,
            type: "tree",
            style: { stroke: "#2d6a4f", strokeWidth: 1.5, opacity: 0.5 }
          });
        }
      }
      return { width, center };
    }
    
    // Position root
    const rootLayout = traverse(rootNode, 0, 0, false);
    
    // Shift all nodes to center root around 0
    const shiftX = -rootLayout.center;
    for (const n of ns) {
      n.position.x += shiftX;
    }

    return { nodes: ns, edges: es };
  }, [rootNode, collapsedIds, toggleCollapse]);

  useEffect(() => {
    if (nodeToFocus) {
      const node = nodes.find(n => n.id === nodeToFocus);
      if (node) {
        setCenter(node.position.x + 128, node.position.y + 80, { zoom: 1, duration: 800 });
        setNodeToFocus(null);
      }
    }
  }, [nodes, nodeToFocus, setCenter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        // Focus on the top center where the root node is located
        setCenter(0, 150, { zoom: 0.7, duration: 800 });
      } else {
        fitView({ padding: 0.2, maxZoom: 1, duration: 800 });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [nodes.length, fitView, setCenter]);

  const selectedPerson = useMemo(() => allPeople.find(p => p.id === selectedId) || null, [selectedId, allPeople]);
  const selectedFather = useMemo(() => allPeople.find(p => p.id === selectedPerson?.father_id) || null, [selectedPerson, allPeople]);

  if (!rootNode) return <div className="flex h-full items-center justify-center text-ink/50 font-medium">Tree empty.</div>;

  const controlBtnClass = "p-2 bg-onyx/80 backdrop-blur-sm rounded-lg shadow-glass border border-white/10 text-white/60 hover:text-emerald hover:bg-onyx transition-all";

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <div className="relative flex-1 bg-white rounded-xl border border-ink/8 shadow-sm overflow-hidden min-h-[500px]">
        
        {/* Search Bar */}
        <div className="absolute top-4 left-4 z-20 w-[calc(100%-2rem)] max-w-[260px] sm:max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
            <input 
              type="text"
              placeholder={t('searchPeople')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-ink/10 rounded-xl text-sm focus:bg-white focus:border-emerald focus:ring-2 focus:ring-emerald/20 outline-none shadow-sm transition-all"
            />
          </div>
          {search && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-ink/10 overflow-hidden">
              {searchResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSearchSelect(p.id)}
                  className="w-full text-left px-4 py-3 hover:bg-emerald/5 transition-colors border-b border-ink/5 last:border-0 flex flex-col"
                >
                  <span className="font-serif font-bold text-ink text-sm">{getLocalizedName(p, language)}</span>
                  <div className="flex gap-2 text-[11px] text-emerald mt-0.5 font-medium">
                    {language !== 'ur' && p.urdu_name && <span dir="rtl" lang="ur">{p.urdu_name}</span>}
                    {language !== 'hi' && p.hindi_name && <span>{p.hindi_name}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {search && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-ink/10 p-4 text-center text-sm text-ink/50 italic">
              {t('noPeopleFound')}
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button onClick={() => zoomIn()} className={controlBtnClass}><ZoomIn size={18}/></button>
          <button onClick={() => zoomOut()} className={controlBtnClass}><ZoomOut size={18}/></button>
          <button onClick={() => fitView()} className={controlBtnClass}><Maximize2 size={18}/></button>
          <button onClick={expandAll} className={controlBtnClass}><ChevronsUpDown size={18}/></button>
          <button onClick={collapseAll} className={controlBtnClass}><ChevronsDownUp size={18}/></button>
        </div>
        <div className="absolute inset-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            minZoom={0.1}
          >
            <Background color="#2d6a4f30" gap={22} variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
      </div>
      <PersonDetailsPanel 
        person={selectedPerson} 
        father={selectedFather} 
        childrenCount={allPeople.filter(p => p.father_id === selectedId).length}
        onClose={() => setSelectedId("")}
        allPeople={allPeople}
        onUpdated={onPersonUpdated}
      />
    </div>
  );
}

export default function TreeView({ rootNode, allPeople, canEdit, onAddNode, onPersonUpdated }: { rootNode: DisplayTreeNode | null, allPeople: Person[], canEdit?: boolean, onAddNode?: (id: string) => void, onPersonUpdated?: () => void }) {
  return (
    <div className="w-full h-full bg-paper rounded-xl overflow-hidden border border-ink/8 relative shadow-inner">
      <ReactFlowProvider>
        <TreeViewInner rootNode={rootNode} allPeople={allPeople} canEdit={canEdit} onAddNode={onAddNode} onPersonUpdated={onPersonUpdated} />
      </ReactFlowProvider>
    </div>
  );
}
