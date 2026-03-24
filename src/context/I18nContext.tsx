"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../i18n/locales/en';
import { es } from '../i18n/locales/es';

type Language = 'es' | 'en';
type Translations = typeof es;

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

const dictionaries = {
  en,
  es
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language preference or default to 'es'
    const savedLang = localStorage.getItem('aura_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aura_language', lang);
  };

  const t = (key: keyof Translations): string => {
    return dictionaries[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
