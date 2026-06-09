import { Sparkles, Heart, GitMerge, BookOpen } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-hero-gradient relative py-12 px-5 md:px-8">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-width='0.5'%3E%3Cpath d='M40 0L80 40L40 80L0 40z'/%3E%3Cpath d='M40 10L70 40L40 70L10 40z'/%3E%3Cpath d='M40 20L60 40L40 60L20 40z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-cedar/10 px-4 py-1.5 text-xs font-semibold text-cedar tracking-wider uppercase mb-4 border border-cedar/20">
            <Sparkles size={14} />
            {t('about')}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-gradient mb-4 pb-2 leading-snug">
            {t('aboutTitle')}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up-delay-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <BookOpen className="text-cedar mb-4" size={28} />
            <h2 className="text-xl font-serif font-bold text-white/90 mb-2">{t('aboutMissionTitle')}</h2>
            <p className="text-white/60 leading-relaxed text-sm">
              {t('aboutMissionText')}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <GitMerge className="text-cedar mb-4" size={28} />
            <h2 className="text-xl font-serif font-bold text-white/90 mb-2">{t('aboutCollabTitle')}</h2>
            <p className="text-white/60 leading-relaxed text-sm">
              {t('aboutCollabText')}
            </p>
          </div>
        </div>

        <div className="mt-12 bg-cedar/10 border border-cedar/20 rounded-2xl p-8 text-center backdrop-blur-sm animate-fade-in-up-delay-2">
          <Heart className="text-madder mx-auto mb-4 animate-pulse" size={32} />
          <h2 className="text-2xl font-serif font-bold text-white/90 mb-2">{t('aboutDevTitle')}</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-4">
            {t('aboutDevText')}
          </p>
          <a href="mailto:danishahmadajaz2@gmail.com" className="inline-flex items-center gap-2 text-cedar hover:text-brass font-medium transition-colors">
            {t('aboutContact')}danishahmadajaz2@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
