
// src/app/corporate-solutions-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, BarChart2, Ticket, Building, Percent } from 'lucide-react';
import Link from 'next/link';

export default function CorporateSolutionsDemoPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Briefcase className="h-10 w-10" />
            RoamFree for Business (Demo)
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Streamline your corporate travel and accommodation needs with our tailored solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-accent"/>Simplified Group Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Easily book accommodations, transport, and activities for your entire team. Group discounts available.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 className="h-6 w-6 text-accent"/>Comprehensive Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Track expenses, manage budgets, and generate detailed travel reports with our intuitive dashboard.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Percent className="h-6 w-6 text-accent"/>Corporate Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Access exclusive rates and benefits for your company's travel needs.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold">Interested in RoamFree for your Business?</h3>
            <p className="text-muted-foreground">Contact our sales team to learn more about our corporate accounts and how we can help manage your business travel efficiently.</p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => alert('Contact Sales (Demo)')}>
              Contact Sales (Demo)
            </Button>
          </div>

          <div className="mt-12 border-t pt-8">
            <h4 className="text-xl font-semibold mb-4 text-center">Upcoming Features for Business Accounts:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 max-w-md mx-auto">
              <li>Centralized billing and invoicing.</li>
              <li>Customizable travel policies and approval workflows.</li>
              <li>Dedicated account management.</li>
              <li>Integration with expense management systems.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    