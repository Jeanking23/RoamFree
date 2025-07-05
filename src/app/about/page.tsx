// src/app/about/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Users, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Info className="h-10 w-10" />
            About RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Learn more about our company, our story, and the team behind RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <p className="text-xl font-semibold">Our Story is Still Being Written</p>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              This page is currently under construction. We're excited to share more about our journey and the passionate team dedicated to making travel easier and more accessible for everyone.
            </p>
            <div className="mt-6 flex justify-center gap-4">
                 <Button asChild>
                    <Link href="/our-mission">
                        <Rocket className="mr-2 h-4 w-4"/> Our Mission
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/careers">
                       <Users className="mr-2 h-4 w-4"/> Join Our Team
                    </Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
