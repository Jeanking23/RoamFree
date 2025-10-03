
// src/app/about/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Rocket, Target, Handshake, ShieldCheck, BedDouble, Car, Ticket, Wand2, Building2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const offerings = [
    { icon: BedDouble, title: 'Stays', description: 'Find hotels, apartments, villas, and unique rentals.'},
    { icon: Car, title: 'Transport', description: 'Book rides, rental cars, and airport transfers seamlessly.'},
    { icon: Ticket, title: 'Attractions', description: 'Discover and book tickets for local tours and attractions.'},
    { icon: Wand2, title: 'AI Planner', description: 'Craft personalized trip itineraries with our smart AI assistant.'},
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 p-8 md:p-12 text-center">
          <Info className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">
            About RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our journey began with a simple idea: to make travel accessible, secure, and limitless for everyone.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-12">
          {/* Our Story Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-2"><Rocket className="h-6 w-6 text-accent"/> Our Story</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-center">
              RoamFree was founded by a team of passionate travelers who believed that planning an adventure should be as exciting as the journey itself. Frustrated by fragmented booking platforms and a lack of integrated services, we set out to build an all-in-one solution. From finding the perfect eco-friendly cabin to securing a rental car and discovering local gems with our AI planner, RoamFree is designed to be your ultimate travel companion.
            </p>
          </section>

           {/* What We Offer Section */}
          <section>
            <h2 className="text-2xl font-semibold text-center mb-6">What RoamFree Offers</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {offerings.map(offering => (
                <div key={offering.title} className="p-4 bg-muted/30 rounded-lg">
                  <offering.icon className="h-8 w-8 text-primary mx-auto mb-2"/>
                  <h3 className="font-semibold">{offering.title}</h3>
                  <p className="text-xs text-muted-foreground">{offering.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Values Section */}
          <section className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-muted/30 rounded-lg">
              <Target className="h-8 w-8 text-primary mx-auto mb-2"/>
              <h3 className="font-semibold">Our Mission</h3>
              <p className="text-xs text-muted-foreground">To empower seamless travel experiences through innovative technology and a comprehensive, user-friendly platform.</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <Handshake className="h-8 w-8 text-primary mx-auto mb-2"/>
              <h3 className="font-semibold">Our Vision</h3>
              <p className="text-xs text-muted-foreground">To be the world's most trusted and integrated travel hub, connecting people to places and experiences effortlessly.</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2"/>
              <h3 className="font-semibold">Our Commitment</h3>
              <p className="text-xs text-muted-foreground">To prioritize safety, sustainability, and community, ensuring every journey is responsible and respectful.</p>
            </div>
          </section>

          {/* Partner Section */}
          <section className="text-center bg-accent/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"><TrendingUp className="h-6 w-6 text-accent"/> Bringing Value to Our Partners</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                We provide property owners and service providers with the tools they need to succeed. Our platform offers access to a global audience, an intuitive dashboard with performance analytics, dynamic pricing tools, and secure payment processing to help you maximize your revenue and streamline operations.
            </p>
            <Button asChild>
                <Link href="/list-property">
                    <span><Building2 className="mr-2 h-4 w-4"/> List Your Property</span>
                </Link>
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
