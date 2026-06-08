import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { VillageTree } from "../types";
import { ConfidenceBadge, VerificationBadge } from "./ConfidenceBadge";

type VillageCardProps = {
  village: VillageTree;
};

export default function VillageCard({ village }: VillageCardProps) {
  return (
    <article className="flex min-h-56 flex-col justify-between rounded-lg border border-ink/10 bg-white/82 p-5 shadow-archival backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={village.confidence} />
          <VerificationBadge confidence={village.confidence} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">{village.name}</h2>
          <p className="mt-2 text-lg leading-8 text-cedar" lang="ur" dir="rtl">
            {village.urduName}
          </p>
        </div>
      </div>
      <Link
        to={`/village/${village.slug}`}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-cedar px-4 py-3 text-sm font-semibold text-white transition hover:bg-cedar/90 focus:outline-none focus:ring-2 focus:ring-cedar focus:ring-offset-2 focus:ring-offset-paper"
      >
        <span>View Tree</span>
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </article>
  );
}
