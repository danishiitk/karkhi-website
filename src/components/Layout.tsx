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
  const searchRef = useRef<HTMLDivElement>(null);

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
      <header className="sticky top-0 z-50 glass-dark border-b border-cedar/20">
        <div className="mx-auto flex flex-wrap md:flex-nowrap min-h-16 max-w-7xl items-center justify-between w-full px-4 md:px-6 py-2 gap-3">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 text-cedar transition hover:text-brass group order-1">
            <div className="w-8 h-8 rounded-lg bg-cedar/15 flex items-center justify-center group-hover:bg-cedar/25 transition">
              <TreePine size={18} className="text-cedar" />
            </div>
            <span className="hidden text-sm font-bold text-white/90 sm:inline tracking-wide">Hazrat Sheikh Hasan Baba</span>
          </Link>

          {/* Search Bar - Full width on mobile, auto on desktop */}
          <div className="w-full md:w-auto order-3 md:order-2 md:flex-1 md:max-w-md md:mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cedar/50 focus:bg-white/10 transition"
              />
            </form>
            {/* Dropdown for suggestions */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-onyx/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-2">
                {suggestions.map(s => (
                  <Link 
                    key={s.id} 
                    to={`/village/${s.village_slug}?view=lineage&select=${s.id}`}
                    onClick={() => { setShowDropdown(false); setSearchQuery(""); }}
                    className="flex flex-col px-4 py-2 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                  >
                    <span className="font-medium text-sm text-white/90">{s.name}</span>
                    <span className="text-xs text-white/50">{s.village_name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav & Actions */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar order-2 md:order-3 shrink-0 ml-auto md:ml-0">
            <nav className="flex items-center gap-1 shrink-0">
              <Link to="/" className={`px-2 py-1.5 text-sm font-medium transition rounded-lg ${isActive("/") ? "bg-cedar/15 text-cedar" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                {t('home')}
              </Link>
              <Link to="/about" className={`px-2 py-1.5 text-sm font-medium transition rounded-lg ${isActive("/about") ? "bg-cedar/15 text-cedar" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                {t('about')}
              </Link>
            </nav>

            <div className="w-px h-5 bg-white/10 shrink-0" />

            <div className="flex items-center gap-1.5 shrink-0">
              <LanguageSwitcher />
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-cedar hover:bg-cedar/10 transition">
                  <Shield size={16} />
                  <span className="hidden sm:inline">{t('admin')}</span>
                </Link>
              )}
              {user ? (
                <button onClick={signOut} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition" title={t('signOut')}>
                  <LogOut size={16} />
                  <span className="hidden sm:inline">{t('signOut')}</span>
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 rounded-lg bg-cedar/90 px-3 py-1.5 text-sm font-semibold text-onyx hover:bg-cedar transition shadow-sm">
                  <LogIn size={16} />
                  <span className="hidden sm:inline">{t('signIn')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Bottom gradient border */}
        <div className="h-px bg-gradient-to-r from-transparent via-cedar/40 to-transparent" />
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
