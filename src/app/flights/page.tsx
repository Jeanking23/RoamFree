// src/app/flights/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import FlightSearchResults from '@/components/flights/flight-search-results';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plane, Search } from 'lucide-react';
import { format } from 'date-fns';

const FlightSearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [departureDate, setDepartureDate] = useState('');

  useEffect(() => {
    // Set default date on the client to avoid hydration mismatch
    setDepartureDate(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    const formData = new FormData(event.currentTarget);
    const origin = formData.get('origin');
    const destination = formData.get('destination');
    const departureDate = formData.get('departure-date');
    const returnDate = formData.get('return-date');
    const passengers = formData.get('passengers');
    const cabinClass = formData.get('cabin-class');

    console.log('Searching for flights with:', {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
    });
    
    // This is a demo. In a real app, you would fetch from an API.
    // For now, we'll just show a "no results" message after a delay.
    setTimeout(() => {
      // Simulating an API call that returns no results for this demo
      setSearchResults([]); 
      if (!origin || !destination) {
        setError("Please enter both origin and destination.");
      } else {
        setError(`No flights found for the selected route. This is a demo feature.`);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Search for Flights
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find the best deals on flights to your next destination.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Input type="text" id="origin" name="origin" placeholder="e.g., New York (JFK)" />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input type="text" id="destination" name="destination" placeholder="e.g., London (LHR)" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                <Label htmlFor="departure-date">Departure Date</Label>
                <Input 
                    type="date" 
                    id="departure-date" 
                    name="departure-date" 
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <Label htmlFor="return-date">Return Date (Optional)</Label>
                <Input type="date" id="return-date" name="return-date" min={departureDate} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Input type="number" id="passengers" name="passengers" min="1" defaultValue={1} />
              </div>
              <div>
                <Label htmlFor="cabin-class">Cabin Class</Label>
                <Select name="cabin-class" defaultValue="economy">
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              <span><Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Searching...' : 'Search Flights'}</span>
            </Button>
          </form>

          {isLoading && <p className="text-center mt-6">Loading search results...</p>}

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Search Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="mt-6">
              <FlightSearchResults results={searchResults} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightSearchPage;
