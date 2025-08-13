
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, Globe } from 'lucide-react';
import { languages, currencies, type Language, type Currency } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/context/locale-provider';
import { toast } from '@/hooks/use-toast';

interface LanguageCurrencySelectorProps {
  isMobile?: boolean;
  isFooter?: boolean;
}

export default function LanguageCurrencySelector({ isMobile = false, isFooter = false }: LanguageCurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, currency, setCurrency } = useLocale();

  const handleLangSelect = useCallback((lang: Language) => {
    setLanguage(lang);
    toast({ title: "Language Updated", description: `Language set to ${lang.name}.` });
  }, [setLanguage]);

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setCurrency(currency);
    toast({ title: "Currency Updated", description: `Currency set to ${currency.name} (${currency.code}).` });
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isFooter ? (
            <button className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors text-left w-full">Language & Currency</button>
        ) : (
            <Button variant={isMobile ? "ghost" : "ghost"} size={isMobile ? "default" : "icon"} className={cn("h-9 w-9 text-muted-foreground", isMobile && "w-full justify-start gap-2 p-2 h-auto text-base")}>
                {triggerContent}
                {isMobile && "Language & Currency"}
            </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80" align={isFooter ? "start" : "end"} side={isFooter ? "top" : "bottom"}>
        <div className="p-2">
            <h4 className="font-medium text-sm text-foreground">Language & Currency</h4>
            <p className="text-xs text-muted-foreground">Choose your preferred language and currency.</p>
        </div>
        <Tabs defaultValue="language">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
          </TabsList>
          <TabsContent value="language">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang) => (
                    <CommandItem
                      key={lang.code}
                      value={lang.name}
                      onSelect={() => {
                        handleLangSelect(lang);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", language.code === lang.code ? "opacity-100" : "opacity-0")} />
                      {lang.nativeName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>
          <TabsContent value="currency">
            <Command>
              <CommandInput placeholder="Search currency..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {currencies.map((curr) => (
                    <CommandItem
                      key={curr.code}
                      value={curr.name}
                      onSelect={() => {
                        handleCurrencySelect(curr);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", currency.code === curr.code ? "opacity-100" : "opacity-0")} />
                      <span className="font-mono text-xs w-10">{curr.code}</span>
                      <span>{curr.name} ({curr.symbol})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
