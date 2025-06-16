
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for featured stays
const mockFeaturedStays = [
  {
    id: "stay1",
    name: "Sunny Beachfront Villa",
    location: "Bali, Indonesia",
    pricePerNight: 250,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "beach villa",
    rating: 4.8,
    category: "Villa",
  },
  {
    id: "stay2",
    name: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    pricePerNight: 180,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "mountain cabin",
    rating: 4.9,
    category: "Cabin",
  },
  {
    id: "stay3",
    name: "Urban Chic Apartment",
    location: "Paris, France",
    pricePerNight: 150,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "city apartment",
    rating: 4.7,
    category: "Apartment",
  },
   {
    id: "stay4",
    name: "Riverside Lodge Escape",
    location: "Scottish Highlands",
    pricePerNight: 220,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "river lodge",
    rating: 4.6,
    category: "Lodge",
  },
  {
    id: "stay5",
    name: "Desert Oasis Retreat",
    location: "Sedona, Arizona",
    pricePerNight: 300,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "desert home",
    rating: 4.8,
    category: "House",
  },
  {
    id: "stay6",
    name: "Historic City Center Flat",
    location: "Rome, Italy",
    pricePerNight: 120,
    image: "https://placehold.co/600x400.png",
    dataAiHint: "historic building",
    rating: 4.5,
    category: "Flat",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section with Search */}
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

      {/* Featured Stays Section */}
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
      
      {/* Explore More Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">
          More Ways to RoamFree
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Beyond stays, RoamFree helps you plan your entire journey. Book transport, discover attractions, and find unique experiences.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="lg" asChild><Link href="/transport">Book Transport</Link></Button>
            <Button variant="outline" size="lg" asChild><Link href="/attractions">Discover Attractions</Link></Button>
            <Button variant="outline" size="lg" asChild><Link href="/rent-home">Find Long-Term Rentals</Link></Button>
        </div>
      </section>
    </div>
  );
}
