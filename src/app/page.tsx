
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BedDouble, MapPin, Star, Lightbulb, Hotel, Building2, Home, Bed, Search, History, TrendingUp, Sparkles, Waves, MountainSnow, Users, Percent, Clock, Bell, MessageSquare, UserCircle, LayoutDashboard, Heart, Award, Building as BuildingIcon, KeyRound, Landmark as LandmarkIcon, ClipboardList, Truck, CarFront as CarSaleIcon, Plane, TvIcon, Layers, School, Leaf, CheckCircle, CalendarDays, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Mock data for featured stays (existing)
const mockFeaturedStays = [
  {
    id: "stay1",
    name: "Sunny Beachfront Villa",
    location: "Bali, Indonesia",
    pricePerNight: 250,
    image: "https://placehold.co/600x400.png?text=Beach+Villa",
    dataAiHint: "beach villa",
    rating: 4.8,
    category: "Villa",
  },
  {
    id: "stay2",
    name: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    pricePerNight: 180,
    image: "https://placehold.co/600x400.png?text=Mountain+Cabin",
    dataAiHint: "mountain cabin",
    rating: 4.9,
    category: "Cabin",
  },
  {
    id: "stay3",
    name: "Urban Chic Apartment",
    location: "Paris, France",
    pricePerNight: 150,
    image: "https://placehold.co/600x400.png?text=City+Apartment",
    dataAiHint: "city apartment",
    rating: 4.7,
    category: "Apartment",
  },
   {
    id: "stay4",
    name: "Riverside Lodge Escape",
    location: "Scottish Highlands",
    pricePerNight: 220,
    image: "https://placehold.co/600x400.png?text=River+Lodge",
    dataAiHint: "river lodge",
    rating: 4.6,
    category: "Lodge",
  },
  {
    id: "stay5",
    name: "Desert Oasis Retreat",
    location: "Sedona, Arizona",
    pricePerNight: 300,
    image: "https://placehold.co/600x400.png?text=Desert+Home",
    dataAiHint: "desert home",
    rating: 4.8,
    category: "House",
  },
  {
    id: "stay6",
    name: "Historic City Center Flat",
    location: "Rome, Italy",
    pricePerNight: 120,
    image: "https://placehold.co/600x400.png?text=Historic+Building",
    dataAiHint: "historic building",
    rating: 4.5,
    category: "Flat",
  },
];

// Mock data for new sections
const propertyTypes = [
  { name: "Hotels", icon: Hotel, image: "https://placehold.co/300x200.png?text=Hotels", dataAiHint: "modern hotel", link: "/stays?type=Hotel" },
  { name: "Apartments", icon: Building2, image: "https://placehold.co/300x200.png?text=Apartments", dataAiHint: "apartment building", link: "/stays?type=Apartment" },
  { name: "Resorts", icon: Waves, image: "https://placehold.co/300x200.png?text=Resorts", dataAiHint: "beach resort", link: "/stays?type=Resort" },
  { name: "Villas", icon: Home, image: "https://placehold.co/300x200.png?text=Villas", dataAiHint: "luxury villa", link: "/stays?type=Villa" },
  { name: "Guest Houses", icon: Bed, image: "https://placehold.co/300x200.png?text=Guest+Houses", dataAiHint: "guest house", link: "/stays?type=GuestHouse" },
];

const mockRecentSearches = [
  { id: "rs1", query: "Hotels in Paris, France", link: "/stays?destination=Paris&type=Hotel" },
  { id: "rs2", query: "Villas in Bali, Aug 10 - Aug 17", link: "/stays?destination=Bali&type=Villa&dates=..." },
  { id: "rs3", query: "Apartments near Eiffel Tower", link: "/stays?destination=Eiffel+Tower&type=Apartment" },
];

const mockTrendingDestinations = [
  { id: "td1", name: "Top Hotels in Atlanta", image: "https://placehold.co/400x300.png?text=Atlanta+Hotels", dataAiHint: "atlanta skyline", price: 120, rating: 4.5, link: "/stays?destination=Atlanta&type=Hotel" },
  { id: "td2", name: "Apartments in Douala", image: "https://placehold.co/400x300.png?text=Douala+Apts", dataAiHint: "douala city", price: 80, rating: 4.2, link: "/stays?destination=Douala&type=Apartment" },
  { id: "td3", name: "Weekend Resorts in Abidjan", image: "https://placehold.co/400x300.png?text=Abidjan+Resorts", dataAiHint: "abidjan beach", price: 150, rating: 4.6, link: "/stays?destination=Abidjan&type=Resort" },
  { id: "td4", name: "Luxury Stays in Dubai", image: "https://placehold.co/400x300.png?text=Dubai+Luxury", dataAiHint: "dubai hotel", price: 300, rating: 4.9, link: "/stays?destination=Dubai" },
];

const mockVibes = [
  { name: "Adventure", icon: MountainSnow, link: "/ai-trip-planner?vibe=Adventure" },
  { name: "Relaxation", icon: Waves, link: "/ai-trip-planner?vibe=Relaxation" },
  { name: "Romantic", icon: Heart, link: "/ai-trip-planner?vibe=Romantic" },
  { name: "Family-Friendly", icon: Users, link: "/ai-trip-planner?vibe=Family" },
  { name: "Budget-Friendly", icon: DollarSign, link: "/ai-trip-planner?vibe=Budget" },
];

const mockNearbyGems = [
  { id: "ng1", title: "Beautiful lake house nearby", image: "https://placehold.co/400x300.png?text=Lake+House", dataAiHint: "lake house", distance: "25km", link: "/stays/nearby-lake-house" },
  { id: "ng2", title: "Popular resort 50km away", image: "https://placehold.co/400x300.png?text=Nearby+Resort", dataAiHint: "resort pool", distance: "50km", link: "/stays/nearby-resort" },
  { id: "ng3", title: "Affordable guest house in your city", image: "https://placehold.co/400x300.png?text=City+Guesthouse", dataAiHint: "city guesthouse", distance: "5km", link: "/stays/city-guesthouse" },
];

const mockDeals = [
  { id: "deal1", title: "Up to 30% off Resorts", image: "https://placehold.co/400x300.png?text=Resort+Deal", dataAiHint: "resort discount", urgency: "Ends in 3 days!", progress: 70, link: "/deals/resorts" },
  { id: "deal2", title: "Last-minute Apartment Deals - Save 20%", image: "https://placehold.co/400x300.png?text=Apartment+Deal", dataAiHint: "apartment sale", urgency: "Only 5 left!", progress: 90, link: "/deals/apartments" },
  { id: "deal3", title: "Flash Sale: Villas under $100", image: "https://placehold.co/400x300.png?text=Villa+Flash+Sale", dataAiHint: "villa special", urgency: "Limited Time!", progress: 50, link: "/deals/villas" },
];


export default function HomePage() {
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    // Mock user location for "Trending Near You" and "Nearby Gems"
    // In a real app, you'd use navigator.geolocation or IP-based location
    setUserLocation("Cameroon"); // Default mock location
  }, []);

  const handleEnableNotifications = () => {
    toast({
      title: "Enable Notifications (Demo)",
      description: "You'll now receive exclusive stay deals near you! (This is a placeholder)",
    });
  };

  return (
    <div className="space-y-16">
      {/* Hero Section with Search (Existing) */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto">
            Discover amazing places to stay for your next adventure, from cozy cabins to luxury villas, all around the world.
          </p>
          <div className="max-w-5xl mx-auto bg-card p-6 rounded-xl shadow-xl border">
            <AccommodationSearchForm />
          </div>
        </div>
      </section>

      {/* Featured Stays Section (Existing) */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-semibold text-foreground flex items-center mb-4 sm:mb-0">
            <BedDouble className="mr-3 h-8 w-8 text-primary" />
            Featured Stays
          </h2>
          <Button variant="link" asChild className="text-primary hover:text-primary/80">
            <Link href="/stays">View All Stays &rarr;</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockFeaturedStays.map((stay) => (
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
      </section>
      
      {/* 1. AI Trip Planner Offer */}
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

      {/* 2. Browse by Property Type */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-8 text-center">Browse by Property Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {propertyTypes.map((type) => (
            <Link key={type.name} href={type.link} passHref legacyBehavior>
              <a className="block group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-32 sm:h-40">
                    <Image src={type.image} alt={type.name} layout="fill" objectFit="cover" data-ai-hint={type.dataAiHint} />
                  </div>
                  <CardHeader className="p-3 text-center">
                    <CardTitle className="text-base sm:text-lg font-medium group-hover:text-primary flex items-center justify-center gap-2">
                      <type.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" /> {type.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Your Recent Searches */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-6 flex items-center gap-2">
          <History className="h-7 w-7 text-primary" /> Your Recent Searches
        </h2>
        {mockRecentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {mockRecentSearches.map((search) => (
              <Button key={search.id} variant="outline" asChild>
                <Link href={search.link}>{search.query}</Link>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No recent searches found. Start exploring!</p>
        )}
      </section>

      {/* 4. Trending Destinations Near You */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-8 flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" /> Trending Near You {userLocation && `(in ${userLocation})`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTrendingDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden group hover:shadow-lg">
              <Link href={dest.link} passHref legacyBehavior>
                <a className="block">
                  <div className="relative h-48">
                    <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.dataAiHint} className="group-hover:scale-105 transition-transform"/>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-medium group-hover:text-primary">{dest.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Starts at ${dest.price}/night &bull; Rating: {dest.rating} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </CardDescription>
                  </CardHeader>
                </a>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Quick & Easy Trip Planner (Pick a Vibe) */}
      <section className="container mx-auto px-4 py-12 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-headline font-semibold text-foreground text-center mb-2">Pick a Vibe & Explore</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
          Quick & easy trip planner — Pick a vibe and explore top destinations {userLocation && `in ${userLocation}`}!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {mockVibes.map((vibe) => (
            <Button key={vibe.name} variant="secondary" size="lg" className="text-base" asChild>
              <Link href={vibe.link}>
                <vibe.icon className="mr-2 h-5 w-5" /> {vibe.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* 6. Explore Destinations Closer to Home (Nearby Gems) */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-2">Nearby Gems</h2>
        <p className="text-muted-foreground mb-8">You don’t have to go far for your next trip.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mockNearbyGems.map((gem) => (
            <Card key={gem.id} className="overflow-hidden group hover:shadow-lg">
               <Link href={gem.link} passHref legacyBehavior>
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

      {/* 7. Travel More, Spend Less */}
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

      {/* Optional: Push Notification Prompt Placeholder */}
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

