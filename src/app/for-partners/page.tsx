// src/app/for-partners/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MessageSquare, BarChart3, Rocket, Home, CarFront, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const hostBenefits = [
  {
    icon: ShieldCheck,
    title: "Host Protection",
    description: "To support you in the rare event of an incident, most RoamFree bookings include property damage protection and liability insurance of up to $1M USD.",
  },
  {
    icon: MessageSquare,
    title: "Personalized Support",
    description: "Our global team is available 24/7 to provide tailored support for hosts through phone, email, and chat.",
  },
  {
    icon: BarChart3,
    title: "Dynamic Tools",
    description: "We provide smart pricing tools, booking management, and analytics to help you optimize your listing and maximize your earnings.",
  },
];

export default function ForPartnersPage() {
  return (
    <div className="space-y-8 -mt-8 -mx-4 md:mt-0 md:mx-0">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3N0JTIwaG91c2V8ZW58MHx8fHwxNzU4NzM3OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Beautiful modern living room"
          fill
          className="object-cover"
          data-ai-hint="host house"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
              Become a RoamFree Partner
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-lg">
              Join our community of hosts and providers to unlock new opportunities and earn money.
            </p>
          </div>
          <Card className="bg-background/90 backdrop-blur-sm border-border/50 hidden md:block">
            <CardHeader>
              <CardTitle>Start Earning Today</CardTitle>
              <CardDescription>Create your listing in minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email Address</Label>
                <Input id="email-signup" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" placeholder="Create a password" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-xs font-normal">I agree to the <Link href="#" className="underline">Terms and Conditions</Link>.</Label>
              </div>
              <Button asChild className="w-full">
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-12">
        {/* What You Can List Section */}
        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">List Anything, Anywhere</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Home className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Properties & Stays</h3>
              <p className="text-sm text-muted-foreground mt-1">From apartments and houses to unique villas and land plots.</p>
            </Card>
            <Card className="text-center p-6">
              <CarFront className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Vehicles</h3>
              <p className="text-sm text-muted-foreground mt-1">Rent out your car or list it for sale to a trusted community.</p>
            </Card>
            <Card className="text-center p-6">
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Services & Experiences</h3>
              <p className="text-sm text-muted-foreground mt-1">Offer ride services, guided tours, or unique local experiences.</p>
            </Card>
          </div>
        </section>

        {/* Host Worry-Free Section */}
        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Host Worry-Free</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {hostBenefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <benefit.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-xl">{benefit.title}</h3>
                <p className="text-muted-foreground mt-2">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted/50 p-8 rounded-lg">
          <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Ready to Join Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Listing is free and easy. Start your journey as a RoamFree partner today and connect with a global audience.
          </p>
          <Button asChild size="lg">
            <Link href="/list-property">Create Your First Listing</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
