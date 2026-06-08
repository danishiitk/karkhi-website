import {
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type NodeTypes
} from "@xyflow/react";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Maximize2,
  Search,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getChildren,
  getPersonById,
  type DisplayTreeNode,
  type Person,
  type VillageDisplayTree
} from "../data/familyTrees";
import PersonDetailsPanel from "./PersonDetailsPanel";
import PersonNode, { type PersonFlowNode } from "./PersonNode";

const nodeTypes: NodeTypes = {
  person: PersonNode
};

type PositionedPerson = {
  person: Person;
  x: number;
  y: number;
  hiddenChildrenCount: number;
};

type TreeViewProps = {
  displayTree: VillageDisplayTree;
};

const horizontalSpacing = 300;
const verticalSpacing = 172;

function getAllTreeIds(node: DisplayTreeNode): string[] {
  return [node.id, ...node.children.flatMap(getAllTreeIds)];
}

function getExpandableIds(node: DisplayTreeNode): string[] {
  return [
    ...(node.children.length > 0 ? [node.id] : []),
    ...node.children.flatMap(getExpandableIds)
  ];
}

function hasSearchMatch(person: Person, query: string): boolean {
  if (!query) {
    return true;
  }

  const searchText = `${person.name} ${person.urduName ?? ""}`.toLowerCase();
  return searchText.includes(query);
}

function getLineage(person: Person | null): Person[] {
  const lineage: Person[] = person ? [person] : [];
  let currentFatherId = person?.fatherId;

  while (currentFatherId) {
    const ancestor = getPersonById(currentFatherId);
    if (!ancestor) {
      break;
    }

    lineage.push(ancestor);
    currentFatherId = ancestor.fatherId;
  }

  return lineage;
}

function createLayout(
  root: DisplayTreeNode,
  collapsedIds: Set<string>,
  searchQuery: string
) {
  const positions: PositionedPerson[] = [];
  let leafIndex = 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchIsActive = normalizedQuery.length > 0;

  const walk = (node: DisplayTreeNode, depth: number): number => {
    const isCollapsed = collapsedIds.has(node.id) && !searchIsActive;
    const visibleChildren = isCollapsed ? [] : node.children;

    if (visibleChildren.length === 0) {
      const x = leafIndex * horizontalSpacing;
      leafIndex += 1;
      positions.push({
        person: node,
        x,
        y: depth * verticalSpacing,
        hiddenChildrenCount: isCollapsed ? node.children.length : 0
      });
      return x;
    }

    const childXPositions = visibleChildren.map((child) => walk(child, depth + 1));
    const x = childXPositions.reduce((total, childX) => total + childX, 0) / childXPositions.length;
    positions.push({
      person: node,
      x,
      y: depth * verticalSpacing,
      hiddenChildrenCount: 0
    });
    return x;
  };

  walk(root, 0);

  const minX = Math.min(...positions.map((position) => position.x));
  const centered = positions.map((position) => ({
    ...position,
    x: position.x - minX
  }));

  return centered;
}

function TreeViewInner({ displayTree }: TreeViewProps) {
  const [selectedId, setSelectedId] = useState(displayTree.root.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    setSelectedId(displayTree.root.id);
    setSearchQuery("");
    setCollapsedIds(new Set());
  }, [displayTree.root.id]);

  const allIds = useMemo(() => getAllTreeIds(displayTree.root), [displayTree.root]);
  const expandableIds = useMemo(() => getExpandableIds(displayTree.root), [displayTree.root]);
  const activeQuery = searchQuery.trim().toLowerCase();

  const visiblePositions = useMemo(
    () => createLayout(displayTree.root, collapsedIds, searchQuery),
    [collapsedIds, displayTree.root, searchQuery]
  );

  const visibleIds = useMemo(
    () => new Set(visiblePositions.map((position) => position.person.id)),
    [visiblePositions]
  );

  const nodes = useMemo<PersonFlowNode[]>(() => {
    return visiblePositions.map((position) => {
      const isMatch = activeQuery ? hasSearchMatch(position.person, activeQuery) : false;
      const hasAnyMatch =
        !activeQuery ||
        allIds.some((id) => {
          const person = getPersonById(id);
          if (!person) {
            return false;
          }
          const searchText = `${person.name} ${person.urduName ?? ""}`.toLowerCase();
          return searchText.includes(activeQuery);
        });

      return {
        id: position.person.id,
        type: "person",
        position: {
          x: position.x,
          y: position.y
        },
        data: {
          person: position.person,
          childrenCount: getChildren(position.person.id).length,
          isCollapsed: position.hiddenChildrenCount > 0,
          isDimmed: Boolean(activeQuery && hasAnyMatch && !isMatch),
          isMatch
        }
      };
    });
  }, [activeQuery, allIds, visiblePositions]);

  const edges = useMemo<Edge[]>(() => {
    return nodes
      .filter((node) => node.data.person.fatherId && visibleIds.has(node.data.person.fatherId))
      .map((node) => ({
        id: `${node.data.person.fatherId}-${node.id}`,
        source: node.data.person.fatherId!,
        target: node.id,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#0369a1"
        },
        style: {
          stroke: "#0369a1",
          strokeWidth: 2.2
        }
      }));
  }, [nodes, visibleIds]);

  const selectedPerson = selectedId ? getPersonById(selectedId) ?? null : null;
  const selectedFather = selectedPerson?.fatherId ? getPersonById(selectedPerson.fatherId) ?? null : null;
  const selectedLineage = getLineage(selectedPerson);
  const selectedChildrenCount = selectedPerson ? getChildren(selectedPerson.id).length : 0;
  const isCollapsed = collapsedIds.size > 0;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fitView({ padding: 0.25, duration: 300 });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [fitView, nodes.length, searchQuery, collapsedIds]);

  const collapseAll = useCallback(() => {
    setCollapsedIds(new Set(expandableIds));
  }, [expandableIds]);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  return (
    <div className="grid gap-3 lg:h-full lg:grid-cols-[minmax(0,1fr)_24rem] 2xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-ink/10 bg-white/72 shadow-archival">
        <div className="flex flex-col gap-3 border-b border-ink/10 p-3 md:flex-row md:items-center md:justify-between">
          <label className="relative min-w-0 flex-1 md:max-w-sm">
            <span className="sr-only">Search people by name</span>
            <Search
              aria-hidden="true"
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/45"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search people"
              className="h-11 w-full rounded-md border border-ink/10 bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-cedar focus:ring-2 focus:ring-cedar/20"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => zoomIn({ duration: 200 })}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/10 bg-white text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-cedar"
            >
              <ZoomIn aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => zoomOut({ duration: 200 })}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/10 bg-white text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-cedar"
            >
              <ZoomOut aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label="Fit view"
              title="Fit view"
              onClick={() => fitView({ padding: 0.25, duration: 300 })}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/10 bg-white text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-cedar"
            >
              <Maximize2 aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label={isCollapsed ? "Expand all" : "Collapse all"}
              title={isCollapsed ? "Expand all" : "Collapse all"}
              onClick={isCollapsed ? expandAll : collapseAll}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/10 bg-white text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-cedar"
            >
              {isCollapsed ? (
                <ChevronsUpDown aria-hidden="true" size={18} />
              ) : (
                <ChevronsDownUp aria-hidden="true" size={18} />
              )}
            </button>
          </div>
        </div>
        <div className="h-[34rem] min-h-[30rem] w-full lg:h-auto lg:min-h-0 lg:flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.28}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            onNodeClick={(_, node) => setSelectedId(node.id)}
          >
            <Background color="#bfdbfe" gap={22} size={1.5} variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
      </section>
      <PersonDetailsPanel
        person={selectedPerson}
        father={selectedFather}
        childrenCount={selectedChildrenCount}
        lineage={selectedLineage}
        onClose={() => setSelectedId("")}
      />
    </div>
  );
}

export default function TreeView({ displayTree }: TreeViewProps) {
  return (
    <ReactFlowProvider>
      <TreeViewInner displayTree={displayTree} />
    </ReactFlowProvider>
  );
}
