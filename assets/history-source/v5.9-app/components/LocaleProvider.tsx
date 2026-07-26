"use client";

import { createContext, useContext, useEffect, useState, ReactNode, ReactElement } from "react";

export type Locale = "original" | "ko" | "ja" | "es" | "fr";
const LOCALE_KEY = "duoduo-interface-locale";

// A single translatable string. `en`/`zh` are the source bilingual pair shown
// for the "original" locale; `ko`/`ja`/`es`/`fr` are full translations.
export type Entry = { en: string; zh: string; ko: string; ja: string; es: string; fr: string };

const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "original",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("original");

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved) setLocaleState(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCALE_KEY && e.newValue) setLocaleState(e.newValue as Locale);
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<Locale>).detail;
      if (detail) setLocaleState(detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("duoduo-locale-change", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("duoduo-locale-change", onCustom as EventListener);
    };
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(LOCALE_KEY, l);
    document.documentElement.lang = l === "original" ? "zh-CN" : l;
    window.dispatchEvent(new CustomEvent<Locale>("duoduo-locale-change", { detail: l }));
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useLocaleText() {
  const { locale } = useLocale();
  return (entry: Entry, original: "en" | "zh" = "en") => {
    if (locale === "original") return entry[original] || entry[original === "en" ? "zh" : "en"];
    return entry[locale] || entry.en || entry.zh;
  };
}

// Renders a translated string. For "original" it shows the bilingual EN + ZH
// (ZH as a secondary emphasis); for other locales it shows that language only.
export function T({ entry, em = false }: { entry: Entry; em?: boolean }): ReactElement {
  const { locale } = useLocale();
  if (locale === "original") {
    return em ? (
      <>
        {entry.en}
        <em>{entry.zh}</em>
      </>
    ) : (
      <>
        {entry.en} <em>{entry.zh}</em>
      </>
    );
  }
  return <>{entry[locale] || entry.en || entry.zh}</>;
}

// A block-friendly bilingual pair for body copy. The original site mode keeps
// both Chinese and English visible; translated modes show only that language.
export function BilingualText({
  entry,
  primary = "zh",
  className = "",
}: {
  entry: Entry;
  primary?: "en" | "zh";
  className?: string;
}): ReactElement {
  const { locale } = useLocale();
  if (locale !== "original") {
    return <span className={className}>{entry[locale] || entry.en || entry.zh}</span>;
  }
  const secondary = primary === "zh" ? "en" : "zh";
  return (
    <span className={`bilingual-pair ${className}`.trim()}>
      <span className="bilingual-primary">{entry[primary] || entry[secondary]}</span>
      {entry[secondary] && <span className="bilingual-translation">{entry[secondary]}</span>}
    </span>
  );
}
