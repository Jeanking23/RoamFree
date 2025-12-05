
// src/app/press-media/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PressMediaPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Newspaper className="h-10 w-10" />
            Press & Media
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find our latest press releases, media kits, and contact information for press inquiries.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-muted/30 rounded-md">
            <p className="text-xl font-semibold">In the News</p>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              This page is currently under construction. For all media inquiries, please contact our communications team. Our press kit will be available here soon.
            </p>
             <div className="mt-6">
                 <Button asChild>
                    <Link href="/contact-support">
                       <span className="flex items-center gap-2"><Mail className="mr-2 h-4 w-4"/> Contact Us</span>
                    </Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
