
// src/app/stays/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import AccommodationSearchForm, { type AccommodationSearchFormValues } from '@/components/search/accommodation-search-form';
import type { MockStay } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Star, Search, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getAllStays } from '@/services/stays';

function SearchResultsDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredStays, setFilteredStays] = useState<MockStay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteriaSummary, setSearchCriteriaSummary] = useState<string>("Search Results");

  const performSearch = useCallback(async (params: URLSearchParams) => {
    setIsLoading(true);
    const destination = params.get('destination');
    // const dateFrom = params.get('dateFrom');
    // const dateTo = params.get('dateTo');
    const adults = params.get('adults') ? parseInt(params.get('adults') as string, 10) : undefined;
    const children = params.get('children') ? parseInt(params.get('children') as string, 10) : undefined;
    // const rooms = params.get('rooms') ? parseInt(params.get('rooms') as string, 10) : undefined;
    const propertyType = params.get('propertyType') as AccommodationSearchFormValues['propertyType'];
    const mood = params.get('mood') as AccommodationSearchFormValues['mood'];
    const wheelchairAccessible = params.get('wheelchairAccessible') === 'true';
    const ecoFriendly = params.get('ecoFriendly') === 'true';
    const priceMax = params.get('priceMax') ? parseInt(params.get('priceMax') as string, 10) : undefined;

    let summaryParts = [];
    if (destination) summaryParts.push(`in ${destination}`);
    if (propertyType && propertyType !== "ANY") summaryParts.push(propertyType.toLowerCase() + "s");
    if (adults || children) summaryParts.push(`for ${ (adults || 0) + (children || 0)} guest(s)`);
    if (mood && mood !== "ANY") summaryParts.push(`with a ${mood.toLowerCase()} vibe`);
    if (wheelchairAccessible) summaryParts.push("accessible");
    if (ecoFriendly) summaryParts.push("eco-friendly");
    if (priceMax) summaryParts.push(`under $${priceMax}`);
    
    setSearchCriteriaSummary(summaryParts.length > 0 ? `Stays ${summaryParts.join(', ')}` : "All Stays");

    try {
      const allStays = await getAllStays();
      const results = allStays.filter(stay => {
        let matches = true;
        if (destination && stay.location) matches = matches && stay.location.toLowerCase().includes(destination.toLowerCase());
        if (adults && stay.maxGuests) {
          const totalGuests = adults + (children || 0);
          matches = matches && totalGuests <= stay.maxGuests;
        }
        if (propertyType && propertyType !== "ANY") matches = matches && stay.type === propertyType;
        if (mood && mood !== "ANY" && stay.moods) matches = matches && stay.moods.includes(mood);
        if (wheelchairAccessible && !stay.isWheelchairAccessible) matches = false;
        if (ecoFriendly && !stay.isEcoFriendly) matches = false;
        if (priceMax && stay.pricePerNight > priceMax) matches = false;
        // Date filtering would be more complex, involving parsing dateFrom and dateTo and checking availability.
        // For this mock, we'll skip date filtering on the results page.
        return matches;
      });

      setFilteredStays(results);
      if (params.toString()) { // Only toast if actual search params were provided
          toast({ title: "Search Complete", description: `Found ${results.length} stays matching your criteria.` });
      }
    } catch (error) {
       console.error("Failed to perform search:", error);
       toast({
          title: "Search Failed",
          description: "Could not fetch stay data. Please try again later.",
          variant: "destructive",
       });
       setFilteredStays([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchParams) {
      performSearch(searchParams);
    }
  }, [searchParams, performSearch]);

  const handleNewSearch = (values: AccommodationSearchFormValues) => {
    const query = new URLSearchParams();
    if (values.destination) query.set('destination', values.destination);
    if (values.dateRange?.from) query.set('dateFrom', values.dateRange.from.toISOString());
    if (values.dateRange?.to) query.set('dateTo', values.dateRange.to.toISOString());
    if (values.adults) query.set('adults', values.adults.toString());
    if (values.children) query.set('children', values.children.toString());
    if (values.rooms) query.set('rooms', values.rooms.toString());
    if (values.propertyType && values.propertyType !== "ANY") query.set('propertyType', values.propertyType);
    if (values.mood && values.mood !== "ANY") query.set('mood', values.mood);
    if (values.wheelchairAccessible) query.set('wheelchairAccessible', 'true');
    if (values.ecoFriendly) query.set('ecoFriendly', 'true');
    
    router.push(`/stays/search?${query.toString()}`);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading search results...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Search className="h-8 w-8" />
            Accommodation Search
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Refine your search or browse the results below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AccommodationSearchForm onSearch={handleNewSearch} isResultsPage={true} />
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-headline font-semibold text-foreground mb-6">
          {searchCriteriaSummary} ({filteredStays.length} found)
        </h2>
        {filteredStays.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Search className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">No Stays Found</p>
            <p className="text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group rounded-lg border-border hover:border-primary/50">
                <Link href={`/stays/${stay.id}`} className="block">
                  <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      fill
                      data-ai-hint={stay.dataAiHint}
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                     <Badge variant={stay.isEcoFriendly ? "default" : "secondary"} className={`absolute top-2 right-2 ${stay.isEcoFriendly ? 'bg-green-600 border-green-700 text-white' : 'bg-card/80 text-card-foreground/90 border-border'}`}>
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

export default function StaysSearchPage() {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading search page...</div>}>
            <SearchResultsDisplay />
        </Suspense>
    );
}
