
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Star, Search, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { allMockStays, type MockStay } from '@/lib/mock-data';
import type { AccommodationSearchFormValues } from '@/components/search/accommodation-search-form';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [displayedStays, setDisplayedStays] = useState<MockStay[]>(allMockStays.slice(0, 6));
  const [noResults, setNoResults] = useState(false);
  const [activeFiltersSummary, setActiveFiltersSummary] = useState<string>("Featured Stays");

  const handleAccommodationSearch = useCallback((filters: Partial<AccommodationSearchFormValues>) => {
    setNoResults(false);
    let currentSummary = "Search Results";

    if (filters.propertyType && filters.propertyType !== "ANY" && Object.keys(filters).length === 1) {
        currentSummary = `${filters.propertyType}s`;
    } else if (filters.mood && filters.mood !== "ANY" && Object.keys(filters).length === 1) {
        currentSummary = `Stays with a ${filters.mood} Vibe`;
    } else if (filters.destination && Object.keys(filters).length <= 2) { 
        currentSummary = `Stays in ${filters.destination}`;
        if(filters.propertyType && filters.propertyType !== "ANY") currentSummary += ` (${filters.propertyType}s)`;
    }

    let results = allMockStays.filter(stay => {
      let matches = true;
      if (filters.destination) matches = matches && stay.location.toLowerCase().includes(filters.destination.toLowerCase());
      const totalGuests = (filters.adults || 0) + (filters.children || 0);
      if (filters.adults && stay.maxGuests && totalGuests > stay.maxGuests) matches = false;
      if (filters.propertyType && filters.propertyType !== "ANY") matches = matches && stay.type === filters.propertyType;
      if (filters.mood && filters.mood !== "ANY" && stay.moods) matches = matches && stay.moods.includes(filters.mood as "Peaceful" | "Romantic" | "Adventurous");
      if (filters.wheelchairAccessible && !stay.isWheelchairAccessible) matches = false;
      if (filters.ecoFriendly && !stay.isEcoFriendly) matches = false;
      return matches;
    });

    if (results.length === 0) {
      setNoResults(true);
      currentSummary = "No Stays Found Matching Your Criteria";
    }
    setDisplayedStays(results);
    setActiveFiltersSummary(currentSummary);
    
    const staysSection = document.getElementById('stays-section');
    if (staysSection) staysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if(Object.keys(filters).length > 0 || results.length === 0) {
        toast({title: "Search Complete", description: `${results.length} stays found for "${currentSummary}".`});
    }
  }, []);
  
  const resetAndShowAllStays = () => {
    setDisplayedStays(allMockStays.slice(0, 12)); 
    setNoResults(false);
    setActiveFiltersSummary("All Stays");
    const staysSection = document.getElementById('stays-section');
    if (staysSection) staysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-16 md:space-y-20">
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-md -mx-4 px-4 md:mx-0 md:px-0">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6 leading-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Discover amazing places to stay for your next adventure, from cozy cabins to luxury villas.
          </p>
          <div className="max-w-4xl mx-auto bg-card p-4 md:p-6 rounded-xl shadow-xl border">
            <AccommodationSearchForm onSearch={handleAccommodationSearch} />
          </div>
        </div>
      </section>

      <section id="stays-section" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground flex items-center mb-3 sm:mb-0">
            <BedDouble className="mr-3 h-7 w-7 text-primary" />
            {activeFiltersSummary}
          </h2>
           <Button variant="link" asChild className="text-primary hover:text-primary/80 text-md" onClick={resetAndShowAllStays}>
              <Link href="#stays-section">View All Stays &rarr;</Link>
            </Button>
        </div>
        {noResults ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg shadow-sm">
            <Search className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">No Stays Found</p>
            <p className="text-muted-foreground mb-4">Try adjusting your search filters or view all available stays.</p>
            <Button onClick={resetAndShowAllStays} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Clear Search & View All</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group rounded-lg border-border hover:border-primary/50">
                <Link href={`/stays/${stay.id}`} className="block">
                  <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={stay.dataAiHint}
                      className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                     <Badge variant={stay.isEcoFriendly ? "default" : "secondary"} className={`absolute top-2 right-2 ${stay.isEcoFriendly ? 'bg-green-600 border-green-700 text-white' : ''}`}>
                      {stay.isEcoFriendly && <Leaf className="mr-1 h-3 w-3" />}
                      {stay.category}
                    </Badge>
                  </div>
                </Link>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                    <Link href={`/stays/${stay.id}`}>{stay.name}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs pt-0.5">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> {stay.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-2">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xl font-bold text-primary">
                      ${stay.pricePerNight}
                      <span className="text-xs font-normal text-muted-foreground"> / night</span>
                    </p>
                    {stay.rating && (
                      <div className="flex items-center gap-1 text-md">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-foreground">{stay.rating}</span>
                      </div>
                    )}
                  </div>
                  {stay.moods && stay.moods.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stay.moods.map(mood => <Badge key={mood} variant="outline" className="text-xs px-1.5 py-0.5">{mood}</Badge>)}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3 bg-muted/30 rounded-b-lg">
                  <Button asChild className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium py-2.5 text-sm rounded-md shadow-sm hover:shadow-md transition-all">
                    <Link href={`/stays/${stay.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
