import { LogIn, LogOut, Search, Shield, TreePine, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <header className="sticky top-0 z-50 glass-dark border-b border-cedar/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between w-full px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 text-cedar transition hover:text-brass group">
            <div className="w-8 h-8 rounded-lg bg-cedar/15 flex items-center justify-center group-hover:bg-cedar/25 transition">
              <TreePine size={18} className="text-cedar" />
            </div>
            <span className="hidden text-sm font-bold text-white/90 sm:inline tracking-wide">Hazrat Sheikh Hasan Baba</span>
          </Link>

          {/* Desktop Nav & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/")
                    ? "bg-cedar/15 text-cedar"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {t('home')}
              </Link>
              <Link
                to="/about"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/about")
                    ? "bg-cedar/15 text-cedar"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {t('about')}
              </Link>
            </nav>

            <div className="w-px h-6 bg-white/10" />

            <div className="flex items-center gap-2 shrink-0">
              <LanguageSwitcher />
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cedar hover:bg-cedar/10 transition">
                  <Shield size={18} />
                  <span>{t('admin')}</span>
                </Link>
              )}

              {user ? (
                <button onClick={signOut} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition">
                  <LogOut size={18} />
                  <span>{t('signOut')}</span>
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2 rounded-lg bg-cedar/90 px-4 py-2 text-sm font-semibold text-onyx hover:bg-cedar transition shadow-sm">
                  <LogIn size={18} />
                  <span>{t('signIn')}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -mr-2 text-white/50 hover:text-white transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-onyx/95 backdrop-blur-md px-4 py-4 space-y-4 shadow-glass absolute left-0 right-0 top-full">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive("/")
                    ? "bg-cedar/15 text-cedar"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t('home')}
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive("/about")
                    ? "bg-cedar/15 text-cedar"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {t('about')}
              </Link>
            </nav>
            <div className="h-px bg-white/10" />
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-cedar hover:bg-cedar/10 transition">
                  <Shield size={18} />
                  <span>{t('admin')}</span>
                </Link>
              )}

              {user ? (
                <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition w-full text-left">
                  <LogOut size={18} />
                  <span>{t('signOut')}</span>
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-lg bg-cedar/90 px-4 py-3 text-sm font-semibold text-onyx hover:bg-cedar transition shadow-sm justify-center mt-2">
                  <LogIn size={18} />
                  <span>{t('signIn')}</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom gradient border */}
        <div className="h-px bg-gradient-to-r from-transparent via-cedar/40 to-transparent" />
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
