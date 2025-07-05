// src/app/careers/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Building } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Briefcase className="h-10 w-10" />
            Careers at RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Join our team and help us shape the future of travel. Explore open positions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <p className="text-xl font-semibold">Join Our Adventure!</p>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              This page is currently under construction. We are always looking for talented individuals to join our team. Check back soon for job postings.
            </p>
             <div className="mt-6">
                 <Button asChild>
                    <Link href="/about">
                       <Building className="mr-2 h-4 w-4"/> Learn More About Us
                    </Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
