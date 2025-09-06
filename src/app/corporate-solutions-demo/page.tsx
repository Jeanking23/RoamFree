// src/app/corporate-solutions-demo/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, BarChart2, Ticket, Building, Percent, FileText, Lock, Calendar, Send, Mail, Phone, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const corporateInquirySchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  contactName: z.string().min(2, "Contact name is required."),
  contactEmail: z.string().email("Please enter a valid email."),
  contactPhone: z.string().optional(),
  serviceOfInterest: z.enum(["GROUP_BOOKINGS", "REPORTING", "LONG_TERM_STAYS", "ALL"]),
  message: z.string().min(10, "Please provide a brief message.").max(500),
});

type CorporateInquiryFormValues = z.infer<typeof corporateInquirySchema>;

const features = [
  { icon: Users, title: "Simplified Group Bookings", description: "Easily book accommodations, transport, and activities for your entire team. Group discounts available." },
  { icon: BarChart2, title: "Comprehensive Reporting", description: "Track expenses, manage budgets, and generate detailed travel reports with our intuitive dashboard." },
  { icon: Percent, title: "Corporate Discounts", description: "Access exclusive rates and benefits for your company's travel needs." },
  { icon: FileText, title: "Centralized Billing", description: "Streamline payments with a single monthly invoice for all your company's travel." },
  { icon: Lock, title: "Custom Travel Policies", description: "Enforce company travel rules with customizable booking policies and approval workflows." },
  { icon: Calendar, title: "Team Travel Calendars", description: "Coordinate schedules and manage group itineraries with a shared team calendar." },
];

export default function CorporateSolutionsDemoPage() {
    const form = useForm<CorporateInquiryFormValues>({
        resolver: zodResolver(corporateInquirySchema),
        defaultValues: { serviceOfInterest: "ALL", companyName: "", contactName: "", contactEmail: "", message: "" }
    });

    function onSubmit(data: CorporateInquiryFormValues) {
        console.log("Corporate Inquiry:", data);
        toast({
            title: "Inquiry Submitted",
            description: "Thank you for your interest! Our sales team will contact you shortly."
        });
        form.reset();
    }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Briefcase className="h-10 w-10" />
            RoamFree for Business
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Streamline your corporate travel and accommodation needs with our tailored, all-in-one solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-center mb-6">Our Business Features</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map(feature => (
                        <Card key={feature.title}>
                            <CardHeader className="pb-4">
                                <feature.icon className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
          
            <Card className="bg-muted/50 border">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Request a Demo or Consultation</CardTitle>
                    <CardDescription>Contact our sales team to learn more about our corporate accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company Inc." icon={<Building className="h-4 w-4 text-muted-foreground" />} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={form.control} name="contactName" render={({ field }) => (<FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input placeholder="John Doe" icon={<User className="h-4 w-4 text-muted-foreground" />} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@company.com" icon={<Mail className="h-4 w-4 text-muted-foreground" />} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input type="tel" placeholder="+1 555-123-4567" icon={<Phone className="h-4 w-4 text-muted-foreground" />} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            </div>
                            <FormField
                                control={form.control} name="serviceOfInterest"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Service of Interest</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="GROUP_BOOKINGS">Group Bookings</SelectItem>
                                        <SelectItem value="REPORTING">Reporting & Dashboards</SelectItem>
                                        <SelectItem value="LONG_TERM_STAYS">Long-term Corporate Stays</SelectItem>
                                        <SelectItem value="ALL">All Services / General Inquiry</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Your Message</FormLabel><FormControl><Textarea placeholder="Tell us about your company's travel needs..." {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                <span><Send className="mr-2 h-4 w-4"/> Submit Inquiry</span>
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
