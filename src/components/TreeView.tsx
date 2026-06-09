import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, MarkerType, type NodeTypes, type EdgeTypes, type Node, type Edge, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PersonNode, { type PersonFlowNode } from "./PersonNode";
import PersonDetailsPanel from "./PersonDetailsPanel";
import type { DisplayTreeNode, Person } from "../types";
import { Maximize2, ZoomIn, ZoomOut, ChevronsUpDown, ChevronsDownUp } from "lucide-react";

import TreeEdge from "./TreeEdge";

const nodeTypes: NodeTypes = { person: PersonNode };
const edgeTypes: EdgeTypes = { tree: TreeEdge };

function getAllIds(node: DisplayTreeNode): string[] {
  return [node.id, ...node.children.flatMap(getAllIds)];
}

function TreeViewInner({ rootNode, allPeople, canEdit, onAddNode, onPersonUpdated }: { rootNode: DisplayTreeNode | null, allPeople: Person[], canEdit?: boolean, onAddNode?: (id: string) => void, onPersonUpdated?: () => void }) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>("");
  const { fitView, zoomIn, zoomOut } = useReactFlow();

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
    const timer = setTimeout(() => fitView({ padding: 0.2 }), 50);
    return () => clearTimeout(timer);
  }, [nodes.length, fitView]);

  const selectedPerson = useMemo(() => allPeople.find(p => p.id === selectedId) || null, [selectedId, allPeople]);
  const selectedFather = useMemo(() => allPeople.find(p => p.id === selectedPerson?.father_id) || null, [selectedPerson, allPeople]);

  if (!rootNode) return <div className="flex h-full items-center justify-center text-ink/50 font-medium">Tree empty.</div>;

  const controlBtnClass = "p-2 bg-onyx/80 backdrop-blur-sm rounded-lg shadow-glass border border-white/10 text-white/60 hover:text-emerald hover:bg-onyx transition-all";

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <div className="relative flex-1 bg-white rounded-xl border border-ink/8 shadow-sm overflow-hidden min-h-[500px]">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button onClick={() => zoomIn()} className={controlBtnClass}><ZoomIn size={18}/></button>
          <button onClick={() => zoomOut()} className={controlBtnClass}><ZoomOut size={18}/></button>
          <button onClick={() => fitView()} className={controlBtnClass}><Maximize2 size={18}/></button>
          <button onClick={expandAll} className={controlBtnClass}><ChevronsUpDown size={18}/></button>
          <button onClick={collapseAll} className={controlBtnClass}><ChevronsDownUp size={18}/></button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          fitView
          minZoom={0.1}
        >
          <Background color="#2d6a4f30" gap={22} variant={BackgroundVariant.Dots} />
        </ReactFlow>
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
