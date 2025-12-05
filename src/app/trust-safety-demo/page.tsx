
// src/app/trust-safety-demo/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Users, Video, MessageCircle, Info, BadgeCheck, FileText, Library, AlertTriangle, Send } from 'lucide-react';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const safetyReportSchema = z.object({
  reportType: z.enum(["LISTING_ACCURACY", "USER_CONDUCT", "PAYMENT_ISSUE", "SAFETY_CONCERN", "OTHER"]),
  listingUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
  bookingId: z.string().optional(),
  details: z.string().min(20, "Please provide at least 20 characters of detail.").max(1000),
});

type SafetyReportFormValues = z.infer<typeof safetyReportSchema>;

const safetyFeatures = [
    { icon: Users, title: "User Verification", description: "We employ multiple verification methods to build trust, including standard document checks and advanced video-based confirmation for enhanced identity assurance.", link: "/profile" },
    { icon: Lock, title: "Secure Platform & Payments", description: "Your data and transactions are protected with AI-powered fraud detection and industry-standard encrypted payment processing through our partners.", link: "/profile#wallet" },
    { icon: Library, title: "Property & Vehicle Verification", description: "We encourage transparency by allowing hosts and sellers to upload legal documents like title deeds or vehicle history reports. We're also exploring blockchain for immutable ownership records.", link: "/dashboard" },
    { icon: Info, title: "Travel Information & Support", description: "Stay informed with real-time travel advisories and cultural tips. Communicate securely through our platform and get help 24/7 from our support team or emergency SOS feature.", link: "/contact-support" },
];


export default function TrustSafetyDemoPage() {
    const form = useForm<SafetyReportFormValues>({
        resolver: zodResolver(safetyReportSchema),
    });

    function onSubmit(data: SafetyReportFormValues) {
        console.log("Safety Report:", data);
        toast({
            title: "Report Submitted (Demo)",
            description: "Thank you for helping keep RoamFree safe. Our team will review your report."
        });
        form.reset();
    }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <ShieldCheck className="h-10 w-10" />
            Trust & Safety at RoamFree
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your security and peace of mind are our top priorities. Learn about the measures we take to ensure a safe platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-center">Our Commitment to Safety</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-center">
              At RoamFree, we are dedicated to creating a trustworthy environment for all users. From verifying users to securing transactions, we implement various strategies to protect our community.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            {safetyFeatures.map(feature => (
                 <Card key={feature.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><feature.icon className="h-6 w-6 text-accent"/>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <Button variant="link" asChild className="px-0 mt-2">
                            <Link href={feature.link}>Learn More</Link>
                        </Button>
                    </CardContent>
                 </Card>
            ))}
          </div>
          
            <Card className="bg-muted/50 border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><AlertTriangle className="h-5 w-5"/>Report an Issue</CardTitle>
                    <CardDescription>If you've encountered an issue, please let us know. This helps us maintain a safe community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control} name="reportType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Issue</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select an issue type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="LISTING_ACCURACY">Listing is inaccurate or misleading</SelectItem>
                                        <SelectItem value="USER_CONDUCT">Inappropriate user behavior</SelectItem>
                                        <SelectItem value="PAYMENT_ISSUE">Payment or transaction problem</SelectItem>
                                        <SelectItem value="SAFETY_CONCERN">A safety concern during a trip</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField control={form.control} name="listingUrl" render={({ field }) => (<FormItem><FormLabel>Listing URL (Optional)</FormLabel><FormControl><Input placeholder="https://roamfree.app/stays/..." {...field}/></FormControl><FormMessage/></FormItem>)}/>
                             <FormField control={form.control} name="bookingId" render={({ field }) => (<FormItem><FormLabel>Booking ID (Optional)</FormLabel><FormControl><Input placeholder="e.g., BK123456" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                             <FormField control={form.control} name="details" render={({ field }) => (<FormItem><FormLabel>Detailed Description</FormLabel><FormControl><Textarea placeholder="Please provide a detailed account of the issue." rows={5} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                              <Button type="submit" size="lg" className="w-full sm:w-auto">
                                <span><Send className="mr-2 h-4 w-4"/> Submit Report</span>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </CardContent>
      </Card>
    </div>
  );
}
