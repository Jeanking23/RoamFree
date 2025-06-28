// src/app/trust-safety-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Users, Video, MessageCircle, Info, BadgeCheck, FileText, Library } from 'lucide-react';
import Link from 'next/link';

export default function TrustSafetyDemoPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <ShieldCheck className="h-10 w-10" />
            Trust & Safety at RoamFree (Demo)
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your security and peace of mind are our top priorities. Learn about the measures we take to ensure a safe platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Our Commitment to Safety</h2>
            <p className="text-muted-foreground">
              At RoamFree, we are dedicated to creating a trustworthy environment for all users. From verifying users to securing transactions, we implement various strategies to protect our community.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-accent"/>User Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">We employ multiple verification methods to build trust:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                  <li><strong>ID Verification (Demo):</strong> Secure document checks for hosts, renters, and buyers.</li>
                  <li><strong>Video ID Verification (Demo):</strong> Advanced video-based checks for enhanced identity confirmation.</li>
                  <li><strong>Verified Reviews:</strong> Only users who have completed a booking can leave reviews, ensuring authenticity.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-6 w-6 text-accent"/>Secure Platform & Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 <p className="text-sm text-muted-foreground">Your data and transactions are protected:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                  <li><strong>AI Smart Fraud Detection (Demo):</strong> Our systems monitor for suspicious activities and payment anomalies.</li>
                  <li><strong>Secure Payment Processing (Demo):</strong> Industry-standard encryption for all financial transactions. We partner with Stripe for secure payment handling.</li>
                   <li><strong>Secure Escrow Service (Demo):</strong> For high-value transactions like property or car sales, funds are held securely until both parties are satisfied.</li>
                </ul>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Library className="h-6 w-6 text-accent"/>Property & Vehicle Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">We encourage transparency for high-value assets:</p>
                 <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                    <li><strong>Document Upload (Demo):</strong> Sellers can upload legal documents like title deeds or vehicle history reports.</li>
                    <li><strong>Blockchain Verification (Future Feature):</strong> Exploring blockchain for transparent proof of property ownership and secure transaction records.</li>
                 </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-6 w-6 text-accent"/>Travel Information & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Stay informed and get help when you need it:</p>
                 <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                    <li><strong>Secure Communication:</strong> Communicate safely through our platform's encrypted messaging system.</li>
                    <li><strong>Cultural Tips & Travel Advisories (Demo):</strong> Real-time safety info and etiquette guides.</li>
                    <li><strong>24/7 Customer Support (Demo):</strong> Our AI chatbot and human support team are here to assist.</li>
                    <li><strong>SOS Emergency Feature (Demo):</strong> Quick access to help in urgent situations.</li>
                 </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground">Have questions or need to report an issue? Our support team is ready to help.</p>
            <Button asChild className="mt-2">
              <Link href="/contact-support">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
