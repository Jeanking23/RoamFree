// src/app/for-partners/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, CarFront, Briefcase, Handshake, DollarSign, BarChart3, Rocket } from 'lucide-react';
import Link from 'next/link';

const partnerSections = [
  {
    icon: Building,
    title: "Property & Rental Owners",
    description: "List your homes, villas, apartments, or land. Reach a global audience and manage your listings with our powerful dashboard, pricing tools, and booking calendar.",
    link: "/list-property",
    buttonText: "Become a Property Partner"
  },
  {
    icon: CarFront,
    title: "Vehicle & Transport Partners",
    description: "Whether you're listing a car for sale, offering rental vehicles, or providing ride services, our platform connects you with customers who need to get around.",
    link: "/cars-for-sale/new",
    buttonText: "Join as a Transport Partner"
  },
  {
    icon: Briefcase,
    title: "Corporate & Business Solutions",
    description: "Streamline your company's travel with our business solutions. Get access to exclusive discounts, comprehensive reporting, and centralized billing.",
    link: "/corporate-solutions-demo",
    buttonText: "Contact Corporate Sales"
  },
  {
    icon: Handshake,
    title: "Affiliate Program",
    description: "Join our affiliate program to earn commissions by promoting RoamFree. Get access to marketing materials and track your performance with our dedicated portal.",
    link: "#!",
    buttonText: "Join the Program (Soon)"
  },
];

export default function ForPartnersPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-8 md:p-12">
          <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-4xl font-headline text-primary">
            Partner with RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of partners and unlock new opportunities. Whether you have a property to list, a car to rent, or a business travel need, we have a solution for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {partnerSections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <section.icon className="h-8 w-8 text-accent" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <Button asChild>
                  <Link href={section.link}>
                    {section.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
