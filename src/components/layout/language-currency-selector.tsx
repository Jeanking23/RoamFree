
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Check, X } from 'lucide-react';
import { languages, currencies, type Language, type Currency } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/context/locale-provider';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LanguageCurrencySelectorProps {
  isMobile?: boolean;
  isFooter?: boolean;
}

// Helper to convert country code to flag emoji
const toFlag = (countryCode: string) => {
  if (countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const suggestedLanguages = languages.filter(l => ['en-US', 'es-ES', 'fr-FR', 'ru-RU', 'ja-JP', 'zh-CN'].includes(l.code));

export default function LanguageCurrencySelector({ isMobile = false, isFooter = false }: LanguageCurrencySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { language, setLanguage, currency, setCurrency } = useLocale();

  const handleLangSelect = React.useCallback((lang: Language) => {
    setLanguage(lang);
    toast({ title: "Language Updated", description: `Language set to ${lang.name}.` });
    setOpen(false);
  }, [setLanguage]);

  const handleCurrencySelect = React.useCallback((currency: Currency) => {
    setCurrency(currency);
    toast({ title: "Currency Updated", description: `Currency set to ${currency.name} (${currency.code}).` });
    setOpen(false);
  }, [setCurrency]);

  const triggerContent = isFooter ? (
    <span className="text-sm hover:text-primary hover:underline transition-colors cursor-pointer">
      Language & Currency
    </span>
  ) : (
    <>
      <Globe className="h-5 w-5" />
      <span className="sr-only">Select Language & Currency</span>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isFooter ? (
            <button className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors text-left w-full">Language & Currency</button>
        ) : (
            <Button variant={isMobile ? "ghost" : "ghost"} size={isMobile ? "default" : "icon"} className={cn("h-9 w-9 text-muted-foreground", isMobile && "w-full justify-start gap-2 p-2 h-auto text-base")}>
                {triggerContent}
                {isMobile && "Language & Currency"}
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-2xl">Select your language & currency</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            <Tabs defaultValue="language" className="flex h-full">
                <TabsList className="flex flex-col h-full w-48 p-2 border-r bg-muted/50 rounded-none">
                    <TabsTrigger value="language" className="w-full justify-start text-base py-2">Language</TabsTrigger>
                    <TabsTrigger value="currency" className="w-full justify-start text-base py-2">Currency</TabsTrigger>
                </TabsList>

                <TabsContent value="language" className="flex-1 overflow-hidden m-0">
                   <ScrollArea className="h-full">
                     <div className="p-6">
                        <h3 className="font-semibold text-foreground mb-4">Suggested for you</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {suggestedLanguages.map(lang => (
                                <button key={lang.code} onClick={() => handleLangSelect(lang)} className={cn("p-3 border rounded-md text-left hover:bg-muted transition-colors flex items-center gap-3", language.code === lang.code && "border-primary ring-2 ring-primary")}>
                                     <span className="text-2xl">{toFlag(lang.countryCode)}</span>
                                     <span className="font-medium">{lang.nativeName}</span>
                                </button>
                            ))}
                        </div>
                        <h3 className="font-semibold text-foreground mb-4">All languages</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             {languages.map(lang => (
                                <button key={lang.code} onClick={() => handleLangSelect(lang)} className={cn("p-3 border rounded-md text-left hover:bg-muted transition-colors flex items-center gap-3", language.code === lang.code && "border-primary ring-2 ring-primary")}>
                                     <span className="text-2xl">{toFlag(lang.countryCode)}</span>
                                     <span className="font-medium">{lang.nativeName}</span>
                                </button>
                            ))}
                        </div>
                     </div>
                   </ScrollArea>
                </TabsContent>

                <TabsContent value="currency" className="flex-1 overflow-hidden m-0">
                   <ScrollArea className="h-full">
                    <div className="p-6">
                        <Command className="bg-transparent">
                            <CommandInput placeholder="Search currency..." />
                            <CommandList className="max-h-full">
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                {currencies.map((curr) => (
                                    <CommandItem
                                    key={curr.code}
                                    value={`${curr.name} ${curr.code}`}
                                    onSelect={() => handleCurrencySelect(curr)}
                                    className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs w-10">{curr.code}</span>
                                            <span>{curr.name} ({curr.symbol})</span>
                                        </div>
                                        <Check className={cn("h-4 w-4", currency.code === curr.code ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                   </ScrollArea>
                </TabsContent>
            </Tabs>
          </div>
      </DialogContent>
    </Dialog>
  );
}
