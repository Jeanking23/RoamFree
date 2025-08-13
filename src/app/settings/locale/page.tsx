// src/app/settings/locale/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, CheckCircle } from 'lucide-react';
import { useLocale } from '@/context/locale-provider';
import { languages, currencies, type Language, type Currency } from '@/lib/locales';
import { cn } from '@/lib/utils';

// Helper to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function LocaleSettingsPage() {
  const { language, setLanguage, currency, setCurrency, isLocaleLoaded } = useLocale();

  if (!isLocaleLoaded) {
    // Render a loading state or skeleton to avoid hydration mismatch
    return (
        <div className="space-y-8">
            <Card className="shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
                    <Globe className="h-10 w-10" />
                    Language & Currency
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                    Choose your preferred language and currency for the best experience on RoamFree.
                </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <p>Loading settings...</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Globe className="h-10 w-10" />
            Language & Currency
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Choose your preferred language and currency for the best experience on RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Language Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className={cn(
                    "h-auto p-4 flex flex-col items-center justify-center gap-2 text-center",
                    language.code === lang.code && "border-primary ring-2 ring-primary"
                  )}
                  onClick={() => setLanguage(lang)}
                >
                  <span className="text-4xl">{getFlagEmoji(lang.countryCode)}</span>
                  <span className="font-semibold">{lang.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                   {language.code === lang.code && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                </Button>
              ))}
            </div>
          </section>

          {/* Currency Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Currency</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currencies.map((curr) => (
                <Button
                  key={curr.code}
                  variant="outline"
                  className={cn(
                    "h-auto p-4 flex flex-col items-center justify-center gap-2 text-center relative",
                     currency.code === curr.code && "border-primary ring-2 ring-primary"
                  )}
                  onClick={() => setCurrency(curr)}
                >
                  <span className="text-3xl font-bold">{curr.symbol}</span>
                  <span className="font-semibold">{curr.code}</span>
                  <span className="text-xs text-muted-foreground">{curr.name}</span>
                  {currency.code === curr.code && <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />}
                </Button>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
