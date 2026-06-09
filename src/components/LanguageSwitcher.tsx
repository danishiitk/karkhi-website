import { useLanguage } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "ur", label: "اردو" }
  ] as const;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink/80 hover:text-ink hover:bg-ink/5 rounded-full transition-colors"
      >
        <Globe size={16} />
        {languages.find(l => l.code === language)?.label}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-ink/10 rounded-xl shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? 'bg-cedar/10 text-cedar font-medium' : 'hover:bg-ink/5 text-ink/80'}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
