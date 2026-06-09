import { GitBranch, LayoutList, Network, TableProperties } from "lucide-react";

export type ViewMode = "canvas" | "table" | "lineage" | "outline";

type ViewSwitcherProps = {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
  { mode: "canvas", label: "Canvas", icon: <Network size={16} /> },
  { mode: "table", label: "Table", icon: <TableProperties size={16} /> },
  { mode: "lineage", label: "Lineage", icon: <GitBranch size={16} /> },
  { mode: "outline", label: "Outline", icon: <LayoutList size={16} /> }
];

export default function ViewSwitcher({ current, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex rounded-xl bg-onyx/80 p-1 border border-white/10 backdrop-blur-sm">
      {views.map((v) => (
        <button
          key={v.mode}
          type="button"
          onClick={() => onChange(v.mode)}
          className={[
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200",
            current === v.mode
              ? "bg-cedar/90 text-onyx shadow-sm shadow-cedar/20"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
          ].join(" ")}
        >
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
