// src/app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AccommodationSearchForm, { AccommodationSearchFormValues } from '@/components/search/accommodation-search-form';
import { allMockStays, type MockStay, mockRentalProperties } from '@/lib/mock-data'; // Use combined mock data
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Star, Search, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResultsDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredResults, setFilteredResults] = useState<MockStay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteriaSummary, setSearchCriteriaSummary] = useState<string>("Search Results");
  
  // Combine all searchable items into one array
  const allSearchableItems = [...allMockStays, ...mockRentalProperties];

  useEffect(() => {
    const performSearch = (params: URLSearchParams) => {
      setIsLoading(true);
      const destination = params.get('destination');
      const propertyType = params.get('propertyType') as AccommodationSearchFormValues['propertyType'];
      const adults = params.get('adults') ? parseInt(params.get('adults') as string, 10) : undefined;
      const mood = params.get('mood') as AccommodationSearchFormValues['mood'];
      const priceMax = params.get('priceMax') ? parseInt(params.get('priceMax') as string, 10) : undefined;
      
      let summaryParts = [];
      if (destination) summaryParts.push(`in ${destination}`);
      if (propertyType && propertyType !== "ANY") summaryParts.push(propertyType.toLowerCase() + "s");
      if (adults) summaryParts.push(`for ${adults} guest(s)`);
      if (mood && mood !== "ANY") summaryParts.push(`with a ${mood.toLowerCase()} vibe`);
      if (priceMax) summaryParts.push(`under $${priceMax}`);

      setSearchCriteriaSummary(summaryParts.length > 0 ? `Results ${summaryParts.join(', ')}` : "All Results");

      const results = allSearchableItems.filter(item => {
        let matches = true;
        if (destination && item.location && !item.location.toLowerCase().includes(destination.toLowerCase())) matches = false;
        if (adults && item.maxGuests && adults > item.maxGuests) matches = false;
        if (propertyType && propertyType !== "ANY" && item.type !== propertyType) matches = false;
        if (mood && mood !== "ANY" && item.moods && !item.moods.includes(mood)) matches = false;
        const itemPrice = item.pricePerNight || item.price || 0;
        if (priceMax && itemPrice > priceMax) matches = false;
        return matches;
      });

      setFilteredResults(results);
      if (params.toString()) {
          toast({ title: "Search Complete", description: `Found ${results.length} items matching your criteria.` });
      }
      setIsLoading(false);
    };

    if (searchParams) {
      performSearch(searchParams);
    }
  }, [searchParams]);

  const handleNewSearch = (values: AccommodationSearchFormValues) => {
    const queryParams = new URLSearchParams();
    if (values.destination) queryParams.set('destination', values.destination);
    // ... add all other parameters from the form
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Search className="h-8 w-8" />
            Global Search
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Search for Stays, Rentals, Activities, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AccommodationSearchForm onSearch={handleNewSearch} isResultsPage={true} />
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-headline font-semibold text-foreground mb-6">
          {searchCriteriaSummary} ({filteredResults.length} found)
        </h2>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <Search className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">No Results Found</p>
            <p className="text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group rounded-lg border-border hover:border-primary/50">
                <Link href={`/stays/${item.id}`} className="block">
                  <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      data-ai-hint={item.dataAiHint}
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    {item.isEcoFriendly && <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-700 border-green-300"><Leaf className="mr-1 h-3 w-3"/>Eco-Friendly</Badge>}
                  </div>
                </Link>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                    <Link href={`/stays/${item.id}`}>{item.name}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-xs pt-0.5">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> {item.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-2">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xl font-bold text-primary">
                      ${item.pricePerNight || item.price}
                      <span className="text-xs font-normal text-muted-foreground"> {item.price ? '/month' : '/night'}</span>
                    </p>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-md">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-foreground">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-3 bg-muted/30 rounded-b-lg">
                  <Button asChild className="w-full">
                    <Link href={`/stays/${item.id}`}>View Details</Link>
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

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading search page...</div>}>
            <SearchResultsDisplay />
        </Suspense>
    );
}
