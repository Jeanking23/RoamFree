// src/app/our-mission/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Globe, Users } from 'lucide-react';
import Link from 'next/link';

export default function OurMissionPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Rocket className="h-10 w-10" />
            Our Mission
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Discover the vision and values that drive us to innovate in the travel industry.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <p className="text-xl font-semibold">Our Vision for the Future of Travel</p>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              This page is under construction. Our mission is to build a seamless, trustworthy, and comprehensive platform that empowers everyone to explore the world with confidence and joy.
            </p>
             <div className="mt-6">
                 <Button asChild>
                    <Link href="/about">
                       <span><Globe className="mr-2 h-4 w-4"/> About RoamFree</span>
                    </Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
