import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Village } from "../types";


export default function VillageCard({ village }: { village: Village }) {
  return (
    <Link to={`/village/${village.slug}`} className="group relative flex flex-col justify-between rounded-xl border border-ink/8 bg-white p-5 shadow-sm hover:shadow-card-hover hover:border-cedar/30 transition-all duration-300 hover-lift card-ornament animate-fade-in-up overflow-hidden">
      {/* Subtle corner ornament */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <path d="M60 0L60 60L0 60" fill="none" stroke="#c9a84c" strokeWidth="1"/>
          <path d="M60 10L60 50L20 50" fill="none" stroke="#c9a84c" strokeWidth="0.5"/>
        </svg>
      </div>

      <div>
        <h2 className="text-lg font-serif font-bold text-ink group-hover:text-cedar transition line-clamp-1">{village.name}</h2>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink/5 pt-3">
          {village.hindi_name && (
            <span className="text-sm font-medium text-emerald truncate">
              {village.hindi_name}
            </span>
          )}
          <span className="text-lg font-medium text-emerald truncate text-right flex-1" lang="ur" dir="rtl">
            {village.urdu_name}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-cedar">
        <span className="uppercase tracking-widest">Explore</span>
        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
      </div>
    </Link>
  );
}
