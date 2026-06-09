import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../lib/translations";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ur", label: "اردو" },
  { code: "hi", label: "हिं" }
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded-lg bg-white/8 p-0.5 border border-white/8">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
            language === lang.code
              ? "bg-cedar/90 text-onyx shadow-sm"
              : "text-white/40 hover:text-white/70 hover:bg-white/5"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
