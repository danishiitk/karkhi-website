import { Language } from "../contexts/LanguageContext";

export type Localizable = {
  name: string;
  urdu_name?: string | null;
  hindi_name?: string | null;
};

export function getLocalizedName(entity: Localizable | undefined | null, lang: Language): string {
  if (!entity) return "Unknown";
  
  if (lang === "hi" && entity.hindi_name) {
    return entity.hindi_name;
  }
  if (lang === "ur" && entity.urdu_name) {
    return entity.urdu_name;
  }
  return entity.name;
}
