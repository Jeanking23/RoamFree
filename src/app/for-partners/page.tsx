// src/app/for-partners/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, Car, Users, BarChart2, Handshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const partnerSections = [
  {
    icon: Building,
    title: "Property & Rental Owners",
    description: "List your homes, villas, apartments, or land. Reach a global audience and manage your listings with our powerful dashboard, pricing tools, and booking calendar.",
    cta: "List Your Property",
    link: "/list-property",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8MTc1Mzg3OTU3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "house exterior"
  },
  {
    icon: Car,
    title: "Vehicle & Transport Partners",
    description: "Whether you're listing a car for sale, offering rental vehicles, or providing ride services, our platform connects you with customers who need to get around.",
    cta: "Manage Your Fleet",
    link: "/dashboard",
    image: "https://images.unsplash.com/photo-1554224024-81a1b8a24c25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYXIlMjBmbGVldHxlbnwwfHx8fDE3NTM4Nzk1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "car fleet"
  },
  {
    icon: Handshake,
    title: "Corporate & Business Solutions",
    description: "Streamline your company's travel with our business solutions. Get access to exclusive discounts, comprehensive reporting, and centralized billing.",
    cta: "Contact Corporate Sales",
    link: "/corporate-solutions-demo",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNzUzODc5NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "business meeting"
  },
  {
    icon: BarChart2,
    title: "Affiliate Program",
    description: "Join our affiliate program to earn commissions by promoting RoamFree. Get access to marketing materials and track your performance with our dedicated portal.",
    cta: "Join the Program (Soon)",
    link: "#!",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxhZmZpbGlhdGUlMjBtYXJrZXRpbmd8ZW58MHx8fHwxNzUzODc5NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "affiliate marketing"
  },
];

export default function ForPartnersPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10 text-center p-8 md:p-12">
          <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl md:text-4xl font-headline text-primary">
            Partner with RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our network of partners and unlock new opportunities. Whether you have a property to list, a car to rent, or a business travel need, we have a solution for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {partnerSections.map((section) => (
              <Card key={section.title} className="overflow-hidden group flex flex-col">
                <div className="relative h-48 w-full">
                  <Image src={section.image} alt={section.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={section.dataAiHint} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                 <div className="p-6 flex flex-col flex-grow">
                    <section.icon className="h-8 w-8 text-accent mb-3" />
                    <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground flex-grow mb-4">{section.description}</p>
                    <Button asChild>
                      <Link href={section.link}>
                        {section.cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                 </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
