
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { languages, currencies, type Language, type Currency } from '@/lib/locales';

// Default values, will be used on server and for the initial client render
const defaultLanguage = languages[0];
const defaultCurrency = currencies.find(c => c.code === 'USD') || currencies[0];

interface LocaleContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isLocaleLoaded: boolean; // Add a flag to track client-side loading
}

const LocaleContext = createContext<LocaleContextType>({
    language: defaultLanguage,
    setLanguage: () => {},
    currency: defaultCurrency,
    setCurrency: () => {},
    isLocaleLoaded: false, // Default to false
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render (hydration).
    // Now we can safely access localStorage.
    try {
        const storedLangCode = localStorage.getItem('roamfree-lang');
        const storedCurrencyCode = localStorage.getItem('roamfree-currency');

        if (storedLangCode) {
          const foundLang = languages.find(l => l.code === storedLangCode);
          if (foundLang) setLanguage(foundLang);
        }

        if (storedCurrencyCode) {
          const foundCurrency = currencies.find(c => c.code === storedCurrencyCode);
          if (foundCurrency) setCurrency(foundCurrency);
        }
    } catch (error) {
        console.error("Could not access localStorage:", error);
    } finally {
        // Mark that we have attempted to load from localStorage.
        setIsLocaleLoaded(true);
    }
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    try {
        localStorage.setItem('roamfree-lang', lang.code);
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
  }, []);

  const handleSetCurrency = useCallback((curr: Currency) => {
    setCurrency(curr);
    try {
        localStorage.setItem('roamfree-currency', curr.code);
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
  }, []);

  const value = { language, setLanguage: handleSetLanguage, currency, setCurrency: handleSetCurrency, isLocaleLoaded };
  
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
