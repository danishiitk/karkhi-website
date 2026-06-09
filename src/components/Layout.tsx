import { LogIn, LogOut, Search, Shield, TreePine } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { searchPeople, enrichSearchResults, type SearchResult } from "../lib/queries";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoadingSuggestions(true);
      searchPeople(query)
        .then(enrichSearchResults)
        .then(res => {
          setSuggestions(res.slice(0, 8));
          setShowDropdown(true);
        })
        .catch(console.error)
        .finally(() => setLoadingSuggestions(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-cedar transition hover:text-cedar/80">
            <TreePine size={24} />
            <span className="hidden text-sm font-bold sm:inline">Sheikh Hasan</span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 md:flex">
            <Link to="/" className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive("/") ? "bg-cedar/10 text-cedar" : "text-ink/60 hover:bg-ink/5 hover:text-ink"}`}>{t('home')}</Link>
          </nav>

          <form ref={searchRef} onSubmit={handleSearch} className="relative ml-auto flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" />
            <input
              type="search"
              placeholder={t('searchPeople')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              className="h-10 w-full rounded-full border border-ink/10 bg-ink/5 pl-9 pr-4 text-sm outline-none transition focus:border-cedar focus:bg-white focus:ring-2 focus:ring-cedar/20"
            />
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-ink/10 rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                {loadingSuggestions ? (
                  <div className="p-4 text-center text-sm text-ink/50">Searching...</div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map(person => (
                      <li key={person.id}>
                        <Link 
                          to={`/village/${person.village_id}?view=lineage&select=${person.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-3 hover:bg-ink/5 border-b border-ink/5 last:border-0 transition"
                        >
                          <div className="font-medium text-sm text-ink flex items-center justify-between">
                            <span>{person.name}</span>
                            {person.urdu_name && <span className="text-cedar" dir="rtl" lang="ur">{person.urdu_name}</span>}
                          </div>
                          <div className="text-xs text-ink/60 mt-0.5">
                            {person.village_name} {person.father_name ? `• s/o ${person.father_name}` : ""}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-ink/50">No results found</div>
                )}
              </div>
            )}
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-madder hover:bg-madder/5 transition">
                <Shield size={18} />
                <span className="hidden sm:inline">{t('admin')}</span>
              </Link>
            )}

            {user ? (
              <button onClick={signOut} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 transition">
                <LogOut size={18} />
                <span className="hidden sm:inline">{t('signOut')}</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 rounded-lg bg-cedar px-4 py-2 text-sm font-medium text-white hover:bg-cedar/90 transition shadow-sm">
                <LogIn size={18} />
                <span className="hidden sm:inline">{t('signIn')}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
