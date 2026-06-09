import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Village } from "../types";


export default function VillageCard({ village }: { village: Village }) {
  return (
    <Link to={`/village/${village.slug}`} className="group flex flex-col justify-between rounded-xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-archival hover:border-cedar/30 transition-all">
      <div>
        <h2 className="text-lg font-bold text-ink group-hover:text-cedar transition line-clamp-1">{village.name}</h2>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-ink/5 pt-2">
          {village.hindi_name && (
            <span className="text-sm font-medium text-ink/60 truncate">
              {village.hindi_name}
            </span>
          )}
          <span className="text-lg font-medium text-cedar/80 truncate text-right flex-1" lang="ur" dir="rtl">
            {village.urdu_name}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-cedar">
        <span className="uppercase tracking-wider">Explore</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
