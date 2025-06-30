// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

export default function TransportPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Car className="h-8 w-8" />
            Transport
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This page is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <p className="text-xl font-semibold">Transport options coming soon!</p>
            <p className="text-muted-foreground mt-2">You will be able to book rides, buses, and more from here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
