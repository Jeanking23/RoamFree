// src/app/corporate-solutions-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, BarChart2, Ticket, Building, Percent, FileText, Lock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

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
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({title: 'Contact Sales (Demo)', description: "Opening a contact form or direct email to our sales team."})}>
              Contact Sales (Demo)
            </Button>
          </div>

          <div className="mt-12 border-t pt-8">
            <h4 className="text-xl font-semibold mb-4 text-center">Upcoming Features for Business Accounts:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground max-w-2xl mx-auto">
              <li className="flex items-start gap-2"><FileText className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />Centralized billing and invoicing.</li>
              <li className="flex items-start gap-2"><Lock className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />Customizable travel policies and approval workflows.</li>
              <li className="flex items-start gap-2"><Briefcase className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />Dedicated account management.</li>
              <li className="flex items-start gap-2"><BarChart2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />Integration with expense management systems.</li>
              <li className="flex items-start gap-2"><Calendar className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />Team travel calendars and group itinerary planning.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
