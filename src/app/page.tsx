
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BedDouble, MapPin, Star, Lightbulb, Hotel, Building2, Home as HomeIconType, Bed, Search, History, TrendingUp, Sparkles, Waves, MountainSnow, Users, Percent, Clock, Bell, MessageSquare, UserCircle, LayoutDashboard, Heart, Award, Building as BuildingIconType, KeyRound, Landmark as LandmarkIconType, ClipboardList, Truck, CarFront as CarSaleIconType, Plane, TvIcon, Layers, School, Leaf, CheckCircle, CalendarDays, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { allMockStays, type MockStay } from '@/lib/mock-data';
import type { AccommodationSearchFormValues } from '@/components/search/accommodation-search-form';
import { useRouter } from 'next/navigation'; // Added for navigation

const propertyTypes = [
  { name: "Hotels", icon: Hotel, image: "https://placehold.co/300x200.png?text=Hotels", dataAiHint: "modern hotel", filterType: "Hotel" },
  { name: "Apartments", icon: Building2, image: "https://placehold.co/300x200.png?text=Apartments", dataAiHint: "apartment building", filterType: "Rental" }, // Assuming apartments are rentals
  { name: "Resorts", icon: Waves, image: "https://placehold.co/300x200.png?text=Resorts", dataAiHint: "beach resort", filterType: "Hotel" }, // Assuming resorts are hotels
  { name: "Villas", icon: HomeIconType, image: "https://placehold.co/300x200.png?text=Villas", dataAiHint: "luxury villa", filterType: "Rental" },
  { name: "Guest Houses", icon: Bed, image: "https://placehold.co/300x200.png?text=Guest+Houses", dataAiHint: "guest house", filterType: "Rental" },
];

const mockRecentSearches = [
  { id: "rs1", query: "Hotels in Paris, France", destination: "Paris, France", type: "Hotel" },
  { id: "rs2", query: "Villas in Bali", destination: "Bali, Indonesia", type: "Rental" }, // Example type match
  { id: "rs3", query: "Apartments near Eiffel Tower", destination: "Paris, France", type: "Rental" }, // Example type match
];

const mockTrendingDestinations = [
  { id: "td1", name: "Top Hotels in Atlanta", image: "https://placehold.co/400x300.png?text=Atlanta+Hotels", dataAiHint: "atlanta skyline", price: 120, rating: 4.5, destination: "Atlanta", type: "Hotel" },
  { id: "td2", name: "Apartments in Douala", image: "https://placehold.co/400x300.png?text=Douala+Apts", dataAiHint: "douala city", price: 80, rating: 4.2, destination: "Douala", type: "Rental" }, // Assuming apartments are rentals
  { id: "td3", name: "Weekend Resorts in Abidjan", image: "https://placehold.co/400x300.png?text=Abidjan+Resorts", dataAiHint: "abidjan beach", price: 150, rating: 4.6, destination: "Abidjan", type: "Hotel" }, // Assuming resorts are hotels
  { id: "td4", name: "Luxury Stays in Dubai", image: "https://placehold.co/400x300.png?text=Dubai+Luxury", dataAiHint: "dubai hotel", price: 300, rating: 4.9, destination: "Dubai", type: "ANY" },
];

const mockVibes = [
  { name: "Adventure", icon: MountainSnow, mood: "Adventurous" },
  { name: "Relaxation", icon: Waves, mood: "Peaceful" },
  { name: "Romantic", icon: Heart, mood: "Romantic" },
  { name: "Family-Friendly", icon: Users, mood: "ANY" }, // No specific mood filter for Family, can adjust if needed
  { name: "Budget-Friendly", icon: DollarSign, mood: "ANY" }, // No specific mood filter for Budget, can adjust
];

const mockNearbyGems = [
  { id: "ng1", title: "Sunny Beachfront Villa (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Beach+Villa+Gem", dataAiHint: "beach villa", distance: "25km", linkStayId: "stay1" },
  { id: "ng2", title: "Cozy Mountain Cabin (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Cabin+Gem", dataAiHint: "mountain cabin", distance: "50km", linkStayId: "stay2" },
  { id: "ng3", title: "Urban Chic Hotel (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Hotel+Gem", dataAiHint: "city hotel", distance: "5km", linkStayId: "stay3" },
];

const mockDeals = [
  { id: "deal1", title: "Up to 30% off Resorts", image: "https://placehold.co/400x300.png?text=Resort+Deal", dataAiHint: "resort discount", urgency: "Ends in 3 days!", progress: 70, link: "/deals/resorts" },
  { id: "deal2", title: "Last-minute Apartment Deals - Save 20%", image: "https://placehold.co/400x300.png?text=Apartment+Deal", dataAiHint: "apartment sale", urgency: "Only 5 left!", progress: 90, link: "/deals/apartments" },
  { id: "deal3", title: "Flash Sale: Villas under $100", image: "https://placehold.co/400x300.png?text=Villa+Flash+Sale", dataAiHint: "villa special", urgency: "Limited Time!", progress: 50, link: "/deals/villas" },
];


export default function HomePage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [displayedStays, setDisplayedStays] = useState<MockStay[]>(allMockStays.slice(0, 6)); // Show first 6 by default
  const [noResults, setNoResults] = useState(false);
  const [activeFiltersSummary, setActiveFiltersSummary] = useState<string>("Featured Stays");


  useEffect(() => {
    setUserLocation("Cameroon"); 
  }, []);

  const handleEnableNotifications = () => {
    toast({
      title: "Enable Notifications (Demo)",
      description: "You'll now receive exclusive stay deals near you! (This is a placeholder)",
    });
  };

  const handleAccommodationSearch = useCallback((filters: Partial<AccommodationSearchFormValues>) => {
    console.log("Searching with filters:", filters);
    setNoResults(false);
    let currentSummary = "Search Results";

    if (filters.propertyType && filters.propertyType !== "ANY" && Object.keys(filters).length === 1) {
        currentSummary = `${filters.propertyType}s`;
    } else if (filters.mood && filters.mood !== "ANY" && Object.keys(filters).length === 1) {
        currentSummary = `Stays with a ${filters.mood} Vibe`;
    } else if (filters.destination && Object.keys(filters).length <= 2) { // destination and maybe type
        currentSummary = `Stays in ${filters.destination}`;
        if(filters.propertyType && filters.propertyType !== "ANY") currentSummary += ` (${filters.propertyType}s)`;
    }


    let results = allMockStays.filter(stay => {
      let matches = true;

      if (filters.destination) {
        matches = matches && stay.location.toLowerCase().includes(filters.destination.toLowerCase());
      }

      const totalGuests = (filters.adults || 0) + (filters.children || 0);
      if (filters.adults && stay.maxGuests && totalGuests > stay.maxGuests) {
        matches = false;
      }
      
      if (filters.propertyType && filters.propertyType !== "ANY") {
         matches = matches && stay.type === filters.propertyType;
      }

      if (filters.mood && filters.mood !== "ANY" && stay.moods) {
        matches = matches && stay.moods.includes(filters.mood as "Peaceful" | "Romantic" | "Adventurous");
      }

      if (filters.wheelchairAccessible && !stay.isWheelchairAccessible) {
        matches = false;
      }

      if (filters.ecoFriendly && !stay.isEcoFriendly) {
        matches = false;
      }
      
      return matches;
    });

    if (results.length === 0) {
      setNoResults(true);
      currentSummary = "No Stays Found";
    }
    setDisplayedStays(results);
    setActiveFiltersSummary(currentSummary);
    if (!Object.keys(filters).length) { // If called with empty filters, it's like "View All"
        setActiveFiltersSummary("All Stays");
    }
    
    // Scroll to the stays section after search
    const staysSection = document.getElementById('stays-section');
    if (staysSection) {
        staysSection.scrollIntoView({ behavior: 'smooth' });
    }

    if(Object.keys(filters).length > 0 || results.length === 0) { // Only toast if actual filtering happened or no results
        toast({title: "Search Complete", description: `${results.length} stays found for "${currentSummary}".`});
    }

  }, []);
  
  const resetAndShowAllStays = () => {
    setDisplayedStays(allMockStays);
    setNoResults(false);
    setActiveFiltersSummary("All Stays");
    const staysSection = document.getElementById('stays-section');
    if (staysSection) {
        staysSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="space-y-16">
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
            Discover amazing places to stay for your next adventure, from cozy cabins to luxury villas, all around the world.
          </p>
          <div className="max-w-5xl mx-auto bg-card p-6 rounded-xl shadow-xl border">
            <AccommodationSearchForm onSearch={handleAccommodationSearch} />
          </div>
        </div>
      </section>

      <section id="stays-section" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-semibold text-foreground flex items-center mb-4 sm:mb-0">
            <BedDouble className="mr-3 h-8 w-8 text-primary" />
            {activeFiltersSummary}
          </h2>
           <Button variant="link" asChild className="text-primary hover:text-primary/80" onClick={resetAndShowAllStays}>
              <Link href="#stays-section">View All Stays &rarr;</Link>
            </Button>
        </div>
        {noResults ? (
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-xl font-semibold">No Stays Found</p>
            <p className="text-muted-foreground">Try adjusting your search filters or view all stays.</p>
            <Button onClick={resetAndShowAllStays} className="mt-4">Clear Search & View All</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group rounded-xl border">
                <Link href={`/stays/${stay.id}`} className="block">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={stay.dataAiHint}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    <Link href={`/stays/${stay.id}`}>{stay.name}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm pt-1">
                    <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" /> {stay.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xl font-bold text-primary">
                      ${stay.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </p>
                    {stay.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-foreground">{stay.rating}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="font-normal">{stay.category}</Badge>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-base">
                    <Link href={`/stays/${stay.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <section className="container mx-auto px-4 py-12 bg-primary/5 rounded-lg text-center">
        <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-headline font-semibold text-primary mb-3">Plan smarter with AI</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Unlock promotions, exclusive deals & personalized specials for your next trip with our AI-powered planner.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="/ai-trip-planner">Start Planning</Link>
        </Button>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-8 text-center">Browse by Property Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {propertyTypes.map((type) => (
            <button key={type.name} onClick={() => handleAccommodationSearch({ propertyType: type.filterType as AccommodationSearchFormValues['propertyType'] })} className="block group text-left">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full h-full flex flex-col">
                <div className="relative h-32 sm:h-40">
                  <Image src={type.image} alt={type.name} layout="fill" objectFit="cover" data-ai-hint={type.dataAiHint} />
                </div>
                <CardHeader className="p-3 text-center flex-grow flex flex-col justify-center">
                  <CardTitle className="text-base sm:text-lg font-medium group-hover:text-primary flex items-center justify-center gap-2">
                    <type.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" /> {type.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-6 flex items-center gap-2">
          <History className="h-7 w-7 text-primary" /> Your Recent Searches
        </h2>
        {mockRecentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {mockRecentSearches.map((search) => (
              <Button key={search.id} variant="outline" onClick={() => handleAccommodationSearch({ destination: search.destination, propertyType: search.type as AccommodationSearchFormValues['propertyType'] })}>
                {search.query}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No recent searches found. Start exploring!</p>
        )}
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-8 flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" /> Trending Near You {userLocation && `(in ${userLocation})`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTrendingDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden group hover:shadow-lg">
              <button onClick={() => handleAccommodationSearch({ destination: dest.destination, propertyType: dest.type as AccommodationSearchFormValues['propertyType'] })} className="block w-full text-left">
                <div className="relative h-48">
                  <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.dataAiHint} className="group-hover:scale-105 transition-transform"/>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-medium group-hover:text-primary">{dest.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Starts at ${dest.price}/night &bull; Rating: {dest.rating} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </CardDescription>
                </CardHeader>
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-headline font-semibold text-foreground text-center mb-2">Pick a Vibe & Explore</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
          Quick & easy trip planner — Pick a vibe and explore top destinations {userLocation && `in ${userLocation}`}!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {mockVibes.map((vibe) => (
            <Button key={vibe.name} variant="secondary" size="lg" className="text-base" onClick={() => handleAccommodationSearch({ mood: vibe.mood as AccommodationSearchFormValues['mood'] })}>
              <vibe.icon className="mr-2 h-5 w-5" /> {vibe.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-2">Nearby Gems</h2>
        <p className="text-muted-foreground mb-8">You don’t have to go far for your next trip.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockNearbyGems.map((gem) => (
            <Card key={gem.id} className="overflow-hidden group hover:shadow-lg">
               <Link href={`/stays/${gem.linkStayId}`} passHref legacyBehavior>
                <a className="block">
                  <div className="relative h-40">
                    <Image src={gem.image} alt={gem.title} layout="fill" objectFit="cover" data-ai-hint={gem.dataAiHint} className="group-hover:scale-105 transition-transform"/>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium group-hover:text-primary">{gem.title}</h3>
                    <p className="text-sm text-muted-foreground">{gem.distance} away</p>
                  </CardContent>
                </a>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-2 flex items-center gap-2">
          <Percent className="h-7 w-7 text-primary" /> Save While You Travel
        </h2>
        <p className="text-muted-foreground mb-8">Travel more, spend less — discover discounts based on your preferences.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockDeals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden group hover:shadow-lg">
              <Link href={deal.link} passHref legacyBehavior>
                <a className="block">
                  <div className="relative h-48">
                    <Image src={deal.image} alt={deal.title} layout="fill" objectFit="cover" data-ai-hint={deal.dataAiHint} className="group-hover:scale-105 transition-transform"/>
                    <Badge variant="destructive" className="absolute top-2 right-2 text-xs">{deal.urgency}</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-medium group-hover:text-primary">{deal.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Progress value={deal.progress} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{deal.progress}% claimed</p>
                  </CardContent>
                </a>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 text-center">
        <Card className="inline-block p-6 shadow-md">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Bell className="h-6 w-6 text-primary" /> Never Miss a Deal!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground mb-3 text-sm">Enable notifications for exclusive stay deals near you.</p>
            <Button onClick={handleEnableNotifications}>Enable Notifications (Demo)</Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
