// src/app/for-partners/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const registrationBenefits = [
  "45% of hosts get their first booking within a week",
  "Choose instant bookings or Request to Book",
  "We'll facilitate payments for you",
  "Daily payouts at guest check-in",
  "Waived bank transfer fees for new partners",
];

const hostBenefits = [
    { 
        title: "Your rental, your rules",
        items: [
            "Accept or decline bookings with Request to Book.",
            "Manage guests' expectations by setting up clear house rules.",
        ]
    },
    { 
        title: "Get to know your guests",
        items: [
            "Chat with guests before accepting their stay with pre-booking messaging.",
            "Access guest travel history insights.",
        ]
    },
    { 
        title: "Stay protected",
        items: [
            "Protection against liability claims from guests and neighbors.",
            "Selection of damage protection options to choose from.",
        ]
    },
];

export default function ForPartnersPage() {
  return (
    <div className="space-y-0 md:-mt-8 md:-mx-8">
      <div className="bg-primary text-primary-foreground p-6 md:p-12 lg:p-16">
        <div className="container mx-auto">
            <div className="bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-full inline-block mb-8">
                Join thousands of other listings already on RoamFree
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">List your property on RoamFree</h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 max-w-lg">
                        List on one of the world's most downloaded travel apps to earn more, faster, and expand into new markets.
                    </p>
                </div>
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Register for free</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ul className="space-y-2">
                            {registrationBenefits.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button asChild size="lg" className="w-full text-lg py-6">
                            <Link href="/signup">
                                Get started now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                         <div className="text-center pt-2">
                            <p className="text-sm">Already started registration? <Link href="/signin" className="text-primary hover:underline">Continue your registration</Link></p>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
      
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Host worry-free. We've got your back</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                {hostBenefits.map(section => (
                    <div key={section.title}>
                        <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                        <ul className="space-y-3">
                            {section.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Check className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <Button asChild size="lg" className="mt-12">
                <Link href="/list-property">
                    Host with us today
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">*Feature availability may vary based on your listing type and location.</p>
        </div>
      </div>
    </div>
  );
}
