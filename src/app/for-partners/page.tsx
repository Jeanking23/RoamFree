// src/app/for-partners/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MessageSquare, BarChart3, Rocket, Home, CarFront, Users, DollarSign, Lock, UserCheck, Settings, Upload, CheckCircle, BadgePlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

const partnerTools = [
    {
        id: "financial",
        title: "Financial & Payment Control",
        icon: DollarSign,
        points: [
            "Choose between instant bookings or a 'Request to Book' option.",
            "Daily payouts at guest check-in.",
            "Waived bank transfer fees through 2025.",
            "The platform facilitates the payment process for you.",
            "Get group invoicing, reconciliation, and auto-onboarding for new properties."
        ]
    },
    {
        id: "safety",
        title: "Protection & Safety",
        icon: Lock,
        points: [
            "Protection against liability claims from guests and neighbors up to $/€/£1,000,000 for every reservation.",
            "Options for damage protection.",
        ]
    },
    {
        id: "guest",
        title: "Guest Management",
        icon: UserCheck,
        points: [
            "Set up clear house rules.",
            "Pre-booking messaging to chat with guests before accepting their stay.",
            "Access guest travel history insights."
        ]
    },
    {
        id: "getting_started",
        title: "Getting Started",
        icon: Settings,
        points: [
            "Import property details from other travel sites.",
            "Sync your calendar to avoid double bookings.",
            "Your review scores from other travel sites can be converted and displayed.",
            "A 'New to RoamFree' label helps your listing stand out."
        ]
    }
];

const animatedHeadlines = [
    "Become a RoamFree Partner",
    "List Your Property",
    "Rent Out Your Car",
    "Offer Experiences"
];

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            {...props}
        >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
        </svg>
    );
}


export default function ForPartnersPage() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prevIndex) => (prevIndex + 1) % animatedHeadlines.length);
    }, 3000); // Change headline every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 -mt-8 -mx-4 md:mt-0 md:mx-0">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3N0JTIwaG91c2V8ZW58MHx8fHwxNzU4NzM3OTQwfDA&ixlib-rb-4.1.0&q=80&w=1080"
          alt="Beautiful modern living room"
          fill
          className="object-cover"
          data-ai-hint="host house"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
             <div className="h-24 md:h-28">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={headlineIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-headline font-bold leading-tight"
                    >
                        {animatedHeadlines[headlineIndex]}
                    </motion.h1>
                </AnimatePresence>
            </div>
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
               <Button variant="outline" className="w-full">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign up with Google
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or
                        </span>
                    </div>
                </div>
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

        {/* Powerful Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Powerful Tools for Partners</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {partnerTools.map((tool) => (
                <AccordionItem value={tool.id} key={tool.id} className="border-b-0 mb-2">
                    <Card className="bg-muted/30">
                        <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold p-6">
                            <div className="flex items-center gap-3">
                                <tool.icon className="h-6 w-6 text-primary"/>
                                {tool.title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base px-6">
                            <ul className="space-y-2 pl-4">
                                {tool.points.map((point, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-3 mt-1 text-green-500 flex-shrink-0"/>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
              ))}
            </Accordion>
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
