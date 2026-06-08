import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ConfidenceBadge, VerificationBadge } from "../components/ConfidenceBadge";
import TreeView from "../components/TreeView";
import { buildVillageDisplayTree } from "../data/familyTrees";
import NotFoundPage from "./NotFoundPage";

export default function VillagePage() {
  const { slug } = useParams();
  const displayTree = slug ? buildVillageDisplayTree(slug) : null;

  if (!displayTree) {
    return <NotFoundPage />;
  }

  const { village } = displayTree;
  return (
    <main className="min-h-screen lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
      <section className="shrink-0 border-b border-ink/10 bg-white/55">
        <div className="px-2 py-2 md:px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md px-1 py-1 text-xs font-semibold text-cedar transition hover:text-madder focus:outline-none focus:ring-2 focus:ring-cedar md:text-sm"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            <span>All villages</span>
          </Link>
          <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <ConfidenceBadge confidence={village.confidence} />
                <VerificationBadge confidence={village.confidence} />
              </div>
              <h1 className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl font-semibold leading-tight text-ink md:text-3xl">
                <span>{village.name}</span>
                <span className="text-xl font-medium leading-7 text-cedar md:text-2xl" lang="ur" dir="rtl">
                  {village.urduName}
                </span>
              </h1>
              <p className="mt-1 max-w-5xl text-xs leading-5 text-ink/70">
                {village.notes}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-0 px-2 py-2 md:px-3 lg:flex-1">
        <TreeView displayTree={displayTree} />
      </section>
    </main>
  );
}
