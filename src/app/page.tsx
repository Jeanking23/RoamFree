
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
import { useRouter } from 'next/navigation';

const propertyTypes = [
  { name: "Hotels", icon: Hotel, image: "https://placehold.co/300x200.png?text=Hotels", dataAiHint: "modern hotel", filterType: "Hotel" },
  { name: "Apartments", icon: Building2, image: "https://placehold.co/300x200.png?text=Apartments", dataAiHint: "apartment building", filterType: "Rental" },
  { name: "Resorts", icon: Waves, image: "https://placehold.co/300x200.png?text=Resorts", dataAiHint: "beach resort", filterType: "Hotel" },
  { name: "Villas", icon: HomeIconType, image: "https://placehold.co/300x200.png?text=Villas", dataAiHint: "luxury villa", filterType: "Rental" },
  { name: "Guest Houses", icon: Bed, image: "https://placehold.co/300x200.png?text=Guest+Houses", dataAiHint: "guest house", filterType: "Rental" },
];

const mockRecentSearches = [
  { id: "rs1", query: "Hotels in Paris, France", destination: "Paris, France", type: "Hotel" },
  { id: "rs2", query: "Villas in Bali", destination: "Bali, Indonesia", type: "Rental" },
  { id: "rs3", query: "Apartments near Eiffel Tower", destination: "Paris, France", type: "Rental" },
];

const mockTrendingDestinations = [
  { id: "td1", name: "Top Hotels in Atlanta", image: "https://placehold.co/400x300.png?text=Atlanta+Hotels", dataAiHint: "atlanta skyline", price: 120, rating: 4.5, destination: "Atlanta", type: "Hotel" },
  { id: "td2", name: "Apartments in Douala", image: "https://placehold.co/400x300.png?text=Douala+Apts", dataAiHint: "douala city", price: 80, rating: 4.2, destination: "Douala", type: "Rental" },
  { id: "td3", name: "Weekend Resorts in Abidjan", image: "https://placehold.co/400x300.png?text=Abidjan+Resorts", dataAiHint: "abidjan beach", price: 150, rating: 4.6, destination: "Abidjan", type: "Hotel" },
  { id: "td4", name: "Luxury Stays in Dubai", image: "https://placehold.co/400x300.png?text=Dubai+Luxury", dataAiHint: "dubai hotel", price: 300, rating: 4.9, destination: "Dubai", type: "ANY" },
];

const mockVibes = [
  { name: "Adventure", icon: MountainSnow, mood: "Adventurous" },
  { name: "Relaxation", icon: Waves, mood: "Peaceful" },
  { name: "Romantic", icon: Heart, mood: "Romantic" },
  { name: "Family-Friendly", icon: Users, mood: "ANY" },
  { name: "Budget-Friendly", icon: DollarSign, mood: "ANY" },
];

const mockNearbyGems = [
  { id: "ng1", title: "Sunny Beachfront Villa (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Beach+Villa+Gem", dataAiHint: "beach villa", distance: "25km", linkStayId: "stay1" },
  { id: "ng2", title: "Cozy Mountain Cabin (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Cabin+Gem", dataAiHint: "mountain cabin", distance: "50km", linkStayId: "stay2" },
  { id: "ng3", title: "Urban Chic Hotel (Nearby Gem)", image: "https://placehold.co/400x300.png?text=Hotel+Gem", dataAiHint: "city hotel", distance: "5km", linkStayId: "stay3" },
];

const mockDeals = [
  { id: "deal1", title: "Up to 30% off Resorts", image: "https://placehold.co/400x300.png?text=Resort+Deal", dataAiHint: "resort discount", urgency: "Ends in 3 days!", progress: 70, link: "/stays" }, // Link to general stays or specific deal page
  { id: "deal2", title: "Last-minute Apartment Deals - Save 20%", image: "https://placehold.co/400x300.png?text=Apartment+Deal", dataAiHint: "apartment sale", urgency: "Only 5 left!", progress: 90, link: "/stays" },
  { id: "deal3", title: "Flash Sale: Villas under $100", image: "https://placehold.co/400x300.png?text=Villa+Flash+Sale", dataAiHint: "villa special", urgency: "Limited Time!", progress: 50, link: "/stays" },
];


export default function HomePage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [displayedStays, setDisplayedStays] = useState<MockStay[]>(allMockStays.slice(0, 6));
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
    setDisplayedStays(allMockStays.slice(0, 12)); // Show more by default when "View All"
    setNoResults(false);
    setActiveFiltersSummary("All Stays");
    const staysSection = document.getElementById('stays-section');
    if (staysSection) staysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-20 md:space-y-24">
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-md -mx-4 px-4 md:mx-0 md:px-0">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-6 leading-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto">
            Discover amazing places to stay for your next adventure, from cozy cabins to luxury villas, all around the world.
          </p>
          <div className="max-w-5xl mx-auto bg-card p-6 md:p-8 rounded-xl shadow-xl border">
            <AccommodationSearchForm onSearch={handleAccommodationSearch} />
          </div>
        </div>
      </section>

      <section id="stays-section" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground flex items-center mb-3 sm:mb-0">
            <BedDouble className="mr-3 h-8 w-8 text-primary" />
            {activeFiltersSummary}
          </h2>
           <Button variant="link" asChild className="text-primary hover:text-primary/80 text-lg" onClick={resetAndShowAllStays}>
              <Link href="#stays-section">View All Stays &rarr;</Link>
            </Button>
        </div>
        {noResults ? (
          <div className="text-center py-16 bg-muted/50 rounded-lg shadow-sm">
            <Search className="h-20 w-20 text-muted-foreground/40 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-foreground mb-3">No Stays Found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your search filters or view all available stays.</p>
            <Button onClick={resetAndShowAllStays} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Clear Search & View All</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group rounded-xl border-border hover:border-primary">
                <Link href={`/stays/${stay.id}`} className="block">
                  <div className="relative w-full h-64 overflow-hidden rounded-t-xl">
                    <Image
                      src={stay.image}
                      alt={stay.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={stay.dataAiHint}
                      className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                     <Badge variant={stay.isEcoFriendly ? "default" : "secondary"} className={`absolute top-3 right-3 ${stay.isEcoFriendly ? 'bg-green-600 border-green-700 text-white' : ''}`}>
                      {stay.isEcoFriendly && <Leaf className="mr-1.5 h-4 w-4" />}
                      {stay.category}
                    </Badge>
                  </div>
                </Link>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                    <Link href={`/stays/${stay.id}`}>{stay.name}</Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm pt-1">
                    <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" /> {stay.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-2xl font-bold text-primary">
                      ${stay.pricePerNight}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </p>
                    {stay.rating && (
                      <div className="flex items-center gap-1 text-lg">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-foreground">{stay.rating}</span>
                      </div>
                    )}
                  </div>
                  {stay.moods && stay.moods.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {stay.moods.map(mood => <Badge key={mood} variant="outline" className="text-xs">{mood}</Badge>)}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 bg-muted/30 rounded-b-xl">
                  <Button asChild className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-semibold py-3 text-base rounded-md shadow-sm hover:shadow-md transition-all">
                    <Link href={`/stays/${stay.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <section className="container mx-auto px-4 py-16 bg-primary/5 rounded-xl text-center shadow-sm border">
        <Lightbulb className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-primary mb-4">Plan smarter with AI</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Unlock promotions, exclusive deals & personalized specials for your next trip with our AI-powered planner.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-8 py-3 rounded-md shadow-md hover:shadow-lg transition-all" asChild>
          <Link href="/ai-trip-planner">Start Planning Now</Link>
        </Button>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground mb-10 text-center">Browse by Property Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {propertyTypes.map((type) => (
            <button key={type.name} onClick={() => handleAccommodationSearch({ propertyType: type.filterType as AccommodationSearchFormValues['propertyType'] })} className="block group text-left">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col rounded-lg border-border hover:border-primary/50">
                <div className="relative h-40 sm:h-48">
                  <Image src={type.image} alt={type.name} layout="fill" objectFit="cover" data-ai-hint={type.dataAiHint} className="group-hover:scale-105 transition-transform duration-300"/>
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <CardHeader className="p-4 text-center flex-grow flex flex-col justify-center bg-background/70 backdrop-blur-sm">
                  <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-primary flex items-center justify-center gap-2 transition-colors">
                    <type.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" /> {type.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground mb-8 flex items-center gap-3">
          <History className="h-8 w-8 text-primary" /> Your Recent Searches
        </h2>
        {mockRecentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {mockRecentSearches.map((search) => (
              <Button key={search.id} variant="outline" size="lg" className="text-base hover:border-primary hover:bg-primary/5 transition-all" onClick={() => handleAccommodationSearch({ destination: search.destination, propertyType: search.type as AccommodationSearchFormValues['propertyType'] })}>
                {search.query}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">No recent searches found. Start exploring!</p>
        )}
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground mb-10 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" /> Trending Near You {userLocation && <span className="text-2xl text-muted-foreground">(in {userLocation})</span>}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockTrendingDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-lg border-border hover:border-primary/50">
              <button onClick={() => handleAccommodationSearch({ destination: dest.destination, propertyType: dest.type as AccommodationSearchFormValues['propertyType'] })} className="block w-full text-left">
                <div className="relative h-52">
                  <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.dataAiHint} className="group-hover:scale-105 transition-transform duration-300"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                   <div className="absolute bottom-3 left-3 text-white">
                     <h3 className="text-lg font-semibold drop-shadow-md">{dest.name}</h3>
                   </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Starts at <span className="font-bold text-primary">${dest.price}</span>/night &bull; Rating: {dest.rating} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </p>
                </CardContent>
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-xl shadow-sm border">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground text-center mb-4">Pick a Vibe & Explore</h2>
        <p className="text-lg text-muted-foreground text-center mb-10 max-w-lg mx-auto">
          Quick & easy trip planner — Pick a vibe and explore top destinations {userLocation && `in ${userLocation}`}!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {mockVibes.map((vibe) => (
            <Button key={vibe.name} variant="secondary" size="lg" className="text-base px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-secondary/80 transition-all" onClick={() => handleAccommodationSearch({ mood: vibe.mood as AccommodationSearchFormValues['mood'] })}>
              <vibe.icon className="mr-2.5 h-5 w-5" /> {vibe.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground mb-4">Nearby Gems</h2>
        <p className="text-lg text-muted-foreground mb-10">You don’t have to go far for your next trip.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {mockNearbyGems.map((gem) => (
            <Card key={gem.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-lg border-border hover:border-primary/50">
               <Link href={`/stays/${gem.linkStayId}`} passHref legacyBehavior>
                <a className="block">
                  <div className="relative h-48">
                    <Image src={gem.image} alt={gem.title} layout="fill" objectFit="cover" data-ai-hint={gem.dataAiHint} className="group-hover:scale-105 transition-transform duration-300"/>
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{gem.title}</h3>
                    <p className="text-sm text-muted-foreground">{gem.distance} away</p>
                  </CardContent>
                </a>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-foreground mb-4 flex items-center gap-3">
          <Percent className="h-8 w-8 text-primary" /> Save While You Travel
        </h2>
        <p className="text-lg text-muted-foreground mb-10">Travel more, spend less — discover discounts based on your preferences.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockDeals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-lg border-border hover:border-primary/50">
              <Link href={deal.link} passHref legacyBehavior>
                <a className="block">
                  <div className="relative h-52">
                    <Image src={deal.image} alt={deal.title} layout="fill" objectFit="cover" data-ai-hint={deal.dataAiHint} className="group-hover:scale-105 transition-transform duration-300"/>
                    <Badge variant="destructive" className="absolute top-3 right-3 text-xs px-2 py-1">{deal.urgency}</Badge>
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                       <CardTitle className="text-xl font-semibold text-white group-hover:text-primary/90 transition-colors drop-shadow-md">{deal.title}</CardTitle>
                     </div>
                  </div>
                  <CardContent className="p-4">
                    <Progress value={deal.progress} className="h-2.5 mb-2" />
                    <p className="text-sm text-muted-foreground">{deal.progress}% claimed</p>
                  </CardContent>
                </a>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 text-center">
        <Card className="inline-block p-6 md:p-8 shadow-lg rounded-xl border bg-background">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
              <Bell className="h-8 w-8 text-primary" /> Never Miss a Deal!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground mb-6 text-base">Enable notifications for exclusive stay deals and personalized offers near you.</p>
            <Button onClick={handleEnableNotifications} size="lg" className="text-lg px-8 py-3 rounded-md shadow-md hover:shadow-lg transition-all">Enable Notifications (Demo)</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
