import type { Confidence } from "../types";

const confidenceStyles: Record<Confidence, string> = {
  high: "border-cedar/25 bg-cedar/10 text-cedar",
  medium: "border-brass/30 bg-brass/15 text-cedar",
  low: "border-madder/30 bg-madder/10 text-madder"
};

type ConfidenceBadgeProps = {
  confidence: Confidence;
  compact?: boolean;
};

export function ConfidenceBadge({ confidence, compact = false }: ConfidenceBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-normal",
        confidenceStyles[confidence],
        compact ? "px-2 py-0.5 text-[0.62rem]" : "px-3 py-1 text-xs"
      ].join(" ")}
    >
      {confidence}
    </span>
  );
}

export function VerificationBadge({ confidence }: { confidence: Confidence }) {
  if (confidence === "high") {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded-full border border-madder/30 bg-madder/10 px-2.5 py-1 text-xs font-semibold text-madder">
      Data needs verification
    </span>
  );
}
