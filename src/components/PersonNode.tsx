import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { GitBranch, UserRound } from "lucide-react";
import type { Person } from "../types";
import { ConfidenceBadge, VerificationBadge } from "./ConfidenceBadge";

export type PersonNodeData = {
  person: Person;
  childrenCount: number;
  isCollapsed: boolean;
  isDimmed: boolean;
  isMatch: boolean;
};

export type PersonFlowNode = Node<PersonNodeData, "person">;

export default function PersonNode({ data, selected }: NodeProps<PersonFlowNode>) {
  const confidence = data.person.source?.confidence ?? "low";

  return (
    <div
      role="button"
      aria-label={`Open details for ${data.person.name}`}
      className={[
        "group relative w-64 rounded-lg border bg-white px-4 py-3 text-left shadow-archival transition",
        selected ? "border-madder ring-2 ring-madder/20" : "border-ink/12",
        data.isMatch ? "outline outline-2 outline-brass" : "",
        data.isDimmed ? "opacity-40" : "opacity-100"
      ].join(" ")}
    >
      <Handle
        className="!h-2 !w-2 !border-0 !bg-cedar/70"
        type="target"
        position={Position.Top}
      />
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-cedar">
          {data.person.isPlaceholder ? (
            <GitBranch aria-hidden="true" size={18} />
          ) : (
            <UserRound aria-hidden="true" size={18} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold leading-5 text-ink">
            {data.person.name}
          </p>
          {data.person.urduName ? (
            <p className="mt-1 break-words text-sm leading-6 text-cedar" lang="ur" dir="rtl">
              {data.person.urduName}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceBadge confidence={confidence} compact />
        {data.person.isPlaceholder ? (
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.68rem] font-semibold text-ink/70">
            Branch
          </span>
        ) : data.person.generation ? (
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[0.68rem] font-semibold text-ink/70">
            Gen {data.person.generation}
          </span>
        ) : null}
        {data.childrenCount > 0 ? (
          <span className="rounded-full bg-cedar/10 px-2 py-0.5 text-[0.68rem] font-semibold text-cedar">
            {data.childrenCount} child{data.childrenCount === 1 ? "" : "ren"}
          </span>
        ) : null}
        {data.isCollapsed ? (
          <span className="rounded-full bg-madder/10 px-2 py-0.5 text-[0.68rem] font-semibold text-madder">
            Collapsed
          </span>
        ) : null}
      </div>
      <div className="mt-2">
        <VerificationBadge confidence={confidence} />
      </div>
      <Handle
        className="!h-2 !w-2 !border-0 !bg-cedar/70"
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}
