import { X } from "lucide-react";
import type { Person } from "../types";
import { ConfidenceBadge, VerificationBadge } from "./ConfidenceBadge";

type PersonDetailsPanelProps = {
  person: Person | null;
  father: Person | null;
  childrenCount: number;
  lineage: Person[];
  onClose: () => void;
};

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-b border-ink/10 py-3 last:border-0">
      <dt className="text-xs font-semibold uppercase text-ink/55">{label}</dt>
      <dd className="mt-1 break-words text-sm text-ink">{value}</dd>
    </div>
  );
}

export default function PersonDetailsPanel({
  person,
  father,
  childrenCount,
  lineage,
  onClose
}: PersonDetailsPanelProps) {
  if (!person) {
    return (
      <aside className="rounded-lg border border-ink/10 bg-white/82 p-5 shadow-archival lg:h-full">
        <p className="text-sm font-medium text-ink/70">Select a person to view details.</p>
      </aside>
    );
  }

  const confidence = person.source?.confidence ?? "low";
  const hasFamilyGeneration = !person.isPlaceholder && typeof person.generation === "number";

  return (
    <aside className="flex min-h-0 flex-col rounded-lg border border-ink/10 bg-white/88 shadow-archival lg:h-full">
      <div className="shrink-0 border-b border-ink/10 p-4">
        <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <ConfidenceBadge confidence={confidence} />
            <VerificationBadge confidence={confidence} />
          </div>
          <h2 className="mt-3 break-words text-lg font-semibold text-ink">{person.name}</h2>
          {person.urduName ? (
            <p className="mt-1 break-words text-lg leading-8 text-cedar" lang="ur" dir="rtl">
              {person.urduName}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Close details"
          title="Close details"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ink/10 text-ink transition hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-cedar"
        >
          <X aria-hidden="true" size={18} />
        </button>
        </div>
      </div>
      <dl className="min-h-0 overflow-y-auto p-4">
        {hasFamilyGeneration ? (
          <>
            <DetailRow label="Father" value={father?.name ?? "Unknown"} />
            <DetailRow label="Children count" value={childrenCount} />
            <div className="border-b border-ink/10 py-3">
              <dt className="text-xs font-semibold uppercase text-ink/55">Lineage</dt>
              <dd className="mt-2 text-sm text-ink">
                {lineage.length > 0 ? (
                  <ol className="flex flex-wrap items-center gap-1.5">
                    {lineage.map((ancestor, index) => (
                      <li key={ancestor.id} className="flex items-center gap-1.5">
                        <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-cedar">
                          {ancestor.name}
                        </span>
                        {index < lineage.length - 1 ? (
                          <span className="text-ink/35" aria-hidden="true">
                            &rarr;
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <span className="text-ink/60">No lineage recorded.</span>
                )}
              </dd>
            </div>
          </>
        ) : null}
        {person.isPlaceholder ? (
          <DetailRow label="Record type" value="Village branch" />
        ) : hasFamilyGeneration ? (
          <DetailRow label="Generation" value={person.generation ?? "Unknown"} />
        ) : (
          <DetailRow label="Record type" value="Ancestor context" />
        )}
        <DetailRow label="Source confidence" value={confidence} />
        <DetailRow label="Notes" value={person.notes ?? "No notes recorded yet."} />
      </dl>
    </aside>
  );
}
