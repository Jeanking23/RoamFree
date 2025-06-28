// src/app/transport/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plane, Car, Bus, Bike } from 'lucide-react';
import Link from 'next/link';
import TransportationSearchForm from '@/components/search/transportation-search-form';
import POIRecommendationForm from '@/components/recommendations/poi-recommendation-form';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';

export default function TransportPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Plane className="h-8 w-8" />
            Plan Your Journey
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Request a ride, find rental cars, or explore various transport options.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <TransportationSearchForm />
              <POIRecommendationForm />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <InteractiveMapPlaceholder />
              <Card>
                <CardHeader>
                  <CardTitle>Other Transport Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/car-rent"><Car className="mr-2 h-4 w-4" />Rent a Car</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/bus-transportation"><Bus className="mr-2 h-4 w-4" />Book a Bus Ticket</Link>
                  </Button>
                   <Button variant="outline" className="w-full justify-start" disabled>
                    <Bike className="mr-2 h-4 w-4" />Bike Sharing (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
